import { Scene } from "phaser"
import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera } from ".."
import { ElfHubTeleporterNPC } from "../../sprites/elf"
import { GoblinHubTeleporterNPC } from "../../sprites/goblin"

export class GameScene extends Scene {
    constructor() {
        super(SceneEnums.SceneNames.Game)
    }

    create() {
        /* MAP INITIALIZATION */
        let { collisionsLayer, map, playerSpriteDepth } = loadTilemap(this, SceneEnums.TilemapNames.Game)

        this.sprites.initialize(map)

        /* SPRITE INITIALIZATION */
        let player = new Player(this, 30, 130)
        let npc1 = new ElfHubTeleporterNPC(this, 80, 100)
        let npc2 = new GoblinHubTeleporterNPC(this, 190, 150)

        this.sprites.controllables.push(player)
        this.sprites.interactables.push(npc1, npc2)
        this.sprites.physicsBodies.addMultiple([player.sprite, npc1.sprite, npc2.sprite])
        this.sprites.interactingBodies.add(player.sprite)

        this.sprites.physicsBodies.setDepth(playerSpriteDepth)

        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        /* CAMERA CONFIGURATION*/
        scaleAndConfigureCamera(this, map, player.sprite)

        /* VARIABLE INITIALIZATION */
    }

    update() {
    }
}