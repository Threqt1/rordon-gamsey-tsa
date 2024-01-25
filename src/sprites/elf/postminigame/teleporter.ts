import { BaseNPC } from "../..";
import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { ElfTexture } from "../../../textures/elf";
import { GoblinMinigameTeleporterDialogue } from "../../../dialogue/elf/postminigame/goblinTeleporter";

export class GoblinMinigameTeleporterNPC extends BaseNPC {
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
        getGUIScene(this.scene).dialogue.start(this.scene, GoblinMinigameTeleporterDialogue.Dialogue, this.emitter, this.scene.data, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.GoblinMinigame)
        })
    }
}