import { CollisionCategory } from "../../enums/collisionCategories";
import { Interactable } from "../../plugins/sprites";
import { PlayerTexture } from "../../textures/player";
import { BaseSpriteWithInput, Keybinds } from "../base";

enum Interaction {
    INTERACT
}

export default class GameNPC extends BaseSpriteWithInput implements Interactable {
    private static _keybinds: Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }

    protected getKeybinds(): Keybinds {
        return GameNPC._keybinds
    }
    private _interactable: boolean
    private _interactionPrompt: Phaser.GameObjects.Sprite
    private _zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, PlayerTexture.TextureKey)

        this.scene.sprites.makeCollisionsFor(CollisionCategory.INTERACTABLE, this.body as Phaser.Physics.Arcade.Body)
        this.setPushable(false)

        this._interactable = true
        this._interactionPrompt = this.scene.add.sprite(this.x, this.y + this.displayOriginY, "wkey").setDepth(100).setVisible(false).setScale(0.3)
        this._interactionPrompt.setY(this._interactionPrompt.y + this._interactionPrompt.displayHeight / 2)

        this._zone = this.scene.add.zone(this.x, this.y, 50, 50)
        this.scene.physics.world.enable(this._zone, Phaser.Physics.Arcade.DYNAMIC_BODY);

        let body: Phaser.Physics.Arcade.Body = this._zone.body as Phaser.Physics.Arcade.Body
        this.scene.sprites.makeCollisionsFor(CollisionCategory.INTERACTION_ZONE, body)
        body.moves = false

        this.anims.play(PlayerTexture.Animations.IdleFront)
    }

    public getInteractableZone(): Phaser.GameObjects.Zone {
        return this._zone;
    }

    public setInteractionPrompt(show: boolean): void {
        this._interactionPrompt.setVisible(show);
    }

    public isInteractable(): boolean {
        return this._interactable ? this._interactionPrompt.visible : this._interactable
    }

    public setInteractable(interactable: boolean): void {
        if (!interactable) {
            this._interactionPrompt.setVisible(false)
        }
        this._interactable = interactable
    }

    public pollZoned() {
        let touching = (this._zone.body as Phaser.Physics.Arcade.Body).touching.none
        let wasTouching = (this._zone.body as Phaser.Physics.Arcade.Body).wasTouching.none
        let embedded = (this._zone.body as Phaser.Physics.Arcade.Body).embedded

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

    public interact(input: Phaser.Input.InputPlugin): void {
        if (!this._interactable) return
        this.pollZoned()
        if (this.isInteractable() && this.checkDown(input.keyboard!, Interaction.INTERACT)) {
            this.setInteractable(false)
            console.log("Hi")
        }
    }
}