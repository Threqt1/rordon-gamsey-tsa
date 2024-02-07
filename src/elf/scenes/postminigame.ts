import { SceneEnums } from "../../shared/repository"
import { SceneUtil } from "../../shared/util"
import { TorchesTexture } from "../textures"
import { PostMinigameSprites } from "../sprites"
import { Player } from "../../shared/sprites/player"

type ElfPostMinigameMarkers = {
    Player: SceneUtil.PointObject
    TeleporterNPCLocation: SceneUtil.PointObject
    Torch1: SceneUtil.PointObject
    Torch2: SceneUtil.PointObject
    Torch3: SceneUtil.PointObject
    Torch4: SceneUtil.PointObject
    Torch5: SceneUtil.PointObject
}

export class ElfPostMinigameScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.Name.ElfPostMinigame)
    }

    create() {
        let { collisionsLayer, map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.ElfMinigame)
        let markers = objects as ElfPostMinigameMarkers

        this.sprites.initialize(map)
        let music = this.sound.add(SceneEnums.Music.ElfNeutral)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play("", {
            loop: true
        })

        let teleporter = new PostMinigameSprites.GoblinTeleporter(this, markers.TeleporterNPCLocation.x, markers.TeleporterNPCLocation.y)
        let player = new Player(this, markers.Player.x, markers.Player.y)

        this.sprites.controllables.push(player)
        this.sprites.addInteractables(teleporter)
        this.sprites.physicsBodies.addMultiple([player.sprite, teleporter.sprite])
        this.sprites.interactingBodies.add(player.sprite)
        this.sprites.physicsBodies.setDepth(playerSpriteDepth)

        this.add
            .sprite(markers.Torch1.x, markers.Torch1.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch1)
            .play(`-torch1-idle`)
            .setDepth(playerSpriteDepth)
        this.add
            .sprite(markers.Torch2.x, markers.Torch2.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch2)
            .play(`-torch2-idle`)
            .setDepth(playerSpriteDepth)
        this.add
            .sprite(markers.Torch3.x, markers.Torch3.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch3)
            .play(`-torch3-idle`)
            .setDepth(playerSpriteDepth)
        this.add
            .sprite(markers.Torch4.x, markers.Torch4.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch4)
            .play(`-torch4-idle`)
            .setDepth(playerSpriteDepth)
        this.add
            .sprite(markers.Torch5.x, markers.Torch5.y, TorchesTexture.TextureKey, TorchesTexture.Frames.Torch5)
            .play(`-torch5-idle`)
            .setDepth(playerSpriteDepth)

        SceneUtil.scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisionsLayer)
    }

    update() {
    }
}