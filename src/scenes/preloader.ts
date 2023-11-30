import { Scene } from "phaser";
import { KeyboardTexture, PlayerTexture } from "../textures";
import { preloadTilemap, SceneEnums } from ".";

function pct(full: number, pct: number) {
    return full * (pct / 100)
}

export class PreloaderScene extends Scene {
    constructor() {
        super(SceneEnums.SceneNames.Preloader)
    }

    preload() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        let progressBox = this.add.graphics()
        let progressBar = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(pct(cameraWidth, 10), pct(cameraHeight, 50), pct(cameraWidth, 80), pct(cameraHeight, 10))

        preloadTilemap(this, "test", "map.tmj", "spritesheet.png")
        preloadTilemap(this, "test2", "map2.tmj", "spritesheet.png")
        preloadTilemap(this, "minigame", "minigame.tmj", "minigame.png")

        PlayerTexture.preload(this)
        KeyboardTexture.preload(this)

        this.load.atlas("button", "/textures/buttons.png", "/textures/buttons.json");

        this.load.image("purple", "/img/purple.png")

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
        KeyboardTexture.load(this)

        this.scene.start(SceneEnums.SceneNames.Menu)
    }
}