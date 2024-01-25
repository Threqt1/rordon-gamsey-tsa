import { getGUIScene } from "../../../scenes";
import { BaseNPC } from "../..";
import { ElfTexture } from "../../../textures/elf";
import { ElfHubEstelInitialDialogue, ElfHubEstelNormalDialogue } from "../../../dialogue/elf";

export class ElfHubEstel extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50);
        this.sprite = scene.physics.add.sprite(x, y, ElfTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(ElfTexture.Animations.IdleFront)
        this.updatePromptPosition(this.sprite)

        //set interactable to false initially, only starting initial dialogue enables rest
        this.interactable = false
    }

    startInitialDialogue() {
        this.interactable = false
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubEstelInitialDialogue.Dialogue, this.emitter, this.scene.data, () => {
            this.startCooldown()
        })
    }

    onInteract(): void {
        this.interactable = false
        getGUIScene(this.scene).dialogue.start(this.scene, ElfHubEstelNormalDialogue.Dialogue, this.emitter, this.scene.data, () => {
            this.startCooldown()
        })
    }
}