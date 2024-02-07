import { BaseNPC } from "../../../game/sprites"
import { FoodTexture } from "../../../game/textures"
import { GoblinLevelScene, GoblinMinigame } from "../../scenes"

export class Objective extends BaseNPC {
    scene: GoblinLevelScene
    sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: GoblinLevelScene, x: number, y: number) {
        super(scene, x, y, 50, 50)
        this.sprite = scene.physics.add.sprite(x, y, FoodTexture.TextureKey, FoodTexture.Frames.GoblinMinigame)
        this.sprite.setPushable(false)
        this.updatePromptPosition(this.sprite)

        this.scene = scene
    }

    onInteract(): void {
        this.interactable = false
        this.sprite.setVisible(false)
        this.scene.parentScene.gameEvents.emit(GoblinMinigame.Events.ALERT)
    }
}