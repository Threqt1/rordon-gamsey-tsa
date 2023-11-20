import { Scene } from "phaser"
import { SceneName } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"
import GamePlayer from "../sprites/game/player"
import GameNPC from "../sprites/game/npc"
import { switchSceneFadeIn } from "../util/fades"

export default class GameScene extends Scene {
    constructor() {
        super(SceneName.Game)
    }

    create(data?: { fade: boolean }) {
        let { collisions, map, playerDepth } = LoadTilemap(this, "test")

        this.sprites.use()

        this.sprites.addInteractables(new GameNPC(this, 100, 150), new GameNPC(this, 150, 150))

        let player = new GamePlayer(this, 30, 130)
        this.sprites.addControllables(player)
        this.sprites.getBodies().setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        camera.startFollow(player, true, 0.2, 0.2);
        camera.setZoom(this.scale.width / 350)

        this.sprites.makeCollisions(collisions)
        if (data !== undefined) {
            if (data.fade) switchSceneFadeIn(this)
        }
    }

    update() {
    }
}