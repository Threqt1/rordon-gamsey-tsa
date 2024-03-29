import { SceneEnums } from "../../shared/repository";
import { DialogueSystem, InputSystem } from "../../shared/systems";
import { KeyboardTexture } from "../../shared/textures";
import { SceneUtil, SpriteUtil } from "../../shared/util";
import { RectangleObject } from "../../shared/util/sceneUtil";
import { MinigameDialogue } from "../dialogue";
import { MinigameSprites } from "../sprites";

const SELECTION_GRAPHICS_DEPTH = 999
const NUMBER_OF_COLUMNS = 4
const NUMBER_OF_ROWS = 2
const DIALOGUE_TIME = 3 * 1000

enum Stage {
    OPEN_SHOP,
    RUSH_HOUR
}

type StageInformation = {
    timeUntilCooked: number
    itemsPerAddition: number
    additionTimeRange: [number, number]
    dialogue: DialogueSystem.Dialogue
    duration: number
    nextStage?: Stage
}

const STAGE_INFORMATION: { [key: number]: StageInformation } = {
    [Stage.OPEN_SHOP]: {
        timeUntilCooked: 2.5 * 1000,
        itemsPerAddition: 1,
        additionTimeRange: [1 * 1000, 3 * 1000],
        dialogue: MinigameDialogue.OpenShop.Dialogue,
        duration: 10 * 1000,
        nextStage: Stage.RUSH_HOUR,
    },
    [Stage.RUSH_HOUR]: {
        timeUntilCooked: 2 * 1000,
        additionTimeRange: [0.5 * 1000, 2.5 * 1000],
        itemsPerAddition: 2,
        dialogue: MinigameDialogue.RushHour.Dialogue,
        duration: 20 * 1000
    }
}

type Markers = {
    grid_1: RectangleObject
    grid_2: RectangleObject
    grid_3: RectangleObject
    grid_4: RectangleObject
    grid_5: RectangleObject
    grid_6: RectangleObject
    grid_7: RectangleObject
    grid_8: RectangleObject
}

enum MinigameInteractions {
    INTERACT = 4
}

const INTERACTION_KEYBINDS: InputSystem.Keybinds = {
    [SpriteUtil.Direction.UP]: "W",
    [SpriteUtil.Direction.DOWN]: "S",
    [SpriteUtil.Direction.LEFT]: "A",
    [SpriteUtil.Direction.RIGHT]: "D",
    [MinigameInteractions.INTERACT]: "E"
}

const ITEMS = [MinigameSprites.GrillItem.Item.BURGER]

export class OrcMinigameScene extends Phaser.Scene {
    selectionGraphics!: Phaser.GameObjects.Graphics
    grillSpots!: MinigameSprites.GrillSpot[]
    currentLocation!: [number, number] // [row, column]
    baseInput!: InputSystem.System
    currentStageInformation!: StageInformation
    currentAdditionTime!: number
    interactionPrompt!: Phaser.GameObjects.Sprite
    totalDeltaTimeSum!: number
    currentDeltaTimeSum!: number
    controllable!: boolean

    constructor() {
        super(SceneEnums.Name.OrcMinigame)
    }

