import { Scene } from "phaser"
import { SceneNames } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"
import Player from "../sprites/player/sprite"
import TestNPC from "../sprites/testNPC/sprite"

export default class GameScene extends Scene {
    private player!: Player
    private map!: Phaser.Tilemaps.Tilemap
    private collisions!: Phaser.Tilemaps.TilemapLayer
    constructor() {
        super(SceneNames.Game)
    }

    create() {
        let { collisions, map, playerDepth } = LoadTilemap(this as Scene, "test")

        this.map = map;
        this.collisions = collisions
        this.interaction.use()

        this.interaction.add(new TestNPC(this, 100, 150), new TestNPC(this, 150, 150))

        this.player = new Player(this, 30, 130)
        this.player.setDepth(playerDepth)
        this.interaction.getSprites().setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        camera.startFollow(this.player, true, 1, 1);
        camera.setZoom(5)

        this.physics.add.collider(this.player, this.collisions!)
        this.physics.add.collider(this.player, this.interaction.getSprites()!)
        this.physics.add.overlap(this.player, this.interaction.getZones()!)
    }

    update() {
        this.player.control(this.input)
    }
}