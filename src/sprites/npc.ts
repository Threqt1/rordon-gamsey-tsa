import { isInsideZone, BaseInput, Keybinds } from ".";
import { Interactable } from "../plugins";
import { KeyboardTexture } from "../textures";

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
    scene: Phaser.Scene
    input: BaseInput
    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number, zoneSizeX = 50, zoneSizeY = 50) {
        this.scene = scene
        this.input = new BaseInput(scene, BaseNPC.keybinds)
        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(x, y + zoneSizeY / 2, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"])
            .setDepth(INTERACTION_PROMPT_DEPTH)
            .setVisible(false)
            .setScale(INTERACTION_PROMPT_SCALE)
        this.zone = this.scene.add.zone(x, y, zoneSizeX, zoneSizeY)

        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)
    }

    abstract onInteract(): void

    getInteractableZone(): Phaser.GameObjects.Zone {
        return this.zone
    }

    setInteractable(interactable: boolean): void {
        this.interactable = interactable
    }

    updatePromptPosition(sprite: Phaser.GameObjects.Sprite) {
        this.interactionPrompt.setPosition(sprite.getCenter().x, sprite.getCenter().y! + sprite.displayHeight / 2 + this.interactionPrompt.displayHeight / 2)
    }

    interact() {
        if (!this.interactable) return
        this.interactionPrompt.setVisible(isInsideZone(this.zone))
        if (this.interactable && this.input.checkIfKeyDown(Interaction.INTERACT) && this.interactionPrompt.visible) {
            this.input.input.resetKeys()
            this.interactionPrompt.setVisible(false)
            this.onInteract()
        }
    }

    /**
     * Destroy all NPC components
     */
    cleanup(): void {
        this.interactable = false
        this.interactionPrompt.destroy()
        this.zone.destroy()
    }
}