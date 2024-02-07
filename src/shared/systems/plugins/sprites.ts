import { PluginEnums } from "../../repository"

/**
 * Represents a class that is able to be controlled
 */
export interface Controllable {
    setControllable(controllable: boolean): void
    control(): void
}

/**
 * Represents a class that is able to be interacted with
 */
export interface Interactable {
    getInteractableZone(): Phaser.GameObjects.Zone
    setInteractable(interactable: boolean): void
    interact(): void
}

/**
 * Serves as a layer between the scene and the game to handle all scene-wide sprites
 */
export class Plugin extends Phaser.Plugins.ScenePlugin {
    map?: Phaser.Tilemaps.Tilemap
    controllables!: Controllable[]
    interactables!: Interactable[]
    physicsBodies!: Phaser.Physics.Arcade.Group
    /**
     * Physics bodies that are allowed to interact with the interactables
     */
    interactingBodies!: Phaser.Physics.Arcade.Group
    interactableZones!: Phaser.Physics.Arcade.Group
    controllablesEnabled!: boolean
    interactablesEnabled!: boolean
    initialized!: boolean

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginEnums.Name.SpritePlugin);
        this.initialized = false
    }

    initialize(map?: Phaser.Tilemaps.Tilemap): void {
        // Listen to scene-specific events for cleanup
        var eventEmitter = this.systems!.events
        eventEmitter.on("update", () => { this.update() })
        eventEmitter.once("destroy", () => { eventEmitter.off("update", this.update) })
        eventEmitter.on("shutdown", () => { this.cleanup() })
        this.initialized = true

        this.reset(map)
    }

    /**
     * Utility method to add interactables to the plugin
     */
    addInteractables(...interactables: Interactable[]): void {
        if (!this.initialized) return
        this.interactables.push(...interactables)
        this.interactableZones.addMultiple(interactables.map(r => r.getInteractableZone()))
    }

    setControllable(isControllable: boolean): void {
        if (!this.initialized) return
        this.controllablesEnabled = isControllable
        for (let controllable of this.controllables) {
            controllable.setControllable(isControllable)
        }
    }

    setInteractable(isInteractable: boolean): void {
        if (!this.initialized) return
        this.interactablesEnabled = isInteractable
        for (let interactable of this.interactables) {
            interactable.setInteractable(isInteractable)
        }
    }

    /**
     * Make collisions with all the registered sprites and a collision layer
     * @param layer 
     */
    makeCollisionsWithLayer(layer: Phaser.Tilemaps.TilemapLayer) {
        if (!this.initialized) return
        // Make all physics bodies collide with each other
        this.scene!.physics.add.collider(this.physicsBodies, this.physicsBodies);
        // Make all physics bodies collide with the collisions layer
        this.scene!.physics.add.collider(this.physicsBodies, layer);
        // Allow interacting bodie to overlap (not collide) with interactable zones
        this.scene!.physics.add.overlap(this.interactingBodies, this.interactableZones);
    }

    update() {
        if (this.interactablesEnabled) {
            for (let interactable of this.interactables) {
                interactable.interact()
            }
        }
        if (this.controllablesEnabled) {
            for (let controllable of this.controllables) {
                controllable.control();
            }
        }
    }

    /**
     * Reset the data to its initial state
     */
    reset(map?: Phaser.Tilemaps.Tilemap): void {
        if (!this.initialized) return
        // Store the map so sprites can reference it
        this.map = map
        this.interactables = []
        this.controllables = []
        this.physicsBodies = this.scene!.physics.add.group()
        this.interactingBodies = this.scene!.physics.add.group()
        this.interactableZones = this.scene!.physics.add.group()
        this.controllablesEnabled = true
        this.interactablesEnabled = true
    }

    /**
     * Clean up the plugin data
     */
    cleanup() {
        if (!this.initialized) return
        this.controllables = []
        this.interactables = []
        this.physicsBodies.destroy(true, true)
        this.interactingBodies.destroy(true, true)
        this.interactableZones.destroy(true, true)
    }
}