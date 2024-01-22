import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera } from ".."
import { ElfMinigameTeleporterNPC } from "../../sprites/elf"
import { GoblinMinigameTeleporterNPC } from "../../sprites/goblin"

export class GameScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.SceneNames.Game)
    }

    create() {
        /* MAP INITIALIZATION */
        let { collisionsLayer, map, playerSpriteDepth } = loadTilemap(this, SceneEnums.TilemapNames.Game)

        this.sprites.initialize(map)

        /* SPRITE INITIALIZATION */
        let player = new Player(this, 30, 130)
        let npc1 = new ElfMinigameTeleporterNPC(this, 80, 100)
        let npc2 = new GoblinMinigameTeleporterNPC(this, 190, 150)

        this.sprites.controllables.push(player)
        this.sprites.addInteractables(npc1, npc2)
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