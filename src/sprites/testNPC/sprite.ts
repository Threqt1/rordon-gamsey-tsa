import { Interactable, Keybinds } from "../../extensions";
import { TestNPCTextures } from "./textures";

enum Interaction {
    INTERACT
}

export default class TestNPC extends Phaser.Physics.Arcade.Sprite implements Interactable {
    private _interactable: boolean
    private _interactionPrompt: Phaser.GameObjects.Sprite
    private _zone: Phaser.GameObjects.Zone
    private static _keyBinds: Keybinds = {
        [Interaction.INTERACT]: {
            keyCode: Phaser.Input.Keyboard.KeyCodes.E,
            repeat: false
        },
    }
    private _keyCodeKeyBindings: { [key: number]: Phaser.Input.Keyboard.Key } = {}

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, TestNPCTextures.TextureKey)

        TestNPCTextures.makeAnimations(scene.anims)

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY)

        for (let keyBind of Object.values(TestNPC._keyBinds)) {
            this._keyCodeKeyBindings[keyBind.keyCode] = scene.input.keyboard!.addKey(keyBind.keyCode, true, keyBind.repeat)
        }

        this._interactable = true
        this._interactionPrompt = this.scene.add.sprite(this.x + this.displayOriginX, this.y + this.displayOriginY, "button", "credits_0.png").setDepth(100).setVisible(false)

        this._zone = this.scene.add.zone(this.x, this.y, 70, 70)
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
        return this._interactable
    }

    public setInteractable(interactable: boolean): void {
        this._interactable = interactable
    }

    public interact(input: Phaser.Input.InputPlugin): void {
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
}