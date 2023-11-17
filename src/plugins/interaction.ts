import { PluginNames } from "../enums/pluginNames";
import { Interactable } from "../extensions";

export default class InteractionScenePlugin extends Phaser.Plugins.ScenePlugin {
    private interactables!: Interactable[]
    private interactableSprites!: Phaser.Physics.Arcade.Group
    private interactionZones!: Phaser.Physics.Arcade.Group

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginNames.InteractionPlugin);
    }

    boot() {

    }

    use() {
        var eventEmitter = this.systems!.events

        eventEmitter.on("update", () => this.update())

        eventEmitter.once("destroy", () => eventEmitter.off("update", this.update))

        this.interactables = []
        this.interactableSprites = this.scene!.physics.add.group()
        this.interactionZones = this.scene!.physics.add.group()
    }

    add(...interactables: (Phaser.Physics.Arcade.Sprite & Interactable)[]) {
        this.interactables.push(...interactables)
        this.interactableSprites.addMultiple(interactables)
        this.interactionZones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    getSprites() {
        return this.interactableSprites
    }

    getZones() {
        return this.interactionZones
    }

    update() {
        for (let interactable of this.interactables) {
            interactable.interact(this.scene!.input)
        }
    }
}