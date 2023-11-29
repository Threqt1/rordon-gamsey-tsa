import { Interactable } from "../../plugins/sprites";
import { SceneEnum } from "../../scenes";
import { KeyboardTexture } from "../../textures/keyboard";
import { PlayerTexture } from "../../textures/player";
import { BaseInput, BaseSprite, Keybinds } from "../base";

enum Interaction {
    INTERACT
}

export default class NPC implements Interactable {
    static keybinds: Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }

    sprite: BaseSprite
    scene: Phaser.Scene
    input: BaseInput

    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, NPC.keybinds)

        this.scene.sprites.makeCOllisionsForBody(SceneEnum.CollisionCategory.INTERACTABLE, this.sprite.body as Phaser.Physics.Arcade.Body)
        this.sprite.setPushable(false)

        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"]).setDepth(100).setVisible(false).setScale(0.3)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)

        this.zone = this.scene.add.zone(this.sprite.x, this.sprite.y, 50, 50)
        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);

        let body: Phaser.Physics.Arcade.Body = this.zone.body as Phaser.Physics.Arcade.Body
        this.scene.sprites.makeCOllisionsForBody(SceneEnum.CollisionCategory.INTERACTION_ZONE, body)
        body.moves = false

        this.sprite.anims.play(PlayerTexture.Animations.IdleFront)
    }

    getInteractableZone(): Phaser.GameObjects.Zone {
        return this.zone;
    }

    setInteractionPrompt(show: boolean): void {
        this.interactionPrompt.setVisible(show);
    }

    isInteractable(): boolean {
        return this.interactable ? this.interactionPrompt.visible : this.interactable
    }

    setInteractable(interactable: boolean): void {
        if (!interactable) {
            this.interactionPrompt.setVisible(false)
        }
        this.interactable = interactable
    }

    pollZoned() {
        let touching = (this.zone.body as Phaser.Physics.Arcade.Body).touching.none
        let wasTouching = (this.zone.body as Phaser.Physics.Arcade.Body).wasTouching.none
        let embedded = (this.zone.body as Phaser.Physics.Arcade.Body).embedded

        if (touching && !wasTouching) {
            if (embedded) {
                this.setInteractionPrompt(true)
            } else {
                this.setInteractionPrompt(false)
            }
        }
        else if (!touching && wasTouching) {
            this.setInteractionPrompt(true)
        }
    }

    interact(input: Phaser.Input.InputPlugin) {
        if (!this.interactable) return
        this.pollZoned()
        if (this.isInteractable() && this.input.checkDown(input.keyboard!, Interaction.INTERACT)) {
            this.setInteractable(false)
            console.log("Hi")
        }
    }
}