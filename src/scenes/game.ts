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

        console.log(map)

        this.sprites.use()

        let player = new GamePlayer(this, 30, 130)
        let npc1 = new GameNPC(this, 100, 150)
        let npc2 = new GameNPC(this, 150, 150)



        this.sprites.addControllables(player)
        this.sprites.addInteractables(npc1, npc2)
        this.sprites.addSprites(player.sprite, npc1.sprite, npc2.sprite)
        this.sprites.getBodyGroup().setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        camera.startFollow(player.sprite, true, 0.2, 0.2);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        if (this.scale.height > this.scale.width) {
            camera.setZoom(this.scale.width / map.widthInPixels)
        } else[
            camera.setZoom(this.scale.height / map.heightInPixels)
        ]

        this.sprites.makeCollisions(collisions)
        if (data !== undefined) {
            if (data.fade) switchSceneFadeIn(this)
        }
    }

    update() {
    }
}