import { MinigameSprites } from "../sprites"
import { SpriteUtil, SceneUtil } from "../../shared/util";
import { TorchesTexture } from "../textures";
import { MinigameDialogue } from "../dialogue/";
import { SceneEnums } from "../../shared/repository";
import { Player } from "../../shared/sprites/player";

enum ElfMinigameEvents {
    DONE = "done"
}

type ElfMinigameMarkers = {
    Torch1: SceneUtil.PointObject
    Torch2: SceneUtil.PointObject
    Torch3: SceneUtil.PointObject
    Torch4: SceneUtil.PointObject
    Torch5: SceneUtil.PointObject
    Elf: SceneUtil.PointObject
    Player: SceneUtil.PointObject
    MinY: SceneUtil.PointObject
    MaxY: SceneUtil.PointObject
    StartX: SceneUtil.PointObject
    EndX: SceneUtil.PointObject
}

const FRUIT_TYPE = MinigameSprites.Fruits.FruitType

/*
orc levels = [
    1, 2, 3, 4, 5, 6, 7, 8
]
*/

/**
 * What combination of fruits will be thrown every level
 */
const LEVEL_LAYOUTS: MinigameSprites.Fruits.FruitType[][] = [
    [FRUIT_TYPE.APPLE],
    [FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.APPLE],
    [FRUIT_TYPE.APPLE, FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.APPLE],
    [FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.APPLE, FRUIT_TYPE.PUMPKIN],
    [FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.APPLE, FRUIT_TYPE.PUMPKIN, FRUIT_TYPE.PUMPKIN]
]

/**
 * How long it should take for the fade and grayscale transitions to work
 */
const MINIGAME_FADE_DURATION = 500
const MINIGAME_TOTAL_DURATION = 5000
/**
 * At what time the minigame should allow player input
 */
const MINIGAME_START_TIME = MINIGAME_TOTAL_DURATION / 2.5
/**
 * At what time the fruits should be displayed
 */
const MINIGAME_DISPLAY_FRUITS_TIME = MINIGAME_START_TIME - 30
const MINIGAME_LEVEL_COOLDOWN = 1300
/**
 * Delay after the torch for the level has been lit before the minigame
 * begins
 */
const MINIGAME_TORCH_DELAY = 500
const MINIGAME_TIME_SCALE = 0.8
const MINIGAME_GRAYSCALE_SCALE = 0.6
const MINIMUM_LEVEL_PASSED = 3

export class ElfMinigameScene extends Phaser.Scene {
    currentLevelIndex!: number
    cameraColorMatrix!: Phaser.FX.ColorMatrix
    playerSpriteDepth!: number
    gameEnded!: boolean
    gameEvents!: Phaser.Events.EventEmitter
    torches!: Phaser.GameObjects.Sprite[]
    markers!: ElfMinigameMarkers

    constructor() {
        super(SceneEnums.Name.ElfMinigame)
    }

    create() {
        /* MAP LOADING */
        let { map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.ElfMinigame)
        this.markers = objects as ElfMinigameMarkers

        this.sprites.initialize(map);
        let music = this.sound.add(SceneEnums.Music.ElfMinigame)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play("", {
            loop: true
        })

        /* SPRITES LOADING */
        let player = new Player(this, this.markers.Player.x, this.markers.Player.y)
        player.direction = SpriteUtil.Direction.LEFT
        player.setControllable(false)
        player.sprite.setDepth(playerSpriteDepth)

        let npc = new MinigameSprites.ElfMinigameNPC(this, this.markers.Elf.x, this.markers.Elf.y)
        npc.sprite.setDepth(playerSpriteDepth)

        let torch1 = this.add
            .sprite(this.markers.Torch1.x, this.markers.Torch1.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch1)
            .setDepth(playerSpriteDepth)
        let torch2 = this.add
            .sprite(this.markers.Torch2.x, this.markers.Torch2.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch2)
            .setDepth(playerSpriteDepth)
        let torch3 = this.add
            .sprite(this.markers.Torch3.x, this.markers.Torch3.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch3)
            .setDepth(playerSpriteDepth)
        let torch4 = this.add
            .sprite(this.markers.Torch4.x, this.markers.Torch4.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch4)
            .setDepth(playerSpriteDepth)
        let torch5 = this.add
            .sprite(this.markers.Torch5.x, this.markers.Torch5.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch5)
            .setDepth(playerSpriteDepth)

        this.torches = [torch1, torch2, torch3, torch4, torch5]

        /* CAMERA CONFIGURATION */
        SceneUtil.scaleAndConfigureCamera(this, map)

        /* VARIABLE INITIALIZATION */
        this.currentLevelIndex = -1
        this.gameEnded = false
        this.gameEvents = new Phaser.Events.EventEmitter()
        this.playerSpriteDepth = playerSpriteDepth
        this.cameraColorMatrix = this.cameras.main.postFX!.addColorMatrix()

        this.startNextLevel()
    }

