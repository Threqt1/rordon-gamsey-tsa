import { Player } from "../../sprites/game"
import { loadTilemap, SceneEnums, scaleAndConfigureCamera, PointObject } from "../"
import { GoblinMinigameTeleporterNPC } from "../../sprites/elf/postminigame/teleporter"
import { TorchesTexture } from "../../textures/elf"

type ElfPostMinigameMarkers = {
    Player: PointObject
    TeleporterNPCLocation: PointObject
    Torch1: PointObject
    Torch2: PointObject
    Torch3: PointObject
    Torch4: PointObject
    Torch5: PointObject
}

export class ElfPostMinigameScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.SceneNames.ElfPostMinigame)
    }

    create() {
        let { collisionsLayer, map, playerSpriteDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.ElfMinigame)
        let markers = objects as ElfPostMinigameMarkers

        this.sprites.initialize(map)

        let player = new Player(this, markers.Player.x, markers.Player.y)
        let teleporter = new GoblinMinigameTeleporterNPC(this, markers.TeleporterNPCLocation.x, markers.TeleporterNPCLocation.y)

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

        scaleAndConfigureCamera(this, map, player.sprite)

        this.sprites.makeCollisionsWithLayer(collisionsLayer)
    }

    update() {
    }
}