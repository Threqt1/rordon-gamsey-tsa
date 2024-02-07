import { SceneUtil } from "../../../game/util";
import { BaseNPC } from "../../../game/sprites";
import { ElfTexture } from "../../textures/elf";
import { HubDialogue } from "../../dialogue/"
/**
 * Estel is the main NPC in the Elf Hub, has starting dialogue
 */
export class Estel extends BaseNPC {
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
        SceneUtil.getGUIScene(this.scene).dialogue.start(this.scene, HubDialogue.EstelInitial.Dialogue, this.emitter, this.scene.data, () => {
            this.startCooldown()
        })
    }

    onInteract(): void {
        this.interactable = false
        getGUIScene(this.scene).dialogue.start(this.scene, HubDialogue.EstelNormal.Dialogue, this.emitter, this.scene.data, () => {
            this.startCooldown()
        })
    }
}