import { GameObjects } from "phaser";
import { Zone, checkIfInZone, BaseInput, Keybinds } from ".";
import { Interactable } from "../plugins/sprites";
import { KeyboardTexture } from "../textures/keyboard";

const INTERACTION_PROMPT_DEPTH = 100
const INTERACTION_PROMPT_SCALE = 0.3

/**
 * Base interactions
 */
enum Interaction {
    INTERACT
}

/**
 * The base NPC class which has basic zone functionality
 */
export abstract class BaseNPC implements Interactable {
    /**
     * Map interactions
     */
    static keybinds: Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }
    sprite: Phaser.Physics.Arcade.Sprite
    scene: Phaser.Scene
    input: BaseInput
    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, zoneSize = 50, frame?: string, animation?: string) {
        this.sprite = scene.physics.add.sprite(x, y, texture, frame)
        this.scene = scene
        this.input = new BaseInput(scene, BaseNPC.keybinds)
        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"])
            .setDepth(INTERACTION_PROMPT_DEPTH)
            .setVisible(false)
            .setScale(INTERACTION_PROMPT_SCALE)
        this.zone = this.scene.add.zone(this.sprite.x, this.sprite.y, zoneSize, zoneSize)

        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.sprite.setPushable(false)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)
        if (animation) this.sprite.anims.play(animation)
    }

    abstract onInteract(): void

    getInteractableZone(): GameObjects.Zone {
        return this.zone
    }

    setInteractable(interactable: boolean): void {
        this.interactable = interactable
    }

    interact() {
        if (!this.interactable) return
        let inZone = checkIfInZone(this.zone)
        switch (inZone) {
            case Zone.IN:
                this.interactionPrompt.setVisible(true)
                break;
            case Zone.OUT:
                this.interactionPrompt.setVisible(false)
                break;
        }
        if (this.interactable && this.input.checkIfKeyDown(Interaction.INTERACT) && this.interactionPrompt.visible) {
            this.input.input.resetKeys()
            this.interactionPrompt.setVisible(false)
            this.onInteract()
        }
    }
}