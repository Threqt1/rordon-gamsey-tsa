/**
 * PRIORITY:
 * OBJECT POOLING, REXAMINE TWEENS IF POSSIBLE
 * FIX THE BAD DESIGN
 */

import { SceneName } from "../enums/sceneNames";
import MinigameApple from "../sprites/minigame/items/apple";
import { MinigameItem } from "../sprites/minigame/items/base";
import MinigameMegaPumpkin from "../sprites/minigame/items/mega_pumpkin";
import MinigamePumpkin from "../sprites/minigame/items/pumpkin";
import MinigameNPC from "../sprites/minigame/npc";
import MinigamePlayer from "../sprites/minigame/player";
import { switchSceneFadeIn, switchScenesFadeOut } from "../util/fades";
import { LoadTilemap } from "../util/tilemaps";

enum Item {
    APPLE,
    PUMPKIN,
    MEGA_PUMPKIN
}

const LEVELS: Item[][] = [
    // [Item.APPLE],
    // [Item.PUMPKIN],
    // [Item.APPLE, Item.PUMPKIN],
    // [Item.PUMPKIN, Item.APPLE, Item.PUMPKIN],
    // [Item.APPLE, Item.MEGA_PUMPKIN, Item.APPLE]

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

const START_X = 60
const END_X = 430
const MIN_Y = 30
const MAX_Y = 110

const TWEENS_TIME_DELAY = 0.8
const ANIMS_TIME_DELAY = 0.4
const GRAYSCALE = 0.6

export default class MinigameScene extends Phaser.Scene {
    private _levelActive: boolean
    private _currentLevel: number

    private _colorMatrices: Phaser.FX.ColorMatrix[] = []
    private _playerDepth!: number

    private _music!: Phaser.Sound.WebAudioSound

    private _switching: boolean = false

    private _eventEmitter: MinigameEventEmitter

    constructor() {
        super(SceneName.Minigame)

        this._levelActive = false
        this._currentLevel = -1;
        this._eventEmitter = new MinigameEventEmitter()
    }

    create(data: { fade: boolean }) {
        this.sprites.use();

        this._music = this.sound.add("osbg") as Phaser.Sound.WebAudioSound
        this._music.play({ loop: true })
        this._music.volume = 0.5

        this.sys.events.on("shutdown", () => {
            this.cleanup()
        })

        let { map, playerDepth } = LoadTilemap(this, "test2")

        this._playerDepth = playerDepth

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        camera.setZoom(this.scale.width / map.widthInPixels)

        let player = new MinigamePlayer(this, 450, 70)
        let npc = new MinigameNPC(this, 30, 70)

        this.sprites.addSprites(player, npc)
        this.sprites.getBodyGroup().setDepth(playerDepth)

        for (let sprite of this.sprites.getBodies()) {
            this._colorMatrices.push(sprite.postFX!.addColorMatrix())
        }
        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this._colorMatrices.push(layer.tilemapLayer.postFX!.addColorMatrix())
        }

        if (data !== undefined) {
            if (data.fade) switchSceneFadeIn(this)
        }
    }

    private timeTransition(on: boolean, tweens: Phaser.Tweens.Tween[], colorMatrices: Phaser.FX.ColorMatrix[], callback?: () => void) {
        const tweenTimeDelayTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: tweens,
            timeScale: on ? TWEENS_TIME_DELAY : 1,
            duration: MINIGAME_FADE_DURATION,
            onComplete: callback
        }
        const animationTimeDelayTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: this.anims,
            globalTimeScale: on ? ANIMS_TIME_DELAY : 1,
            duration: MINIGAME_FADE_DURATION
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
        this.tweens.addMultiple([tweenTimeDelayTween, animationTimeDelayTween, grayscaleTween])
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

        let yIncrement = (MAX_Y - MIN_Y) / levelData.length
        for (let i = 0; i < levelData.length; i++) {
            let item: MinigameItem | null = null
            let itemInfo = {
                spriteDepth: this._playerDepth,
                endX: END_X,
                duration: MINIGAME_TOTAL_DURATION
            }
            switch (levelData[i]) {
                case Item.APPLE:
                    item = new MinigameApple(this, START_X, MIN_Y + yIncrement * (i), itemInfo)
                    break;
                case Item.PUMPKIN:
                    item = new MinigamePumpkin(this, START_X, MIN_Y + yIncrement * (i), itemInfo)
                    break;
                case Item.MEGA_PUMPKIN:
                    item = new MinigameMegaPumpkin(this, START_X, MIN_Y + yIncrement * (i), itemInfo)
                    break;
            }
            if (item === null) continue

            item.getEventEmitter().once("success", () => {
                progressItems(i)
            })
            item.getEventEmitter().once("fail", () => {
                if (!this._switching) {
                    this._switching = true
                    switchScenesFadeOut(this, SceneName.Menu)
                }
            })

            tweens.push(...item.getTweens())
            colorMatrices.push(item.getColorMatrix())
            items.push(item)
        }

        let delayInterval = (MINIGAME_START_TIME - 30) / items.length
        for (let i = 0; i < items.length; i++) {
            this.time.delayedCall(delayInterval * i, () => {
                items[i].ready()
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