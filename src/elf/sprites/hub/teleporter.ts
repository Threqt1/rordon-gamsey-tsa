import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene, getGameRegistry } from "../../../scenes";
import { ElfHubTeleporterAgainDialogue, ElfHubTeleporterDialogue } from "../../../dialogue/elf";
import { ElfTexture } from "../../../textures/elf";
import { Dialogue } from "../../../dialogue";

/**
 * The minigame teleporter teleports the player to the elf minigame
 */
export class MinigameTeleporter extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50)
        this.sprite = scene.physics.add.sprite(x, y, ElfTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(ElfTexture.Animations.IdleFront)
        this.updatePromptPosition(this.sprite)
    }

    onInteract(): void {
        this.interactable = false
        let dialogue: Dialogue.Dialogue;
        // If the minigame has been lost already, display unique dialogue
        if (getGameRegistry(this.scene).elfMinigameLost) {
            dialogue = ElfHubTeleporterAgainDialogue.Dialogue
        } else {
            dialogue = ElfHubTeleporterDialogue.Dialogue
        }
        getGUIScene(this.scene).dialogue.start(this.scene, dialogue, this.emitter, this.scene.data, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.ElfMinigame)
        })
    }
}