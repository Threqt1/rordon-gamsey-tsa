import { SpriteUtil } from "../util";
import { InputSystem, SpritesPlugin } from "../systems";
import { KeyboardTexture } from "../textures";

const INTERACTION_PROMPT_DEPTH = 100
const INTERACTION_COOLDOWN = 1500

/**
 * Base interactions
 */
enum Interaction {
    INTERACT
}

/**
 * The base NPC class which has basic zone functionality
 */
export abstract class BaseNPC implements SpritesPlugin.Interactable {
    /**
     * Map interactions
     */
    static keybinds: InputSystem.Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }
    scene: Phaser.Scene
    input: InputSystem.System
    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    emitter: Phaser.Events.EventEmitter
    zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number, zoneSizeX = 50, zoneSizeY = 50) {
        this.scene = scene
        this.input = new InputSystem.System(scene, BaseNPC.keybinds)
        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(x, y + zoneSizeY / 2, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["E"])
            .setDepth(INTERACTION_PROMPT_DEPTH)
            .setVisible(false)
        this.emitter = new Phaser.Events.EventEmitter()
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
        this.interactionPrompt.setVisible(SpriteUtil.isInsideZone(this.zone))
        if (this.interactable && this.input.checkIfKeyDown(Interaction.INTERACT) && this.interactionPrompt.visible) {
            this.input.input.resetKeys()
            this.interactionPrompt.setVisible(false)
            this.onInteract()
        }
    }

    /**
     * Handle re-enabling interactable, but just after a cooldown
     */
    startCooldown() {
        this.scene.time.delayedCall(INTERACTION_COOLDOWN, () => {
            this.interactable = true
        })
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