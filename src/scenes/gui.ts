import { Scene } from "phaser"
import { SceneEnums } from "."
import { BaseDialogue } from "../sprites"

/**
 * Handles all GUI aspects on top of another scene
 */
export class GUIScene extends Scene {
    dialogue!: BaseDialogue

    constructor() {
        super(SceneEnums.SceneNames.GUI)
    }

    create() {
        this.sprites.initialize()
        this.dialogue = new BaseDialogue(this, this.scale.width, this.scale.height)
    }
}