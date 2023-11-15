import { Scene } from "phaser";
import { SceneNames } from "../enums/sceneNames";
import { PreloadTilemap } from "../util/tilemaps";
import { pct } from "../util/sizes";
import MainCharacter from "../sprites/characters/mainCharacter/sprite";
import { MainCharacterTextures } from "../sprites/characters/mainCharacter/textures";

export default class PreloaderScene extends Scene {
    constructor() {
        super(SceneNames.Preloader)
    }

    preload() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        let progressBox = this.add.graphics()
        let progressBar = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(pct(cameraWidth, 10), pct(cameraHeight, 50), pct(cameraWidth, 80), pct(cameraHeight, 10))

        PreloadTilemap(this as Scene, "test", "map.tmj", "spritesheet.png")

        this.load.atlas(MainCharacterTextures.Key, "/animations/animations.png", "/animations/animations.json")
        this.load.atlas("button", "/animations/buttons.png", "/animations/buttons.json");

        this.load.on("progress", (value: number) => {
            progressBar.clear()
            progressBar.fillStyle(0xF2F3F5, 1)
            progressBar.fillRect(pct(cameraWidth, 11), pct(cameraHeight, 51), pct(cameraWidth, 78) * value, pct(cameraHeight, 8))
        })

        this.load.on("complete", () => {
            progressBox.destroy()
            progressBar.destroy()
        })
    }

    create() {
        this.scene.start(SceneNames.Game)
    }
}