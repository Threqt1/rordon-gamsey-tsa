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

    addInteractables(...interactables: Interactable[]) {
        this.interactables.push(...interactables)
        this.zones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    removeInteractables(...interactables: Interactable[]) {
        this.interactables = this.interactables.filter(r => interactables.indexOf(r) === -1);
    }

    addControllables(...controllables: Controllable[]) {
        this.controllables.push(...controllables)
    }

    removeControllables(...controllables: Controllable[]) {
        this.controllables = this.controllables.filter(r => controllables.indexOf(r) === -1);
    }

    addSprites(...statics: Phaser.Physics.Arcade.Sprite[]) {
        this.bodies.addMultiple(statics)
    }

    removeSprites(...sprites: Phaser.Physics.Arcade.Sprite[]) {
        for (let sprite of sprites) {
            this.bodies.remove(sprite)
        }
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

    getBodyGroup() {
        return this.bodies
    }

    getBodies(): Phaser.Physics.Arcade.Sprite[] {
        return this.bodies.getChildren() as Phaser.Physics.Arcade.Sprite[]
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