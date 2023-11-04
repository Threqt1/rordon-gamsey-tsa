import { Scene } from "phaser";
import { SceneNames } from "../sceneNames";
import { PreloadTilemap } from "../util/util";

export default class Preloader extends Scene {
    constructor() {
        super(SceneNames.Preloader)
    }

    preload() {
        PreloadTilemap(this as Scene, "test", "map.tmj", "spritesheet.png")

        this.load.atlas("character", "/animations/animations.png", "/animations/animations.json")
    }

    create() {
        this.scene.start(SceneNames.Game)
    }
}