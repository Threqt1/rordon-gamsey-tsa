import { SceneEnums } from "../../shared/repository";
import { InputSystem } from "../../shared/systems";
import { SceneUtil, SpriteUtil } from "../../shared/util";
import { RectangleObject } from "../../shared/util/sceneUtil";
import { MinigameSprites } from "../sprites";
import { GrillSpot } from "../sprites/minigame";

const SELECTION_GRAPHICS_DEPTH = 999
const FOOD_DEPTH = 1

const NUMBER_OF_COLUMNS = 4
const NUMBER_OF_ROWS = 2

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

const InteractionKeybinds: InputSystem.Keybinds = {
    [SpriteUtil.Direction.UP]: "W",
    [SpriteUtil.Direction.DOWN]: "S",
    [SpriteUtil.Direction.LEFT]: "A",
    [SpriteUtil.Direction.RIGHT]: "D"
}

export class OrcMinigameScene extends Phaser.Scene {
    selectionGraphics!: Phaser.GameObjects.Graphics
    grillSpots!: MinigameSprites.GrillSpot[]
    currentLocation!: [number, number] // [row, column]
    baseInput!: InputSystem.System

    constructor() {
        super(SceneEnums.Name.OrcMinigame)
    }

    create() {
        /* MAP INITIALIZATION */
        let { map, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.OrcMinigame)
        let markers = objects as Markers

        this.sprites.initialize(map)
        this.baseInput = new InputSystem.System(this, InteractionKeybinds)

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

        this.grillSpots = [
            spot1, spot2, spot3, spot4,
            spot5, spot6, spot7, spot8
        ]

        this.currentLocation = [0, 0]
        this.getSpotAtIndex(0, 0).drawSelectionRectangle()

        /* CAMERA CONFIGURATION */
        SceneUtil.scaleAndConfigureCamera(this, map)
    }

    getSpotAtIndex(x: number, y: number): GrillSpot {
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
        this.selectionGraphics.clear()
        this.currentLocation = [x, y]
        this.getSpotAtIndex(x, y).drawSelectionRectangle()
    }

    update(): void {
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
        }
    }
}