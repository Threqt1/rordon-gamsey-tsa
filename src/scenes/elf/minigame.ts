/**
 * PRIORITY:
 * OBJECT POOLING, REXAMINE TWEENS IF POSSIBLE
 * FIX THE BAD DESIGN
 */

import Apple from "../../sprites/elf/minigame/items/apple";
import { MinigameItem } from "../../sprites/elf/minigame/items/base";
import MegaPumpkin from "../../sprites/elf/minigame/items/mega_pumpkin";
import Pumpkin from "../../sprites/elf/minigame/items/pumpkin";
import NPC from "../../sprites/elf/minigame/npc";
import Player from "../../sprites/elf/minigame/player";
import { loadTilemap, SceneEnum, switchScenesFadeOut } from "../scenesUtilities";

enum Item {
    APPLE,
    PUMPKIN,
    MEGA_PUMPKIN
}

const LEVELS: Item[][] = [
    [Item.APPLE],
    [Item.PUMPKIN, Item.APPLE],
    [Item.APPLE, Item.PUMPKIN, Item.APPLE],
    [Item.PUMPKIN, Item.APPLE, Item.PUMPKIN],
    [Item.MEGA_PUMPKIN],
    [Item.APPLE, Item.PUMPKIN, Item.APPLE, Item.PUMPKIN, Item.APPLE],
    [Item.MEGA_PUMPKIN],
    [Item.PUMPKIN, Item.MEGA_PUMPKIN, Item.APPLE, Item.MEGA_PUMPKIN, Item.PUMPKIN],
    [Item.MEGA_PUMPKIN],
    [Item.MEGA_PUMPKIN, Item.MEGA_PUMPKIN, Item.PUMPKIN, Item.MEGA_PUMPKIN, Item.MEGA_PUMPKIN],
    [Item.APPLE],
    [Item.PUMPKIN],
    [Item.APPLE, Item.PUMPKIN],
    [Item.PUMPKIN, Item.APPLE, Item.PUMPKIN],
    [Item.APPLE, Item.MEGA_PUMPKIN, Item.APPLE]
]

const MINIGAME_FADE_DURATION = 500
const MINIGAME_TOTAL_DURATION = 5000
const MINIGAME_START_TIME = MINIGAME_TOTAL_DURATION / 2.5
const MINIGAME_LEVEL_COOLDOWN = 2000

const START_X = 85
const END_X = 400
const MIN_Y = 225 - 50
const MAX_Y = 225 + 50

const TWEENS_TIME_DELAY = 0.8
const GRAYSCALE = 0.6

export default class ElfMinigameScene extends Phaser.Scene {
    private _levelActive: boolean
    private _currentLevel: number

    private _colorMatrices: Phaser.FX.ColorMatrix[] = []
    private _playerDepth!: number

    private _music!: Phaser.Sound.WebAudioSound

    private _switching: boolean = false

    private _eventEmitter: MinigameEventEmitter

    constructor() {
        super(SceneEnum.SceneName.Minigame)

        this._levelActive = false
        this._currentLevel = -1;
        this._eventEmitter = new MinigameEventEmitter()
    }

