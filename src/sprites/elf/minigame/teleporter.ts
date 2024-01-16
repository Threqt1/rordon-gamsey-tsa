import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { ElfHubTeleporterDialogue } from "../../../dialogue/elf";
import { ElfTexture } from "../../../textures/elf";

export class ElfMinigameTeleporterNPC extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50)
        this.sprite = scene.physics.add.sprite(x, y, ElfTexture.TextureKey, ElfTexture.Animations.IdleFront)
        this.sprite.setPushable(false)
        this.updatePromptPosition(this.sprite)
    }

    onInteract(): void {
        this.interactable = false
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.ElfMinigame)
        })
    }
}