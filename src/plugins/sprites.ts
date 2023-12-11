import { PluginEnums } from "."
import { SceneEnums } from "../scenes"

export interface Controllable {
    setControllable(controllable: boolean): void
    control(): void
}

export interface Interactable {
    getInteractableZone(): Phaser.GameObjects.Zone
    setInteractable(interactable: boolean): void
    interact(): void
}

export class SpritesPlugin extends Phaser.Plugins.ScenePlugin {
    map!: Phaser.Tilemaps.Tilemap
    gameControllables!: Controllable[]
    interactables!: Interactable[]
    guiControllables!: Controllable[]
    physicsBodies!: Phaser.Physics.Arcade.Group
    interactableZones!: Phaser.Physics.Arcade.Group
    gameControllablesEnabled!: boolean
    guiControllablesEnabled!: boolean
    interactablesEnabled!: boolean

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginEnums.PluginNames.SpritePlugin);
    }

    initialize(map: Phaser.Tilemaps.Tilemap) {
        var eventEmitter = this.systems!.events
        eventEmitter.on("update", () => { this.update() })
        eventEmitter.once("destroy", () => { eventEmitter.off("update", this.update) })
        eventEmitter.on("shutdown", () => { this.cleanup() })

        this.map = map
        this.interactables = []
        this.gameControllables = []
        this.guiControllables = []
        this.physicsBodies = this.scene!.physics.add.group()
        this.interactableZones = this.scene!.physics.add.group()
        this.gameControllablesEnabled = true
        this.guiControllablesEnabled = true
        this.interactablesEnabled = true
    }

    addInteractables(...interactables: Interactable[]) {
        this.interactables.push(...interactables)
        this.interactableZones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    removeInteractables(...interactables: Interactable[]) {
        this.interactables = this.interactables.filter(r => interactables.indexOf(r) === -1);
    }

    addGameControllables(...controllables: Controllable[]) {
        this.gameControllables.push(...controllables)
    }

    removeGameControllables(...controllables: Controllable[]) {
        this.gameControllables = this.gameControllables.filter(r => controllables.indexOf(r) === -1);
    }

    addGUIControllables(...controllables: Controllable[]) {
        this.guiControllables.push(...controllables)
    }

    removeGUIControllables(...controllables: Controllable[]) {
        this.guiControllables = this.guiControllables.filter(r => controllables.indexOf(r) === -1);
    }

    addSprites(...statics: Phaser.Physics.Arcade.Sprite[]) {
        this.physicsBodies.addMultiple(statics)
    }

    removeSprites(...sprites: Phaser.Physics.Arcade.Sprite[]) {
        for (let sprite of sprites) {
            this.physicsBodies.remove(sprite)
        }
    }

    setGUIControllable(isControllable: boolean) {
        for (let guiControllable of this.guiControllables) {
            guiControllable.setControllable(isControllable)
        }
    }

    setGameControllable(isControllable: boolean) {
        for (let gameControllable of this.gameControllables) {
            gameControllable.setControllable(isControllable)
        }
    }

    setInteractable(isInteractable: boolean) {
        for (let interactable of this.interactables) {
            interactable.setInteractable(isInteractable)
        }
    }

    makeCollisionsForBody(category: SceneEnums.CollisionCategories, body: Phaser.Physics.Arcade.Body) {
        body.setCollisionCategory(category)
        switch (category) {
            case SceneEnums.CollisionCategories.CONTROLLABLE:
                body.setCollidesWith([SceneEnums.CollisionCategories.CONTROLLABLE, SceneEnums.CollisionCategories.INTERACTABLE, SceneEnums.CollisionCategories.INTERACTION_ZONE, SceneEnums.CollisionCategories.MAP])
                break;
        }
    }

    makeCollisionsWithLayer(layer: Phaser.Tilemaps.TilemapLayer) {
        this.scene!.physics.add.collider(this.physicsBodies, this.physicsBodies);
        this.scene!.physics.add.collider(this.physicsBodies, layer);
        this.scene!.physics.add.overlap(this.physicsBodies, this.interactableZones);
    }

    cleanup() {
        this.gameControllables = []
        this.interactables = []
        this.physicsBodies.destroy(true, true)
    }

    getPhysicsSprites(): Phaser.Physics.Arcade.Sprite[] {
        return this.physicsBodies.getChildren() as Phaser.Physics.Arcade.Sprite[]
    }

    update() {
        if (this.interactablesEnabled) {
            for (let interactable of this.interactables) {
                interactable.interact()
            }
        }
        if (this.gameControllablesEnabled) {
            for (let controllable of this.gameControllables) {
                controllable.control();
            }
        }
        if (this.guiControllablesEnabled) {
            for (let controllable of this.guiControllables) {
                controllable.control();
            }
        }
    }
}