import { SceneEnums, fadeSceneTransition, getGUIScene } from "../../../scenes";
import { GoblinHubTeleporterDialogue } from "../../../dialogue/goblin";
import { BaseNPC } from "../..";
import { GoblinTexture } from "../../../textures/goblin";

export class GoblinMinigameTeleporterNPC extends BaseNPC {
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 50, 50);
        this.sprite = scene.physics.add.sprite(x, y, GoblinTexture.TextureKey)
        this.sprite.setPushable(false)
        this.sprite.play(GoblinTexture.Animations.IdleFront)
        this.updatePromptPosition(this.sprite)

        GoblinTexture.configureGoblinPhysicsBody(this.sprite.body as Phaser.Physics.Arcade.Body)
    }

    onInteract(): void {
        this.interactable = false
        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        getGUIScene(this.scene).dialogue.start(this.scene, GoblinHubTeleporterDialogue.Dialogue, dialogueEventEmitter, () => {
            fadeSceneTransition(this.scene, SceneEnums.SceneNames.GoblinMinigame)
        })
    }
}