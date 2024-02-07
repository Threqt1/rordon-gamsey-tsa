import { HubSprites } from "../sprites"
import { SceneUtil, SpriteUtil } from "../../shared/util"
import { SceneEnums } from "../../shared/repository"
import { Player } from "../../shared/sprites/player"

type Markers = {
    EstelNPCLocation: SceneUtil.PointObject
    PochiNPCLocation: SceneUtil.PointObject
    OverseerNPCLocation: SceneUtil.PointObject
    TeleporterNPCLocation: SceneUtil.PointObject
}

export type SceneData = {
    talkedToPochi: boolean
}

const DEFAULT_DATA: SceneData = {
    talkedToPochi: false
}

const ESTEL_INITIAL_TALK_DELAY = 500
const PLAYER_OFFSET = 25;

export class ElfHubScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.Name.ElfHub)
    }

    create() {
        let { collisionsLayer, map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.ElfHub)
        let markers = objects as Markers

        this.sprites.initialize(map)

        // Initialize the music
        let music = this.sound.add(SceneEnums.Music.ElfNeutral)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play("", {
            loop: true,
        })

        // initialize registry
        this.data.set(DEFAULT_DATA)

        //position player in front of estel
        let estel = new HubSprites.Estel(this, markers.EstelNPCLocation.x, markers.EstelNPCLocation.y)

        let teleporter = new HubSprites.MinigameTeleporter(this, markers.TeleporterNPCLocation.x, markers.TeleporterNPCLocation.y)
        let overseer = new HubSprites.Overseer(this, markers.OverseerNPCLocation.x, markers.OverseerNPCLocation.y)
        let pochi = new HubSprites.Pochi(this, markers.PochiNPCLocation.x, markers.PochiNPCLocation.y)

        let player = new Player(this, 0, 0)

        this.sprites.controllables.push(player)
        this.sprites.addInteractables(estel, overseer, pochi, teleporter)
        this.sprites.physicsBodies.addMultiple([player.sprite, estel.sprite, overseer.sprite, pochi.sprite, teleporter.sprite])
        this.sprites.interactingBodies.add(player.sprite)
        this.sprites.physicsBodies.setDepth(playerSpriteDepth)

        SceneUtil.scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        //play correct player animation
        player.direction = SpriteUtil.Direction.UP
        player.playDirectionAnimation(0, 0)

        //delay and play the initial estel dialogue if first time
        if (!SceneUtil.getGameRegistry(this).elfMinigameLost) {
            // disable control initially
            this.sprites.setControllable(false)
            player.sprite.setPosition(markers.EstelNPCLocation.x, markers.EstelNPCLocation.y + PLAYER_OFFSET)
            // play dialogue after fade in
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
                this.time.delayedCall(ESTEL_INITIAL_TALK_DELAY, () => {
                    estel.startInitialDialogue()
                })
            })
        } else {
            // otherwise put them in front of elf tp person
            player.sprite.setPosition(markers.TeleporterNPCLocation.x - PLAYER_OFFSET, markers.TeleporterNPCLocation.y)
        }
    }

    update() {
    }
}