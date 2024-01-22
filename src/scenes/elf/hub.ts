import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera } from "../"

export class ElfHubScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.SceneNames.ElfHub)
    }

    create() {
        let { collisionsLayer: collisions, map, playerSpriteDepth: playerDepth } = loadTilemap(this, SceneEnums.TilemapNames.ElfHub)

        this.sprites.initialize(map)

        let player = new Player(this, 30, 130)

        this.sprites.controllables.push(player)
        this.sprites.physicsBodies.addMultiple([player.sprite])
        this.sprites.interactingBodies.add(player.sprite)
        this.sprites.physicsBodies.setDepth(playerDepth)

        scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)
    }

    update() {
    }
}