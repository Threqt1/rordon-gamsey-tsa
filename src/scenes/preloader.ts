import { Scene } from "phaser";
import { SceneName } from "../enums/sceneNames";
import { PreloadTilemap } from "../util/tilemaps";
import { pct } from "../util/sizes";
import { PlayerTexture } from "../textures/player";
import { ItemsTexture } from "../textures/minigame/items";
import { KeyboardTexture } from "../textures/keyboard";

export default class PreloaderScene extends Scene {
    constructor() {
        super(SceneName.Preloader)
    }

    preload() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        let progressBox = this.add.graphics()
        let progressBar = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(pct(cameraWidth, 10), pct(cameraHeight, 50), pct(cameraWidth, 80), pct(cameraHeight, 10))

        PreloadTilemap(this, "test", "map.tmj", "spritesheet.png")
        PreloadTilemap(this, "test2", "map2.tmj", "spritesheet.png")

        PlayerTexture.preload(this)
        ItemsTexture.preload(this)
        KeyboardTexture.preload(this)

        this.load.atlas("button", "/textures/buttons.png", "/textures/buttons.json");

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
        PlayerTexture.load(this)
        ItemsTexture.load(this)
        KeyboardTexture.load(this)
        this.scene.start(SceneName.Minigame)
    }
}