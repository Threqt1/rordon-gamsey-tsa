import { BaseNPC } from "../../../game/sprites"
import { SceneUtil } from "../../../game/util"
import { GoblinLevelScene, GoblinMinigame } from "../../scenes"


/**
 * Represents an entrance/exit zone in the Goblin Minigame
 */
export class TeleporterZone extends BaseNPC {
    scene: GoblinLevelScene
    nextLevelIndex: number

    constructor(scene: GoblinLevelScene, data: SceneUtil.RectangleObject, nextLevelIndex: number) {
        super(scene, data.x, data.y, data.width, data.height)
        this.scene = scene
        this.nextLevelIndex = nextLevelIndex
        this.zone.setOrigin(0, 0)
        this.interactionPrompt.setX(data.x + data.width / 2)
    }

    onInteract(): void {
        this.scene.parentScene.gameEvents.emit(GoblinMinigame.Events.SWITCH_LEVELS, this.nextLevelIndex)
    }
}