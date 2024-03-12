import { SceneEnums } from "../../../shared/repository";
import { BaseNPC } from "../../../shared/sprites";
import { DialogueSystem } from "../../../shared/systems";
import { SceneUtil } from "../../../shared/util";
import { HubDialogue } from "../../dialogue";
import { ElfTexture } from "../../textures";

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
        let dialogue: DialogueSystem.Dialogue;
        // If the minigame has been lost already, display unique dialogue
        if (SceneUtil.getGameRegistry(this.scene).elfMinigameLost) {
            dialogue = HubDialogue.TeleporterRetry.Dialogue
        } else {
            dialogue = HubDialogue.Teleporter.Dialogue
        }
        SceneUtil.getGUIScene(this.scene).dialogue.start(this.scene, dialogue, this.emitter, this.scene.data, () => {
            SceneUtil.fadeSceneTransition(this.scene, SceneEnums.Name.ElfMinigame)
        })
    }
}