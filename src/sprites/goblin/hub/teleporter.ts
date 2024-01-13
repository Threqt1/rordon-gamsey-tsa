import { GameObjects } from "phaser";
import { Zone, checkIfInZone } from "../../";
import { Interactable } from "../../../plugins/sprites";
import { GUIScene, SceneEnums, switchScenesFadeOut } from "../../../scenes";
import { KeyboardTexture } from "../../../textures/keyboard";
import { PlayerTexture } from "../../../textures/player";
import { BaseInput, Keybinds } from "../../base";
import { TeleportDialogue } from "../../../dialogue/goblin/hub";

enum Interaction {
    INTERACT
}

export class GoblinTeleporterNPC implements Interactable {
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
        this.input = new BaseInput(scene, GoblinTeleporterNPC.keybinds)

        this.sprite.setPushable(false)

        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"]).setDepth(100).setVisible(false).setScale(0.3)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)

        this.zone = this.scene.add.zone(this.sprite.x, this.sprite.y, 50, 50)
        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);

        this.sprite.anims.play(PlayerTexture.Animations.IdleFront)
    }

    getInteractableZone(): GameObjects.Zone {
        return this.zone
    }

    setInteractable(interactable: boolean): void {
        this.interactable = interactable
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
            this.input.input.resetKeys()
            this.interactionPrompt.setVisible(false)
            let dialogue = (this.scene.scene.get(SceneEnums.SceneNames.GUI) as GUIScene).dialogue
            dialogue.start(this.scene, TeleportDialogue, () => {
                this.interactable = false
                switchScenesFadeOut(this.scene, SceneEnums.SceneNames.GoblinMinigame)
            })
        }
    }
}