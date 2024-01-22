import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { ElfHubTeleporterDialogue } from "../../../dialogue/elf";
import { ElfTexture } from "../../../textures/elf";

export class ElfMinigameTeleporterNPC extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50)
        this.sprite = scene.physics.add.sprite(x, y, ElfTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(ElfTexture.Animations.IdleFront)
        this.updatePromptPosition(this.sprite)
    }

    onInteract(): void {
        this.interactable = false
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubTeleporterDialogue.Dialogue, this.emitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.ElfMinigame)
        })
    }
}