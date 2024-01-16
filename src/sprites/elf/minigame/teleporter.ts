import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { PlayerTexture } from "../../../textures";
import { ElfHubTeleporterDialogue } from "../../../dialogue/elf";

/**
 * The NPC that teleports you to the Elf Minigame
 */
export class ElfMinigameTeleporterNPC extends BaseNPC {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTexture.TextureKey, 50, undefined, PlayerTexture.Animations.IdleFront)
    }

    onInteract(): void {
        this.interactable = false
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.ElfMinigame)
        })
    }
}