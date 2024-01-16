import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { PlayerTexture } from "../../../textures";
import { GoblinHubTeleporterDialogue } from "../../../dialogue/goblin";
import { BaseNPC } from "../..";

/**
 * The NPC that teleports you to the Goblin Minigame
 */
export class GoblinMinigameTeleporterNPC extends BaseNPC {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTexture.TextureKey, 50, undefined, PlayerTexture.Animations.IdleFront)
    }

    onInteract(): void {
        this.interactable = false
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        getGUIScene(this.scene).dialogue.start(this.scene, GoblinHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.GoblinMinigame)
        })
    }
}