import { Scene } from "phaser";
import { DialogueTexture, KeyboardTexture, PlayerTexture } from "../textures";
import { pct, preloadTilemap, SceneEnums } from ".";
import { TorchesTexture } from "../textures/elf/minigame";

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

        preloadTilemap(this, SceneEnums.TilemapNames.Game, "map.tmj", "spritesheet.png")
        preloadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame, "goblin/minigame.tmj", "spritesheet.png")
        preloadTilemap(this, SceneEnums.TilemapNames.ElfMinigame, "elf/minigame.tmj", "elf/1.png", "elf/2.png")

        PlayerTexture.preload(this)
        KeyboardTexture.preload(this)
        DialogueTexture.preload(this)
        TorchesTexture.preload(this)

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
        KeyboardTexture.load(this)
        TorchesTexture.load(this)

        this.scene.launch(SceneEnums.SceneNames.GUI)
        this.scene.start(SceneEnums.SceneNames.Menu)
    }
}