    create() {
        SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.Instructions.Dialogue, new Phaser.Events.EventEmitter(), this.data, () => {
            SceneUtil.fadeOut(this, () => {
                this.initGame()
                SceneUtil.fadeIn(this)
            })
        })
    }

    initGame() {
        /* MAP INITIALIZATION */
        let { map, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.OrcMinigame)
        let markers = objects as Markers

        this.sprites.initialize(map)

        let music = this.sound.add(SceneEnums.Music.OrcMinigame)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play("", {
            loop: true
        })

        this.baseInput = new InputSystem.System(this, INTERACTION_KEYBINDS)

        /* GAME OBJECT CONFIGURATION */
        this.selectionGraphics = this.add.graphics()
            .setDepth(SELECTION_GRAPHICS_DEPTH)

        let spot1 = new MinigameSprites.GrillSpot(this, markers.grid_1)
        let spot2 = new MinigameSprites.GrillSpot(this, markers.grid_2)
        let spot3 = new MinigameSprites.GrillSpot(this, markers.grid_3)
        let spot4 = new MinigameSprites.GrillSpot(this, markers.grid_4)
        let spot5 = new MinigameSprites.GrillSpot(this, markers.grid_5)
        let spot6 = new MinigameSprites.GrillSpot(this, markers.grid_6)
        let spot7 = new MinigameSprites.GrillSpot(this, markers.grid_7)
        let spot8 = new MinigameSprites.GrillSpot(this, markers.grid_8)

        this.interactionPrompt = this.add.sprite(0, 0, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["E"])
            .setDepth(SELECTION_GRAPHICS_DEPTH)
            .setVisible(false)

        this.grillSpots = [
            spot1, spot2, spot3, spot4,
            spot5, spot6, spot7, spot8
        ]

        this.currentLocation = [0, 0]
        this.getSpotAtIndex(0, 0).select()

        this.currentStageInformation = STAGE_INFORMATION[Stage.OPEN_SHOP]
        this.currentAdditionTime = Phaser.Math.Between(this.currentStageInformation.additionTimeRange[0], this.currentStageInformation.additionTimeRange[1])
        this.totalDeltaTimeSum = 0
        //So food spawns in instantly
        this.currentDeltaTimeSum = this.currentAdditionTime

        this.controllable = true

        /* CAMERA CONFIGURATION */
        SceneUtil.scaleAndConfigureCamera(this, map)

        this.transitionStages(Stage.OPEN_SHOP)
    }

    getSpotAtIndex(x: number, y: number): MinigameSprites.GrillSpot {
        return this.grillSpots[x * NUMBER_OF_COLUMNS + y]
    }

    moveGrillSpotLocation(direction: SpriteUtil.Direction): void {
        switch (direction) {
            case SpriteUtil.Direction.UP:
                if (this.currentLocation[0] > 0) this.selectNewGrillSpotLocation(this.currentLocation[0] - 1, this.currentLocation[1])
                break;
            case SpriteUtil.Direction.DOWN:
                if (this.currentLocation[0] < NUMBER_OF_ROWS - 1) this.selectNewGrillSpotLocation(this.currentLocation[0] + 1, this.currentLocation[1])
                break;
            case SpriteUtil.Direction.LEFT:
                if (this.currentLocation[1] > 0) this.selectNewGrillSpotLocation(this.currentLocation[0], this.currentLocation[1] - 1)
                break;
            case SpriteUtil.Direction.RIGHT:
                if (this.currentLocation[1] < NUMBER_OF_COLUMNS - 1) this.selectNewGrillSpotLocation(this.currentLocation[0], this.currentLocation[1] + 1)
                break;
        }
    }

    selectNewGrillSpotLocation(x: number, y: number): void {
        this.getSpotAtIndex(this.currentLocation[0], this.currentLocation[1]).unselect()
        this.currentLocation = [x, y]
        this.getSpotAtIndex(x, y).select()
    }

    interactWithSpot() {
        this.getSpotAtIndex(this.currentLocation[0], this.currentLocation[1]).interact()
    }

    addNewItems() {
        let avaliableSpots = this.grillSpots.filter(r => r.item === undefined)
        let chosenSpots = []
        for (let i = 0; i < this.currentStageInformation.itemsPerAddition; i++) {
            if (avaliableSpots.length === 0) continue
            let spot = avaliableSpots[Phaser.Math.Between(0, avaliableSpots.length - 1)]
            chosenSpots.push(spot)
            avaliableSpots = avaliableSpots.filter(r => r != spot)
        }
        for (let spot of chosenSpots) {
            let item = ITEMS[Phaser.Math.Between(0, ITEMS.length - 1)]
            spot.addItem(item)
        }
    }

    transitionStages(stage: Stage) {
        this.currentStageInformation = STAGE_INFORMATION[stage]
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        SceneUtil.getGUIScene(this).dialogue.start(this, this.currentStageInformation.dialogue, dialogueEventEmitter, this.data, undefined, DIALOGUE_TIME)
    }

    update(_: number, delta: number): void {
        if (!this.controllable) return

        if (this.baseInput.checkIfKeyDown(SpriteUtil.Direction.UP)) {
            this.baseInput.input.resetKeys()
            this.moveGrillSpotLocation(SpriteUtil.Direction.UP)
        } else if (this.baseInput.checkIfKeyDown(SpriteUtil.Direction.LEFT)) {
            this.baseInput.input.resetKeys()
            this.moveGrillSpotLocation(SpriteUtil.Direction.LEFT)
        } else if (this.baseInput.checkIfKeyDown(SpriteUtil.Direction.RIGHT)) {
            this.baseInput.input.resetKeys()
            this.moveGrillSpotLocation(SpriteUtil.Direction.RIGHT)
        } else if (this.baseInput.checkIfKeyDown(SpriteUtil.Direction.DOWN)) {
            this.baseInput.input.resetKeys()
            this.moveGrillSpotLocation(SpriteUtil.Direction.DOWN)
        } else if (this.baseInput.checkIfKeyDown(MinigameInteractions.INTERACT)) {
            this.baseInput.input.resetKeys()
            this.interactWithSpot()
        }

        this.totalDeltaTimeSum += delta
        this.currentDeltaTimeSum += delta
        if (this.currentDeltaTimeSum >= this.currentAdditionTime) {
            this.currentDeltaTimeSum -= this.currentAdditionTime
            this.addNewItems()
            this.currentAdditionTime = Phaser.Math.Between(this.currentStageInformation.additionTimeRange[0], this.currentStageInformation.additionTimeRange[1])
        }
        if (this.totalDeltaTimeSum >= this.currentStageInformation.duration) {
            this.totalDeltaTimeSum = 0
            if (this.currentStageInformation.nextStage) {
                this.transitionStages(this.currentStageInformation.nextStage)
            } else {
                this.endGame()
            }
        }
    }

    endGame() {
        this.controllable = false
        SceneUtil.fadeOut(this, () => {
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.Win.Dialogue, dialogueEventEmitter, this.data, () => {
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.Final)
            })
        })
    }
}