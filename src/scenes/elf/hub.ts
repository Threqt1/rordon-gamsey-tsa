import { Scene } from "phaser"
import { Player, NPC } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera } from "../"

export class ElfHubScene extends Scene {
    constructor() {
        super(SceneEnums.SceneNames.ElfHub)
    }

    create() {
        let { collisionsLayer: collisions, map, playerDepth } = loadTilemap(this, SceneEnums.TilemapNames.ElfHub)

        this.sprites.initialize(map)

        let player = new Player(this, 30, 130)
        let npc1 = new NPC(this, 100, 150)

        this.sprites.addGameControllables(player)
        this.sprites.addInteractables(npc1)
        this.sprites.addPhysicsBodies(player.sprite, npc1.sprite)
        this.sprites.addInteractingBodies(player.sprite)
        this.sprites.physicsBodies.setDepth(playerDepth)

        scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)
    }

    update() {
    }
}