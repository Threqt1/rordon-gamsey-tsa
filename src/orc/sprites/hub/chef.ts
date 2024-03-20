import { SceneUtil } from "../../../shared/util";
import { BaseNPC } from "../../../shared/sprites";
import { OrcTexture } from "../../textures/orc";
import { HubDialogue } from "../../dialogue";

export class Chef extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 80);
        this.sprite = scene.physics.add.sprite(x, y, OrcTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(OrcTexture.Animations.IdleFrontChef)
        this.updatePromptPosition(this.sprite)
    }

    onInteract(): void {
        this.interactable = false
        SceneUtil.getGUIScene(this.scene).dialogue.start(this.scene, HubDialogue.Chef.Dialogue, this.emitter, this.scene.data, () => {
            this.setInteractable(false)
        })
    }
}