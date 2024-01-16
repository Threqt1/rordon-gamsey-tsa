import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { ElfHubTeleporterDialogue } from "../../../dialogue/elf";
import { ElfTexture } from "../../../textures/elf";

export class ElfMinigameTeleporterNPC extends BaseNPC {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ElfTexture.TextureKey, 50, undefined, ElfTexture.Animations.IdleFront)
    }

    onInteract(): void {
        this.interactable = false
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.ElfMinigame)
        })
    }
}