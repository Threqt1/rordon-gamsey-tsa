import { Interactable } from "../../../extensions"
import { createMainCharacterAnimations } from "./anims"
import { MainCharacterTextures } from "./textures"

export default class MainCharacter extends Phaser.Physics.Arcade.Sprite implements Interactable {
    interacted: boolean = false
    interactPrompt: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, MainCharacterTextures.Key)

        this.anims.play(MainCharacterTextures.IdleFront)

        this.interactPrompt = this.scene.add.sprite(this.x + this.displayOriginX, this.y + this.displayOriginY, "button", "credits_0.png").setDepth(100).setVisible(false)

    }

    static loadAnimations = (anims: Phaser.Animations.AnimationManager) => createMainCharacterAnimations(anims)

    isInteractable(): boolean {
        return this.interacted
    }

    setInteractableButton(visible: boolean): void {
        this.interactPrompt.setVisible(visible)
    }

    interact(): void {
        console.log("WORKED")
    }
}

Phaser.GameObjects.GameObjectFactory.register(MainCharacterTextures.Key, function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    const sprite = new MainCharacter(this.scene, x, y);

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enable(sprite, Phaser.Physics.Arcade.STATIC_BODY)

    return sprite as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
})
