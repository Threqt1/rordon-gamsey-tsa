import { GrillItem } from ".";
import { RectangleObject } from "../../../shared/util/sceneUtil";
import { OrcMinigameScene } from "../../scenes";

const SELECTION_BOX_WIDTH = 2
const SELECTION_BOX_COLOR = 0xFFFFFF

export class GrillSpot {
    scene: OrcMinigameScene
    item: GrillItem.Sprite | undefined
    sizeInfo: RectangleObject

    constructor(scene: OrcMinigameScene, sizeInfo: RectangleObject) {
        this.scene = scene
        this.sizeInfo = sizeInfo
    }

    addItem(item: GrillItem.Item) {
        this.item = new GrillItem.Sprite(this.scene, this, item)
    }

    interact() {
        if (!this.item) return
        this.item.interact()
    }

    drawSelectionRectangle() {
        this.scene.selectionGraphics.lineStyle(SELECTION_BOX_WIDTH, SELECTION_BOX_COLOR, 1)
        this.scene.selectionGraphics.strokeRect(this.sizeInfo.x, this.sizeInfo.y, this.sizeInfo.width, this.sizeInfo.height)
    }
}