    /**
     * Start the next level if any are left
     */
    startNextLevel(): void {
        this.currentLevelIndex++;

        if (this.currentLevelIndex >= LEVEL_LAYOUTS.length) {
            return this.winGame()
        }

        let fruitsInLevel = LEVEL_LAYOUTS[this.currentLevelIndex]
        // Store level-specific tweens
        let tweens: Phaser.Tweens.Tween[] = []
        let fruitObjects: MinigameSprites.Fruits.Fruit[] = []

        // How far each fruit should be spaced apart on the Y-axis
        let yIncrement = (this.markers.MaxY.y - this.markers.MinY.y) / (fruitsInLevel.length + 1)
        // General information about the fruit
        const fruitInfo = {
            spriteDepth: this.playerSpriteDepth + 1,
            endX: this.markers.EndX.x,
            lifetime: MINIGAME_TOTAL_DURATION
        }

        /**
         * Utility function to handle functionality once a fruit has been finished
         * @param fruitIndex The index of the fruit in the level layout
         */
        const progressFruits = (fruitIndex: number) => {
            if (fruitIndex + 1 < fruitObjects.length) {
                // If there's a fruit after this one, switch to it
                fruitObjects[fruitIndex + 1].enable()
            } else {
                // If it's the last fruit, finish the game
                this.gameEvents.emit(ElfMinigameEvents.DONE)
            }
        }

        /* Iterate through every fruit in the layout, creating
            the Fruit object and handling their event emitters */
        for (let i = 0; i < fruitsInLevel.length; i++) {
            let y = this.markers.MinY.y + yIncrement * (i + 1)
            let fruit = this.getFruitObject(fruitsInLevel[i], y, fruitInfo)

            fruit.fruitEvents.once(MinigameSprites.Fruits.FruitEvent.SUCCESS, () => {
                progressFruits(i)
            })
            fruit.fruitEvents.once(MinigameSprites.Fruits.FruitEvent.FAIL, () => {
                // Prevent double game endeds
                if (!this.gameEnded) {
                    if (this.currentLevelIndex >= MINIMUM_LEVEL_PASSED - 1) {
                        this.winGame()
                    } else {
                        this.loseGame()
                    }
                }
            })

            tweens.push(...fruit.tweens)
            fruitObjects.push(fruit)
        }

        /**
         * Functionality to run after the torch animations have finished
         */
        const runAfterTorchAnimations = () => {
            // Prepare each fruit with a delay between them
            let delayBetweenFruits = MINIGAME_DISPLAY_FRUITS_TIME / fruitObjects.length
            for (let i = 0; i < fruitObjects.length; i++) {
                this.time.delayedCall(delayBetweenFruits * i, () => {
                    fruitObjects[i].initialize()
                })
            }

            // Delay the time transition appropriately and start the first fruit after
            // the transition is done
            this.time.delayedCall(MINIGAME_START_TIME - MINIGAME_FADE_DURATION, () => {
                this.focusTransition(true, tweens, () => {
                    fruitObjects[0].enable()
                })
            })

            // Once the game is done, transition again and start the next level
            this.gameEvents.once(ElfMinigameEvents.DONE, () => {
                this.focusTransition(false, [], () => {
                    this.time.delayedCall(MINIGAME_LEVEL_COOLDOWN, () => {
                        this.startNextLevel()
                    })
                })
            })
        }

        // Get the current torch, play the lighting and idle animation, and start the 
        // post-torch functionality once the animation is done
        let torch = this.torches[this.currentLevelIndex]
        torch.play(`-torch${this.currentLevelIndex + 1}-light`).chain(`-torch${this.currentLevelIndex + 1}-idle`)
        torch.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.time.delayedCall(MINIGAME_TORCH_DELAY, () => {
                runAfterTorchAnimations()
            })
        })
    }

    /**
     * Create the Fruit object from the corresponding enum
     * @param fruit The enum for the Fruit
     * @param y The y position of the fruit
     * @param info The fruit info
     * @returns The fruit object
     */
    getFruitObject(fruit: MinigameSprites.Fruits.FruitType, y: number, info: MinigameSprites.Fruits.FruitInfo): MinigameSprites.Fruits.Apple | MinigameSprites.Fruits.Pumpkin {
        switch (fruit) {
            case MinigameSprites.Fruits.FruitType.APPLE:
                return new MinigameSprites.Fruits.Apple(this, this.markers.StartX.x, y, info)
            case MinigameSprites.Fruits.FruitType.PUMPKIN:
                return new MinigameSprites.Fruits.Pumpkin(this, this.markers.StartX.x, y, info)
        }
    }

    /**
     * Handles the slowdown and grayscale transition for the game
     * @param fadeIn Whether to fade in or out the transition
     * @param tweens All the tweens to be affected by the transition
     * @param colorMatrices All the color matrices to be affected by the transition
     * @param callback What to run once the transition has finished
     */
    focusTransition(fadeIn: boolean, tweens: Phaser.Tweens.Tween[], callback?: () => void): void {
        const timeScaleTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: tweens,
            timeScale: fadeIn ? MINIGAME_TIME_SCALE : 1,
            duration: MINIGAME_FADE_DURATION,
            onComplete: callback
        }
        const grayscaleTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: fadeIn ? 0 : MINIGAME_GRAYSCALE_SCALE },
            value: fadeIn ? MINIGAME_GRAYSCALE_SCALE : 0,
            duration: MINIGAME_FADE_DURATION,
            onUpdate: (tween) => {
                this.cameraColorMatrix.grayscale(tween.getValue())
            }
        }
        this.tweens.addMultiple([timeScaleTween, grayscaleTween])
    }

    /**
     * Lose the game
     */
    loseGame(): void {
        this.gameEnded = true
        SceneUtil.fadeOut(this, () => {
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.Lose.Dialogue, dialogueEventEmitter, this.data, () => {
                SceneUtil.getGameRegistry(this).elfMinigameLost = true
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.ElfHub)
            })
        })
    }

    /**
     * Win the game
     */
    winGame(): void {
        this.gameEnded = true
        // Fade in, run dialogue, switch scenes
        SceneUtil.fadeOut(this, () => {
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.Win.Dialogue, dialogueEventEmitter, this.data, () => {
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.ElfPostMinigame)
            })
        })
    }
}