import { BaseNPC } from "../../../game/sprites";
import { ElfTexture } from "../../textures";
import { HubDialogue } from "../../dialogue/";
import { SceneUtil } from "../../../game/util";

/**
 * The Overseer is a lore NPC in the elf hub
 */
export class Overseer extends BaseNPC {
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
        SceneUtil.getGUIScene(this.scene).dialogue.start(this.scene, HubDialogue.Overseer.Dialogue, this.emitter, this.scene.data, () => {
            this.startCooldown()
        })
    }
}