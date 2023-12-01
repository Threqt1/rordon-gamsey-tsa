/**
add gameobjects on tiled to specify where fruits spawn/end/chara positions
 */

import { Fruit, Apple, Pumpkin, MegaPumpkin, Fruits, FruitEventName, FruitInformation } from "../../sprites/elf/minigame/items";
import { NPC, Player } from "../../sprites/elf/minigame"
import { loadTilemap, scaleAndConfigureCamera, SceneEnums, switchScenesFadeOut } from "../scenesUtilities";
import { SlashesTexture, ElvesTexture, ItemsTexture } from "../../textures/elf/minigame";

const LEVEL_SCHEMATICS: Fruits[][] = [
    [Fruits.APPLE],
    [Fruits.PUMPKIN, Fruits.APPLE],
    [Fruits.APPLE, Fruits.PUMPKIN, Fruits.APPLE],
    [Fruits.PUMPKIN, Fruits.APPLE, Fruits.PUMPKIN],
    [Fruits.PUMPKIN, Fruits.PUMPKIN, Fruits.APPLE, Fruits.PUMPKIN, Fruits.PUMPKIN],
    [Fruits.MEGA_PUMPKIN],
    [Fruits.MEGA_PUMPKIN, Fruits.PUMPKIN, Fruits.MEGA_PUMPKIN],
    [Fruits.PUMPKIN, Fruits.MEGA_PUMPKIN, Fruits.APPLE, Fruits.MEGA_PUMPKIN, Fruits.PUMPKIN]
]

const MINIGAME_FADE_DURATION = 500
const MINIGAME_TOTAL_DURATION = 5000
const MINIGAME_START_TIME = MINIGAME_TOTAL_DURATION / 2.5
const MINIGAME_DISPLAY_FRUITS_TIME = MINIGAME_START_TIME - 30
const MINIGAME_LEVEL_COOLDOWN = 2000
const MINIGAME_SPRITE_OFFSET = 30;
const MINIGAME_SPRITE_Y = 225;
const MINIGAME_START_X = 85
const MINIGAME_END_X = 400
const MINIGAME_MIN_Y = 175
const MINIGAME_MAX_Y = 275
const MINIGAME_TIME_DELAY = 0.8
const MINIGAME_GRAYSCALE_FACTOR = 0.6

enum MinigameEventNames {
    DONE = "done"
}

type MinigameEvents = {
    [MinigameEventNames.DONE]: []
}

class MinigameEventEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    override emit<K extends keyof MinigameEvents>(
        eventName: K,
        ...args: MinigameEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    override once<K extends keyof MinigameEvents>(
        eventName: K,
        listener: (...args: MinigameEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}

export class ElfMinigameScene extends Phaser.Scene {
    private isLevelActive: boolean
    private currentLevelIndex: number
    private colorMatrices: Phaser.FX.ColorMatrix[] = []
    private playerSpriteDepth!: number
    private gameEnded: boolean = false
    private eventEmitter: MinigameEventEmitter

    constructor() {
        super(SceneEnums.SceneNames.Minigame)

        this.isLevelActive = false
        this.currentLevelIndex = -1;
        this.eventEmitter = new MinigameEventEmitter()
    }

    preload() {
        SlashesTexture.preload(this)
        ElvesTexture.preload(this)
        ItemsTexture.preload(this)
    }

    create() {
        SlashesTexture.load(this)
        ElvesTexture.load(this)
        ItemsTexture.load(this)

        this.sprites.initialize();

        this.sys.events.on("shutdown", () => {
            this.cleanup()
        })

        let { map, playerDepth } = loadTilemap(this, "minigame")

        this.playerSpriteDepth = playerDepth

        scaleAndConfigureCamera(this, map)

        let player = new Player(this, MINIGAME_END_X + MINIGAME_SPRITE_OFFSET, MINIGAME_SPRITE_Y)
        let npc = new NPC(this, MINIGAME_START_X - MINIGAME_SPRITE_OFFSET, MINIGAME_SPRITE_Y)

        this.sprites.addSprites(player.sprite, npc.sprite)
        this.sprites.physicsBodies.setDepth(100)

        for (let sprite of this.sprites.getPhysicsSprites()) {
            this.colorMatrices.push(sprite.postFX!.addColorMatrix())
        }

        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this.colorMatrices.push(layer.tilemapLayer.postFX!.addColorMatrix())
        }
    }

    timeSlowdownTransition(reverse: boolean, tweens: Phaser.Tweens.Tween[], colorMatrices: Phaser.FX.ColorMatrix[], callback?: () => void) {
        const timeScaleTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: tweens,
            timeScale: reverse ? MINIGAME_TIME_DELAY : 1,
            duration: MINIGAME_FADE_DURATION,
            onComplete: callback
        }
        const grayscaleTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: reverse ? 0 : MINIGAME_GRAYSCALE_FACTOR },
            value: reverse ? MINIGAME_GRAYSCALE_FACTOR : 0,
            duration: MINIGAME_FADE_DURATION,
            onUpdate: (tween) => {
                for (let colorMatrix of colorMatrices) {
                    colorMatrix.grayscale(tween.getValue())
                }
            }
        }
        this.tweens.addMultiple([timeScaleTween, grayscaleTween])
    }

    getFruitObject(fruit: Fruits, y: number, info: FruitInformation) {
        switch (fruit) {
            case Fruits.APPLE:
                return new Apple(this, MINIGAME_START_X, y, info)
            case Fruits.PUMPKIN:
                return new Pumpkin(this, MINIGAME_START_X, y, info)
            case Fruits.MEGA_PUMPKIN:
                return new MegaPumpkin(this, MINIGAME_START_X, y, info)
        }
    }

    startNextLevel() {
        this.isLevelActive = true;
        this.currentLevelIndex++;

        if (this.currentLevelIndex >= LEVEL_SCHEMATICS.length) this.currentLevelIndex = 0

        let fruitsInLevelSchematic = LEVEL_SCHEMATICS[this.currentLevelIndex]
        let tweens: Phaser.Tweens.Tween[] = []
        let colorMatrices = [...this.colorMatrices]
        let fruitsInGame: Fruit[] = []

        const progressFruits = (fruitIndex: number) => {
            if (fruitIndex + 1 < fruitsInGame.length) {
                fruitsInGame[fruitIndex + 1].start()
            } else {
                this.eventEmitter.emit(MinigameEventNames.DONE)
            }
        }

        let yIncrement = (MINIGAME_MAX_Y - MINIGAME_MIN_Y) / (fruitsInLevelSchematic.length + 1)
        const fruitInfo = {
            spriteDepth: this.playerSpriteDepth,
            endX: MINIGAME_END_X,
            lifetime: MINIGAME_TOTAL_DURATION
        }

        for (let i = 0; i < fruitsInLevelSchematic.length; i++) {
            let y = MINIGAME_MIN_Y + yIncrement * (i + 1)
            let fruit = this.getFruitObject(fruitsInLevelSchematic[i], y, fruitInfo)

            fruit.eventEmitter.once(FruitEventName.SUCCESS, () => {
                progressFruits(i)
            })
            fruit.eventEmitter.once(FruitEventName.FAIL, () => {
                if (!this.gameEnded) {
                    this.gameEnded = true
                    switchScenesFadeOut(this, SceneEnums.SceneNames.Menu)
                }
            })

            tweens.push(...fruit.tweens)
            colorMatrices.push(fruit.colorMatrix)
            fruitsInGame.push(fruit)
        }

        let delayBetweenFruits = MINIGAME_DISPLAY_FRUITS_TIME / fruitsInGame.length
        for (let i = 0; i < fruitsInGame.length; i++) {
            this.time.delayedCall(delayBetweenFruits * i, () => {
                fruitsInGame[i].prepare()
            })
        }

        this.time.delayedCall(MINIGAME_START_TIME - MINIGAME_FADE_DURATION, () => this.timeSlowdownTransition(true, tweens, colorMatrices, () => { fruitsInGame[0].start() }))

        this.eventEmitter.once(MinigameEventNames.DONE, () => {
            fruitsInGame = []
            this.timeSlowdownTransition(false, [], this.colorMatrices, () => {
                this.time.delayedCall(MINIGAME_LEVEL_COOLDOWN, () => {
                    this.isLevelActive = false
                })
            })
        })
    }

    update() {
        if (!this.isLevelActive) {
            this.startNextLevel()
        }
    }

    cleanup() {
        this.isLevelActive = false
        this.currentLevelIndex = -1
        this.gameEnded = false
        this.colorMatrices = []
    }
}