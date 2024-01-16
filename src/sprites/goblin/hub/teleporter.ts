import { Zone, checkIfInZone, BaseInput, Keybinds } from "../../";
import { Interactable } from "../../../plugins";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { KeyboardTexture, PlayerTexture } from "../../../textures";
import { GoblinHubTeleporterDialogue } from "../../../dialogue/goblin";

/**
 * Represents all possible interactions with the NPC
 */
enum Interaction {
    INTERACT
}

/**
 * The NPC that teleports you to the Goblin Minigame
 */
export class GoblinHubTeleporterNPC implements Interactable {
    /**
     * Bind Interactions to keys
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

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.physics.add.sprite(x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, GoblinHubTeleporterNPC.keybinds)
        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"]).setDepth(100).setVisible(false).setScale(0.3)
        this.zone = this.scene.add.zone(this.sprite.x, this.sprite.y, 50, 50)

        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.sprite.setPushable(false)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)
        this.sprite.anims.play(PlayerTexture.Animations.IdleFront)
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
            this.interactable = false
            this.input.input.resetKeys()
            this.interactionPrompt.setVisible(false)

            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            getGUIScene(this.scene).dialogue.start(this.scene, GoblinHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
                fadeSceneTransition(this.scene, SceneEnums.SceneNames.GoblinMinigame)
            })
        }
    }

    getInteractableZone(): Phaser.GameObjects.Zone {
        return this.zone
    }

    setInteractable(interactable: boolean): void {
        this.interactable = interactable
    }

}