import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera, PointObject } from "../"
import { ElfHubEstel } from "../../sprites/elf"
import { Direction } from "../../sprites"
import { Cameras } from "phaser"

type ElfHubMarkers = {
    EstelLocation: PointObject
    NPC1Location: PointObject
    OverseerLocation: PointObject
}

const ESTEL_INITIAL_TALK_DELAY = 500
const PLAYER_ESTEL_Y_OFFSET = 25;

export class ElfHubScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.SceneNames.ElfHub)
    }

    create() {
        let { collisionsLayer, map, playerSpriteDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.ElfHub)
        let markers = objects as ElfHubMarkers

        this.sprites.initialize(map)

        //position player in front of estel
        let estel = new ElfHubEstel(this, markers.EstelLocation.x, markers.EstelLocation.y)
        let player = new Player(this, markers.EstelLocation.x, markers.EstelLocation.y + PLAYER_ESTEL_Y_OFFSET)

        this.sprites.controllables.push(player)
        this.sprites.addInteractables(estel)
        this.sprites.physicsBodies.addMultiple([player.sprite, estel.sprite])
        this.sprites.interactingBodies.add(player.sprite)
        this.sprites.physicsBodies.setDepth(playerSpriteDepth)

        // disable control initially
        this.sprites.setControllable(false)

        scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        //play correct player animation
        player.direction = Direction.UP
        player.playDirectionAnimation(0, 0)

        //delay and play the initial estel dialogue
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.time.delayedCall(ESTEL_INITIAL_TALK_DELAY, () => {
                estel.startInitialDialogue()
            })
        })
    }

    update() {
    }
}