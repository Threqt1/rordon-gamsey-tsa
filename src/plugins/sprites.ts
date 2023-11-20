import { CollisionCategory } from "../enums/collisionCategories";
import { PluginName } from "../enums/pluginNames";
import { Controllable, Interactable } from "../extensions";

export default class SpritesScenePlugin extends Phaser.Plugins.ScenePlugin {
    private controllables!: Controllable[]
    private interactables!: Interactable[]
    private bodies!: Phaser.Physics.Arcade.Group
    private zones!: Phaser.Physics.Arcade.Group

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginName.SpritePlugin);
    }

    use() {
        var eventEmitter = this.systems!.events

        eventEmitter.on("update", () => this.update())

        eventEmitter.once("destroy", () => eventEmitter.off("update", this.update))

        this.interactables = []
        this.controllables = []
        this.bodies = this.scene!.physics.add.group()
        this.zones = this.scene!.physics.add.group()
    }

    addInteractables(...interactables: (Phaser.Physics.Arcade.Sprite & Interactable)[]) {
        this.interactables.push(...interactables)
        this.bodies.addMultiple(interactables)
        this.zones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    addControllables(...controllables: (Phaser.Physics.Arcade.Sprite & Controllable)[]) {
        this.controllables.push(...controllables)
        this.bodies.addMultiple(controllables)
    }

    addStatics(...statics: Phaser.Physics.Arcade.Sprite[]) {
        this.bodies.addMultiple(statics)
    }

    makeCollisionsFor(category: CollisionCategory, body: Phaser.Physics.Arcade.Body) {
        body.setCollisionCategory(category)
        switch (category) {
            case CollisionCategory.CONTROLLABLE:
                body.setCollidesWith([CollisionCategory.CONTROLLABLE, CollisionCategory.INTERACTABLE, CollisionCategory.INTERACTION_ZONE, CollisionCategory.MAP])
                break;
        }
    }

    makeCollisions(layer: Phaser.Tilemaps.TilemapLayer) {
        this.scene!.physics.add.collider(this.bodies, this.bodies);
        this.scene!.physics.add.collider(this.bodies, layer);
        this.scene!.physics.add.overlap(this.bodies, this.zones);
    }

    getBodies() {
        return this.bodies
    }

    getZones() {
        return this.zones
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