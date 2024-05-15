import { SceneEnums } from "../repository"
import { BaseDialogue } from "../sprites"

/**
 * Handles all GUI aspects on top of another scene
 */
export class GUIScene extends Phaser.Scene {
    dialogue!: BaseDialogue

    constructor() {
        super(SceneEnums.Name.GUI)
    }

    create() {
        this.sprites.initialize()
        this.dialogue = new BaseDialogue(this)
    }
}