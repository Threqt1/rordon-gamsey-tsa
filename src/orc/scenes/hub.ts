import { CutsceneTexture } from "../../goblin/textures"
import { SceneEnums } from "../../shared/repository"
import { Player } from "../../shared/sprites/player"
import { SceneUtil } from "../../shared/util"
import { PointObject, RectangleObject } from "../../shared/util/sceneUtil"
import { HubSprites } from "../sprites"

type OrcHubMarkers = {
    OrcEntrance: RectangleObject
    MinecartStartPosition: PointObject
    MinecartEndPosition: PointObject,
    OrcSpawn: PointObject
}

const PLAYER_MINECART_OFFSET = 10

const MINECART_SPEED = 100

export class OrcHubScene extends Phaser.Scene {
    markers!: OrcHubMarkers
    player!: Player
    minecart!: Phaser.GameObjects.Sprite

    constructor() {
        super(SceneEnums.Name.OrcHub)
    }

    create() {
        let { map, objects, playerSpriteDepth, collisionsLayer } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.OrcHub)
        this.markers = objects as OrcHubMarkers
        this.animatedTiles.setRate(0.65)

        this.sprites.initialize(map)

        this.minecart = this.add.sprite(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y, CutsceneTexture.TextureKey, CutsceneTexture.Frames.Minecart)
            .setDepth(playerSpriteDepth)

        const chef = new HubSprites.Chef(this, this.markers.OrcSpawn.x, this.markers.OrcSpawn.y)

        this.player = new Player(this, this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y - PLAYER_MINECART_OFFSET)

        const teleporterZone = new HubSprites.TeleporterZone(this, this.markers.OrcEntrance)

        this.sprites.controllables.push(this.player)
        this.sprites.physicsBodies.addMultiple([this.player.sprite, chef.sprite])
        this.sprites.interactingBodies.add(this.player.sprite)
        this.sprites.addInteractables(teleporterZone, chef)
        this.sprites.physicsBodies.setDepth(playerSpriteDepth)

        this.sprites.setControllable(false)

        SceneUtil.scaleAndConfigureCamera(this, map, this.player.sprite)
        this.sprites.makeCollisionsWithLayer(collisionsLayer!)

        let path = new Phaser.Curves.Path(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y).lineTo(this.markers.MinecartEndPosition.x, this.markers.MinecartEndPosition.y)
        this.tweens.addMultiple([
            {
                targets: [this.player.sprite],
                y: this.markers.MinecartEndPosition.y - PLAYER_MINECART_OFFSET,
                duration: path.getLength() / MINECART_SPEED * 1000,
                onComplete: () => {
                    this.sprites.setControllable(true)
                }
            },
            {
                targets: [this.minecart],
                y: this.markers.MinecartEndPosition.y,
                duration: path.getLength() / MINECART_SPEED * 1000
            }
        ])

    }
}