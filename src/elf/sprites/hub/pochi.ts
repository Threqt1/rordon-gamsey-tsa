import { getGUIScene } from "../../../scenes";
import { BaseNPC } from "../..";
import { ElfTexture } from "../../../textures/elf";
import { ElfHubPochiDialogue } from "../../../dialogue/elf";
import { ElfHubData } from "../../../scenes/elf";

/**
 * Pochi is a lore NPc in the elf hub
 */
export class Pochi extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50);
        this.sprite = scene.physics.add.sprite(x, y, ElfTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(ElfTexture.Animations.IdleFront)
        this.updatePromptPosition(this.sprite)
    }

    onInteract(): void {
        this.interactable = false
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubPochiDialogue.Dialogue, this.emitter, this.scene.data, () => {
            (this.scene.data.values as ElfHubData).talkedToPochi = true
            this.startCooldown()
        })
    }
}