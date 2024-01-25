import { DialogueTexture, KeyboardTexture, PlayerTexture } from "../textures";
import { pct, preloadTilemap, SceneEnums } from ".";
import { SlashesTexture, ElfTexture, FruitsTexture, TorchesTexture } from "../textures/elf";
import { GoblinTexture } from "../textures/goblin";

/**
 * Preloads necessary assets before running the game
 */
export class PreloaderScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.SceneNames.Preloader)
    }

    preload() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        // Create the progress bar graphics
        let progressBox = this.add.graphics()
        let progressBar = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(pct(cameraWidth, 10), pct(cameraHeight, 50), pct(cameraWidth, 80), pct(cameraHeight, 10))

        /* BEGIN LOADING */

        preloadTilemap(this, SceneEnums.TilemapNames.Game, "map.tmj", "spritesheet.png")
        preloadTilemap(this, SceneEnums.TilemapNames.GoblinMinigameLevel1, "goblin/map1.tmj", "goblin/goblin.png")
        preloadTilemap(this, SceneEnums.TilemapNames.GoblinMinigameLevel2, "goblin/map2.tmj", "goblin/goblin.png")
        preloadTilemap(this, SceneEnums.TilemapNames.GoblinMinigameLevel3, "goblin/map3.tmj", "goblin/goblin.png")
        preloadTilemap(this, SceneEnums.TilemapNames.ElfMinigame, "elf/minigame.tmj", "elf/1.png", "elf/2.png")
        preloadTilemap(this, SceneEnums.TilemapNames.ElfHub, "elf/hub.tmj", "elf/2.png", "goblin/goblin.png")

        PlayerTexture.preload(this)
        KeyboardTexture.preload(this)
        DialogueTexture.preload(this)
        SlashesTexture.preload(this)
        ElfTexture.preload(this)
        FruitsTexture.preload(this)
        TorchesTexture.preload(this)
        GoblinTexture.preload(this)

        this.load.atlas("button", "/textures/buttons.png", "/textures/buttons.json");

        /* END LOADING */

        this.load.on("progress", (value: number) => {
            // Update progress bar as the game loads
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
        DialogueTexture.load(this)
        SlashesTexture.load(this)
        ElfTexture.load(this)
        FruitsTexture.load(this)
        TorchesTexture.load(this)
        GoblinTexture.load(this)

        this.scene.launch(SceneEnums.SceneNames.GUI)
        this.scene.start(SceneEnums.SceneNames.Menu)
    }
}