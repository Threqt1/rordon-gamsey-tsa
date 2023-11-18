import { PluginNames } from "../enums/pluginNames";
import { Controllable, Interactable } from "../extensions";

export default class InteractionScenePlugin extends Phaser.Plugins.ScenePlugin {
    private controllables!: Controllable[]
    private interactables!: Interactable[]
    private controllableSprites!: Phaser.Physics.Arcade.Group
    private sprites!: Phaser.Physics.Arcade.Group
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
        this.controllables = []
        this.controllableSprites = this.scene!.physics.add.group()
        this.sprites = this.scene!.physics.add.group()
        this.interactionZones = this.scene!.physics.add.group()
    }

    addInteractables(...interactables: (Phaser.Physics.Arcade.Sprite & Interactable)[]) {
        this.interactables.push(...interactables)
        this.sprites.addMultiple(interactables)
        this.interactionZones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    addControllables(...controllables: (Phaser.Physics.Arcade.Sprite & Controllable)[]) {
        this.controllables.push(...controllables)
        this.controllableSprites.addMultiple(controllables)
        this.sprites.addMultiple(controllables)
    }

    makeCollisions(layer: Phaser.Tilemaps.TilemapLayer) {
        this.scene!.physics.add.collider(this.sprites, this.sprites);
        this.scene!.physics.add.collider(this.sprites, layer);
        this.scene!.physics.add.overlap(this.controllableSprites, this.interactionZones)
    }

    getSprites() {
        return this.sprites
    }

    getZones() {
        return this.interactionZones
    }

    update() {
        for (let interactable of this.interactables) {
            interactable.interact(this.scene!.input)
        }
        for (let controllable of this.controllables) {
            controllable.control(this.scene!.input);
        }
    }
}