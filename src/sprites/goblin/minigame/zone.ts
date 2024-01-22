import { BaseNPC } from "../..";
import { RectangleObject } from "../../../scenes";
import { GoblinMinigameEvents } from "../../../scenes/goblin";
import { GoblinMinigameLevelScene } from "../../../scenes/goblin/level";

/**
 * Represents an entrance/exit zone in the Goblin Minigame
 */
export class GoblinMinigameTeleporterZone extends BaseNPC {
    scene: GoblinMinigameLevelScene
    nextLevelIndex: number

    constructor(scene: GoblinMinigameLevelScene, data: RectangleObject, nextLevelIndex: number) {
        super(scene, data.x, data.y, data.width, data.height)
        this.scene = scene
        this.nextLevelIndex = nextLevelIndex
        this.zone.setOrigin(0, 0)
        this.interactionPrompt.setX(data.x + data.width / 2)
    }

    onInteract(): void {
        this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.SWITCH_LEVELS, this.nextLevelIndex)
    }
}