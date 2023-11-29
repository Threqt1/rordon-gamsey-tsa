import { SceneEnum } from "../scenes"
import { PluginName } from "./pluginsUtilities"

export interface Controllable {
    control(input: Phaser.Input.InputPlugin): void
}

export interface Interactable {
    getInteractableZone(): Phaser.GameObjects.Zone
    interact(input: Phaser.Input.InputPlugin): void
}

export default class SpritesPlugin extends Phaser.Plugins.ScenePlugin {
    controllables!: Controllable[]
    interactables!: Interactable[]
    physicsBodies!: Phaser.Physics.Arcade.Group
    interactableZones!: Phaser.Physics.Arcade.Group

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginName.SpritePlugin);
    }

    initialize() {
        var eventEmitter = this.systems!.events
        eventEmitter.on("update", () => { this.update() })
        eventEmitter.once("destroy", () => { eventEmitter.off("update", this.update) })
        eventEmitter.on("shutdown", () => { this.cleanup() })

        this.interactables = []
        this.controllables = []
        this.physicsBodies = this.scene!.physics.add.group()
        this.interactableZones = this.scene!.physics.add.group()
    }

    addInteractables(...interactables: Interactable[]) {
        this.interactables.push(...interactables)
        this.interactableZones.addMultiple(interactables.map(r => r.getInteractableZone()))
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
        this.physicsBodies.addMultiple(statics)
    }

    removeSprites(...sprites: Phaser.Physics.Arcade.Sprite[]) {
        for (let sprite of sprites) {
            this.physicsBodies.remove(sprite)
        }
    }

    makeCOllisionsForBody(category: SceneEnum.CollisionCategory, body: Phaser.Physics.Arcade.Body) {
        body.setCollisionCategory(category)
        switch (category) {
            case SceneEnum.CollisionCategory.CONTROLLABLE:
                body.setCollidesWith([SceneEnum.CollisionCategory.CONTROLLABLE, SceneEnum.CollisionCategory.INTERACTABLE, SceneEnum.CollisionCategory.INTERACTION_ZONE, SceneEnum.CollisionCategory.MAP])
                break;
        }
    }

    makeCollisionsWithLayer(layer: Phaser.Tilemaps.TilemapLayer) {
        this.scene!.physics.add.collider(this.physicsBodies, this.physicsBodies);
        this.scene!.physics.add.collider(this.physicsBodies, layer);
        this.scene!.physics.add.overlap(this.physicsBodies, this.interactableZones);
    }

    cleanup() {
        this.controllables = []
        this.interactables = []
        this.physicsBodies.destroy(true, true)
    }

    getPhysicsSprites(): Phaser.Physics.Arcade.Sprite[] {
        return this.physicsBodies.getChildren() as Phaser.Physics.Arcade.Sprite[]
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