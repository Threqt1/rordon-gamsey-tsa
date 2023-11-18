import { Scene } from "phaser"
import { SceneNames } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"
import Player from "../sprites/player/sprite"
import TestNPC from "../sprites/testNPC/sprite"

export default class GameScene extends Scene {
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

        this.interaction.addInteractables(new TestNPC(this, 100, 150), new TestNPC(this, 150, 150))

        let player = new Player(this, 30, 130)
        this.interaction.addControllables(player)
        this.interaction.getSprites().setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        camera.startFollow(player, false, 0.1, 0.1);
        camera.setZoom(5)

        this.interaction.makeCollisions(this.collisions!)
    }

    update() {
    }
}