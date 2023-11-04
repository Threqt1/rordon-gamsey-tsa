import { Scene } from "phaser";
import { SceneNames } from "../enums/sceneNames";
import { PreloadTilemap } from "../util/tilemaps";

export default class Preloader extends Scene {
    constructor() {
        super(SceneNames.Preloader)
    }

    preload() {
        PreloadTilemap(this as Scene, "test", "map.tmj", "spritesheet.png")

        this.load.atlas("character", "/animations/animations.png", "/animations/animations.json")
        //this.load.image("bg", "/img/background.png")
    }

    create() {
        this.scene.start(SceneNames.Game)
        // const cameraWidth = this.cameras.main.width
        // const cameraHeight = this.cameras.main.height

        // const bg = this.add.image(0, 0, 'bg')
        //     .setOrigin(0)

        // bg.setScale(Math.max(cameraWidth / bg.width, cameraHeight / bg.height))
    }
}