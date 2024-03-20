import { SceneEnums } from "../../../shared/repository"
import { BaseNPC } from "../../../shared/sprites"
import { SceneUtil } from "../../../shared/util"
import { OrcHubScene } from "../../scenes"

export class TeleporterZone extends BaseNPC {
    scene: OrcHubScene

    constructor(scene: OrcHubScene, data: SceneUtil.RectangleObject) {
        super(scene, data.x, data.y, data.width, data.height)
        this.scene = scene
        this.zone.setOrigin(0, 0)
        this.interactionPrompt.setX(data.x + data.width / 2)
    }

    onInteract(): void {
        SceneUtil.fadeSceneTransition(this.scene, SceneEnums.Name.OrcMinigame)
    }
}