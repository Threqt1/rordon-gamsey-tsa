import { SceneEnums } from "../../shared/repository"
import { SceneUtil } from "../../shared/util"
import { InitialDialogue } from "../dialogue"

export class InitialScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.Name.Initial)
    }

    create() {
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            SceneUtil.getGUIScene(this).dialogue.start(this, InitialDialogue.Dialogue, new Phaser.Events.EventEmitter(), this.data, () => {
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.ElfHub)
            })
        })
    }

    update() {
    }
}