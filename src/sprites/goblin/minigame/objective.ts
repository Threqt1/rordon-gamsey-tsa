import { Interactable } from "../../../plugins"
import { FruitsTexture } from "../../../textures/elf"
import { KeyboardTexture } from "../../../textures"
import { BaseInput, Keybinds, Zone, checkIfInZone } from "../.."
import { GoblinMinigameScene } from "../../../scenes/goblin"

enum Interaction {
    INTERACT
}

/**
 * The objective for the goblin game
 */
export class GoblinMinigameObjective implements Interactable {
    static keybinds: Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }
    scene: GoblinMinigameScene
    sprite: Phaser.Physics.Arcade.Sprite
    input: BaseInput
    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    interactionZone: Phaser.GameObjects.Zone

    constructor(scene: GoblinMinigameScene, x: number, y: number) {
        this.scene = scene
        this.sprite = scene.physics.add.sprite(x, y, FruitsTexture.TextureKey, FruitsTexture.Frames.Apple.Base)
        this.sprite.setPushable(false)

        this.input = new BaseInput(scene, GoblinMinigameObjective.keybinds)

        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"]).setDepth(100).setVisible(false).setScale(0.3)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)

        this.interactionZone = this.scene.add.zone(this.sprite.x, this.sprite.y, 50, 50)
        this.scene.physics.world.enable(this.interactionZone, Phaser.Physics.Arcade.DYNAMIC_BODY);
    }
    getInteractableZone(): Phaser.GameObjects.Zone {
        return this.interactionZone
    }
    setInteractable(interactable: boolean): void {
        this.interactable = interactable
    }
    interact(): void {
        if (!this.interactable) return
        let inZone = checkIfInZone(this.interactionZone)
        switch (inZone) {
            case Zone.IN:
                this.interactionPrompt.setVisible(true)
                break;
            case Zone.OUT:
                this.interactionPrompt.setVisible(false)
                break;
        }
        if (this.interactable && this.input.checkIfKeyDown(Interaction.INTERACT) && this.interactionPrompt.visible) {
            this.interactable = false
            this.scene.gameEvents.emit("mode")
        }
    }
}