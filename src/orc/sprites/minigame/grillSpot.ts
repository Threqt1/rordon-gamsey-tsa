import { GrillItem } from ".";
import { RectangleObject } from "../../../shared/util/sceneUtil";
import { OrcMinigameScene } from "../../scenes";

const SELECTION_BOX_WIDTH = 2
const SELECTION_BOX_COLOR = 0xFFFFFF

export class GrillSpot {
    scene: OrcMinigameScene
    item: GrillItem.Sprite | undefined
    sizeInfo: RectangleObject
    selected: boolean

    constructor(scene: OrcMinigameScene, sizeInfo: RectangleObject) {
        this.scene = scene
        this.sizeInfo = sizeInfo
        this.selected = false
    }

    addItem(item: GrillItem.Item) {
        this.item = new GrillItem.Sprite(this.scene, this, item)
    }

    interact() {
        if (!this.item) return
        this.item.interact()
    }

    select() {
        this.selected = true
        this.scene.selectionGraphics.lineStyle(SELECTION_BOX_WIDTH, SELECTION_BOX_COLOR, 1)
        this.scene.selectionGraphics.strokeRect(this.sizeInfo.x, this.sizeInfo.y, this.sizeInfo.width, this.sizeInfo.height)
        if (this.item && this.item.canInteract) {
            this.moveSelectionPrompt()
        }
    }

    moveSelectionPrompt() {
        if (!this.selected) return
        this.scene.interactionPrompt.setPosition(this.sizeInfo.x + this.sizeInfo.width / 2, this.sizeInfo.y + this.sizeInfo.height / 2)
        this.scene.interactionPrompt.setVisible(true)
    }

    unmoveSelectionPrompt() {
        if (!this.selected) return
        this.scene.interactionPrompt.setVisible(false)
    }

    unselect() {
        this.selected = false
        this.scene.selectionGraphics.clear()
        this.scene.interactionPrompt.setVisible(false)
    }
}