import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera, PointObject } from "../"
import { ElfHubEstel, ElfHubOverseer, ElfHubPochi, ElfMinigameTeleporterNPC } from "../../sprites/elf"
import { Direction } from "../../sprites"
import { Cameras } from "phaser"

type ElfHubMarkers = {
    EstelNPCLocation: PointObject
    PochiNPCLocation: PointObject
    OverseerNPCLocation: PointObject
    TeleporterNPCLocation: PointObject
}

export type ElfHubData = {
    talkedToPochi: boolean
}

const DEFAULT_DATA: ElfHubData = {
    talkedToPochi: false
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

        // initialize registry
        this.data.set(DEFAULT_DATA)

        //position player in front of estel
        let estel = new ElfHubEstel(this, markers.EstelNPCLocation.x, markers.EstelNPCLocation.y)
        let player = new Player(this, markers.EstelNPCLocation.x, markers.EstelNPCLocation.y + PLAYER_ESTEL_Y_OFFSET)

        let teleporter = new ElfMinigameTeleporterNPC(this, markers.TeleporterNPCLocation.x, markers.TeleporterNPCLocation.y)
        let overseer = new ElfHubOverseer(this, markers.OverseerNPCLocation.x, markers.OverseerNPCLocation.y)
        let pochi = new ElfHubPochi(this, markers.PochiNPCLocation.x, markers.PochiNPCLocation.y)

        this.sprites.controllables.push(player)
        this.sprites.addInteractables(estel, overseer, pochi, teleporter)
        this.sprites.physicsBodies.addMultiple([player.sprite, estel.sprite, overseer.sprite, pochi.sprite, teleporter.sprite])
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