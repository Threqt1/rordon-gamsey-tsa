import { GameObjects } from "phaser";
import { Zone, checkIfInZone } from "..";
import { Interactable } from "../../plugins/sprites";
import { SceneEnums, switchScenesFadeOut } from "../../scenes";
import { KeyboardTexture } from "../../textures/keyboard";
import { PlayerTexture } from "../../textures/player";
import { BaseDialogue, BaseInput, BaseSprite, Keybinds } from "../base";
import { TeleportDialogue, TeleporterDialogueEmitter, TeleporterDialogueEventNames } from "../../dialogue/elf/hub";

enum Interaction {
    INTERACT
}

export class NPC implements Interactable {
    static keybinds: Keybinds = {
        [Interaction.INTERACT]:
            "E",
    }
    sprite: BaseSprite
    scene: Phaser.Scene
    input: BaseInput
    dialogue: BaseDialogue<TeleporterDialogueEmitter>
    interactable: boolean
    interactionPrompt: Phaser.GameObjects.Sprite
    zone: Phaser.GameObjects.Zone

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = new BaseSprite(scene, x, y, PlayerTexture.TextureKey)
        this.scene = scene
        this.input = new BaseInput(scene, NPC.keybinds)
        this.dialogue = new BaseDialogue<TeleporterDialogueEmitter>(this.scene, TeleportDialogue, TeleporterDialogueEmitter)
        this.dialogue.emitter.on(TeleporterDialogueEventNames.TELEPORT, () => {
            switchScenesFadeOut(scene, SceneEnums.SceneNames.ElfMinigame)
        })

        this.scene.sprites.makeCollisionsForBody(SceneEnums.CollisionCategories.INTERACTABLE, this.sprite.body as Phaser.Physics.Arcade.Body)
        this.sprite.setPushable(false)

        this.interactable = true
        this.interactionPrompt = this.scene.add.sprite(this.sprite.x, this.sprite.y + this.sprite.displayOriginY, KeyboardTexture.TextureKey, KeyboardTexture.KeyPictures["W"]).setDepth(100).setVisible(false).setScale(0.3)
        this.interactionPrompt.setY(this.interactionPrompt.y + this.interactionPrompt.displayHeight / 2)

        this.zone = this.scene.add.zone(this.sprite.x, this.sprite.y, 50, 50)
        this.scene.physics.world.enable(this.zone, Phaser.Physics.Arcade.DYNAMIC_BODY);

        let body = this.zone.body as Phaser.Physics.Arcade.Body
        this.scene.sprites.makeCollisionsForBody(SceneEnums.CollisionCategories.INTERACTION_ZONE, body)

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
            case Zone.ENTERED:
                this.interactionPrompt.setVisible(true)
                break;
            case Zone.LEFT:
                this.interactionPrompt.setVisible(false)
                break;
        }
        if (this.interactable && this.input.checkIfKeyDown(Interaction.INTERACT) && this.interactionPrompt.visible) {
            this.input.input.resetKeys()
            this.dialogue.start()
            this.interactionPrompt.setVisible(false)
        }
    }
}