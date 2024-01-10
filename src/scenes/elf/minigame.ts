/**
add gameobjects on tiled to specify where fruits spawn/end/chara positions
 */

import { Fruit, Apple, Pumpkin, Fruits, FruitEventName, FruitInformation } from "../../sprites/elf/minigame/fruits";
import { NPC, Player } from "../../sprites/elf/minigame"
import { loadTilemap, PointObject, scaleAndConfigureCamera, SceneEnums, switchScenesFadeOut, sceneFadeDialogueSwitch } from "..";
import { SlashesTexture, ElvesTexture, FruitsTexture, TorchesTexture } from "../../textures/elf/minigame";
import { EndDialogue } from "../../dialogue/elf/minigame";

const LEVEL_SCHEMATICS: Fruits[][] = [
    [Fruits.APPLE],
    [Fruits.PUMPKIN, Fruits.APPLE],
    [Fruits.APPLE, Fruits.PUMPKIN, Fruits.APPLE],
    [Fruits.PUMPKIN, Fruits.APPLE, Fruits.PUMPKIN],
    [Fruits.PUMPKIN, Fruits.PUMPKIN, Fruits.APPLE, Fruits.PUMPKIN, Fruits.PUMPKIN]
]

const MINIGAME_FADE_DURATION = 500
const MINIGAME_TOTAL_DURATION = 5000
const MINIGAME_START_TIME = MINIGAME_TOTAL_DURATION / 2.5
const MINIGAME_DISPLAY_FRUITS_TIME = MINIGAME_START_TIME - 30
const MINIGAME_LEVEL_COOLDOWN = 1300
const MINIGAME_TORCH_DELAY = 500
const MINIGAME_TIME_DELAY = 0.8
const MINIGAME_GRAYSCALE_FACTOR = 0.6

enum MinigameEventNames {
    DONE = "done"
}

type ElfMinigameMarkers = {
    Torch1: PointObject
    Torch2: PointObject
    Torch3: PointObject
    Torch4: PointObject
    Torch5: PointObject
    Elf: PointObject
    Player: PointObject
    MinY: PointObject
    MaxY: PointObject
    StartX: PointObject
    EndX: PointObject
}

export class ElfMinigameScene extends Phaser.Scene {
    currentLevelIndex!: number
    colorMatrices!: Phaser.FX.ColorMatrix[]
    playerSpriteDepth!: number
    gameEnded: boolean = false
    eventEmitter!: Phaser.Events.EventEmitter
    torches!: Phaser.GameObjects.Sprite[]
    markers!: ElfMinigameMarkers

    constructor() {
        super(SceneEnums.SceneNames.ElfMinigame)
    }

    preload() {
        SlashesTexture.preload(this)
        ElvesTexture.preload(this)
        FruitsTexture.preload(this)
    }

    create() {
        SlashesTexture.load(this)
        ElvesTexture.load(this)
        FruitsTexture.load(this)

        let { map, playerDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.ElfMinigame)
        this.markers = objects as ElfMinigameMarkers

        this.sprites.initialize(map);
        this.currentLevelIndex = -1
        this.gameEnded = false
        this.eventEmitter = new Phaser.Events.EventEmitter()
        this.playerSpriteDepth = playerDepth
        this.colorMatrices = []

        scaleAndConfigureCamera(this, map)

        let player = new Player(this, this.markers.Player.x, this.markers.Player.y)
        player.sprite.setDepth(playerDepth)
        let npc = new NPC(this, this.markers.Elf.x, this.markers.Elf.y)
        npc.sprite.setDepth(playerDepth)

        this.colorMatrices.push(player.sprite.postFX!.addColorMatrix())
        this.colorMatrices.push(npc.sprite.postFX!.addColorMatrix())

        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this.colorMatrices.push(layer.tilemapLayer.postFX!.addColorMatrix())
        }

        let torch1 = this.add.sprite(this.markers.Torch1.x, this.markers.Torch1.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch1).setDepth(playerDepth)
        let torch2 = this.add.sprite(this.markers.Torch2.x, this.markers.Torch2.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch2).setDepth(playerDepth)
        let torch3 = this.add.sprite(this.markers.Torch3.x, this.markers.Torch3.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch3).setDepth(playerDepth)
        let torch4 = this.add.sprite(this.markers.Torch4.x, this.markers.Torch4.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch4).setDepth(playerDepth)
        let torch5 = this.add.sprite(this.markers.Torch5.x, this.markers.Torch5.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch5).setDepth(playerDepth)

        this.torches = [torch1, torch2, torch3, torch4, torch5]

        for (let torch of this.torches) {
            this.colorMatrices.push(torch.postFX!.addColorMatrix())
        }

        this.startNextLevel()
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
                return new Apple(this, this.markers.StartX.x, y, info)
            case Fruits.PUMPKIN:
                return new Pumpkin(this, this.markers.StartX.x, y, info)
        }
    }

    startNextLevel() {
        this.currentLevelIndex++;

        if (this.currentLevelIndex >= LEVEL_SCHEMATICS.length) {
            return this.endGame()
        }

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

        let yIncrement = (this.markers.MaxY.y - this.markers.MinY.y) / (fruitsInLevelSchematic.length + 1)
        const fruitInfo = {
            spriteDepth: this.playerSpriteDepth + 1,
            endX: this.markers.EndX.x,
            lifetime: MINIGAME_TOTAL_DURATION
        }

        for (let i = 0; i < fruitsInLevelSchematic.length; i++) {
            let y = this.markers.MinY.y + yIncrement * (i + 1)
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

        const postTorchFunctionality = () => {
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
                        this.startNextLevel()
                    })
                })
            })
        }

        let torch = this.torches[this.currentLevelIndex]
        torch.play(`-torch${this.currentLevelIndex + 1}-light`).chain(`-torch${this.currentLevelIndex + 1}-idle`)
        torch.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.time.delayedCall(MINIGAME_TORCH_DELAY, () => {
                postTorchFunctionality()
            })
        })


    }

    endGame() {
        sceneFadeDialogueSwitch(this, SceneEnums.SceneNames.Menu, this.colorMatrices, EndDialogue, () => {
            this.gameEnded = true
        })
    }
}