    create() {
        this.sprites.initialize();

        this._music = this.sound.add("osbg") as Phaser.Sound.WebAudioSound
        this._music.play({ loop: true })
        this._music.volume = 0.4

        this.sys.events.on("shutdown", () => {
            this.cleanup()
        })

        let { map, playerDepth } = loadTilemap(this, "minigame")

        this._playerDepth = playerDepth

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        if (this.scale.height > this.scale.width) {
            camera.setZoom(this.scale.width / map.widthInPixels)
        } else[
            camera.setZoom(this.scale.height / map.heightInPixels)
        ]

        let player = new Player(this, END_X + 30, 225)
        let npc = new NPC(this, START_X - 30, 225)

        this.sprites.addSprites(player.sprite, npc.sprite)
        this.sprites.physicsBodies.setDepth(100)

        for (let sprite of this.sprites.getPhysicsSprites()) {
            this._colorMatrices.push(sprite.postFX!.addColorMatrix())
        }
        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this._colorMatrices.push(layer.tilemapLayer.postFX!.addColorMatrix())
        }
    }

    private timeTransition(on: boolean, tweens: Phaser.Tweens.Tween[], colorMatrices: Phaser.FX.ColorMatrix[], callback?: () => void) {
        const tweenTimeDelayTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: tweens,
            timeScale: on ? TWEENS_TIME_DELAY : 1,
            duration: MINIGAME_FADE_DURATION,
            onComplete: callback
        }
        const grayscaleTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: on ? 0 : GRAYSCALE },
            value: on ? GRAYSCALE : 0,
            duration: MINIGAME_FADE_DURATION,
            onUpdate: (tween) => {
                for (let colorMatrix of colorMatrices) {
                    colorMatrix.grayscale(tween.getValue())
                }
            }
        }
        this.tweens.addMultiple([tweenTimeDelayTween, grayscaleTween])
    }

    private activateLevel() {
        this._levelActive = true;
        this._currentLevel++;
        if (this._currentLevel >= LEVELS.length) this._currentLevel = 0

        let levelData = LEVELS[this._currentLevel]
        let tweens: Phaser.Tweens.Tween[] = []
        let colorMatrices = [...this._colorMatrices]
        let items: MinigameItem[] = []

        const progressItems = (i: number) => {
            if (i + 1 < items.length) {
                items[i + 1].start()
            } else {
                this._eventEmitter.emit("done")
            }
        }

        let yIncrement = (MAX_Y - MIN_Y) / (levelData.length + 1)

        for (let i = 0; i < levelData.length; i++) {
            let item: MinigameItem | null = null
            let itemInfo = {
                spriteDepth: this._playerDepth,
                endX: END_X,
                duration: MINIGAME_TOTAL_DURATION
            }
            let y = MIN_Y + yIncrement * (i + 1)
            switch (levelData[i]) {
                case Item.APPLE:
                    item = new Apple(this, START_X, y, itemInfo)
                    break;
                case Item.PUMPKIN:
                    item = new Pumpkin(this, START_X, y, itemInfo)
                    break;
                case Item.MEGA_PUMPKIN:
                    item = new MegaPumpkin(this, START_X, y, itemInfo)
                    break;
            }
            if (item === null) continue

            item.getEventEmitter().once("success", () => {
                progressItems(i)
            })
            item.getEventEmitter().once("fail", () => {
                if (!this._switching) {
                    this._switching = true
                    switchScenesFadeOut(this, SceneEnum.SceneName.Menu)
                }
            })

            tweens.push(...item.getTweens())
            colorMatrices.push(item.getColorMatrix())
            items.push(item)
        }

        let delayInterval = (MINIGAME_START_TIME - 30) / items.length
        for (let i = 0; i < items.length; i++) {
            this.time.delayedCall(delayInterval * i, () => {
                items[i].prepare()
            })
        }

        this.time.delayedCall(MINIGAME_START_TIME - MINIGAME_FADE_DURATION, () => this.timeTransition(true, tweens, colorMatrices, () => { items[0].start() }))

        this._eventEmitter.once("done", () => {
            items = []
            this.timeTransition(false, [], this._colorMatrices, () => {
                this.time.delayedCall(MINIGAME_LEVEL_COOLDOWN, () => {
                    this._levelActive = false
                })
            })
        })
    }

    update() {
        if (!this._levelActive) {
            this.activateLevel()
        }
    }

    private cleanup() {
        this._levelActive = false
        this._currentLevel = -1
        this._switching = false
        this._colorMatrices = []
        this._music.destroy()
    }
}

type MinigameEvents = {
    done: []
}

class MinigameEventEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    public override emit<K extends keyof MinigameEvents>(
        eventName: K,
        ...args: MinigameEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    public override once<K extends keyof MinigameEvents>(
        eventName: K,
        listener: (...args: MinigameEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}