import { RectangleObject } from "../../../shared/util/sceneUtil";
import { OrcMinigameScene } from "../../scenes";

const SELECTION_BOX_WIDTH = 2
const SELECTION_BOX_COLOR = 0xFFFFFF

export class GrillSpot {
    scene: OrcMinigameScene
    sizeInfo: RectangleObject

    constructor(scene: OrcMinigameScene, sizeInfo: RectangleObject) {
        this.scene = scene
        this.sizeInfo = sizeInfo
    }

    drawSelectionRectangle() {
        this.scene.selectionGraphics.lineStyle(SELECTION_BOX_WIDTH, SELECTION_BOX_COLOR, 1)
        this.scene.selectionGraphics.strokeRect(this.sizeInfo.x, this.sizeInfo.y, this.sizeInfo.width, this.sizeInfo.height)
    }
}