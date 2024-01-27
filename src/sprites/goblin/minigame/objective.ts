import { BaseNPC } from "../.."
import { GoblinMinigameEvents, GoblinMinigameLevelScene } from "../../../scenes/goblin"
import { FoodTexture } from "../../../textures"

export class GoblinMinigameObjective extends BaseNPC {
    scene: GoblinMinigameLevelScene
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: GoblinMinigameLevelScene, x: number, y: number) {
        super(scene, x, y, 50, 50)
        this.sprite = scene.physics.add.sprite(x, y, FoodTexture.TextureKey, FoodTexture.Frames.GoblinMinigame)
        this.sprite.setPushable(false)
        this.updatePromptPosition(this.sprite)

        this.scene = scene
    }

    onInteract(): void {
        this.interactable = false
        this.sprite.setVisible(false)
        this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.ALERT)
    }
}