import { BaseNPC } from "../../../game/sprites";
import { ElfTexture } from "../../textures";
import { PostMinigameDialogue } from "../../dialogue"
import { SceneUtil } from "../../../game/util";
import { SceneEnums } from "../../../game/repository";

/**
 * The NPC that teleports the player to the goblin minigame
 */
export class GoblinTeleporter extends BaseNPC {
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
        SceneUtil.getGUIScene(this.scene).dialogue.start(this.scene, PostMinigameDialogue.Teleporter.Dialogue, this.emitter, this.scene.data, () => {
            SceneUtil.fadeSceneTransition(this.scene, SceneEnums.Name.GoblinMinigame)
        })
    }
}