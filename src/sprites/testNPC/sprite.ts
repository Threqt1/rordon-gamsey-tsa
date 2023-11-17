import { Interactable, Keybinds } from "../../extensions";
import BaseSprite from "../base";
import { TestNPCTextures } from "./textures";

enum Interaction {
    INTERACT
}

export default class TestNPC extends BaseSprite implements Interactable {
    protected getKeybinds(): Keybinds {
        return {
            [Interaction.INTERACT]:
                Phaser.Input.Keyboard.KeyCodes.E,
        }
    }
    private _interactable: boolean
    private _interactionPrompt: Phaser.GameObjects.Sprite
    private _zone: Phaser.GameObjects.Zone
    private static _animationsMade: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, TestNPCTextures.TextureKey)

        if (!TestNPC._animationsMade) {
            TestNPCTextures.makeAnimations(scene.anims)
            TestNPC._animationsMade = true
        }

        this.setPushable(false)

        this._interactable = true
        this._interactionPrompt = this.scene.add.sprite(this.x + this.displayOriginX, this.y + this.displayOriginY, "button", "credits_0.png").setDepth(100).setVisible(false)

        this._zone = this.scene.add.zone(this.x, this.y, 50, 50)
        this.scene.physics.world.enable(this._zone, Phaser.Physics.Arcade.DYNAMIC_BODY);

        (this._zone.body as Phaser.Physics.Arcade.Body).moves = false

        this.anims.play(TestNPCTextures.Animations.Idle)
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
        if (this.isInteractable() && this.checkDown(input.keyboard!, this.getKeybinds()[Interaction.INTERACT])) {
            this.setInteractable(false)
            console.log("Hi")
        }
    }
}