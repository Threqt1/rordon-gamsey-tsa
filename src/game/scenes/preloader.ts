import { ElfTexture, FruitsTexture, SlashesTexture, TorchesTexture } from "../../elf/textures";
import { GoblinTexture } from "../../goblin/textures";
import { GameData, SceneEnums } from "../repository";
import { DialogueTexture, FoodTexture, KeyboardTexture, PlayerTexture } from "../textures";
import { SceneUtil } from "../util";

/**
 * Preloads necessary assets before running the game
 */
export class PreloaderScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.Name.Preloader)
    }

    preload() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        // Create the progress bar graphics
        let progressBox = this.add.graphics()
        let progressBar = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(SceneUtil.pct(cameraWidth, 10), SceneUtil.pct(cameraHeight, 50), SceneUtil.pct(cameraWidth, 80), SceneUtil.pct(cameraHeight, 10))

        /* BEGIN LOADING */

        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.GoblinMinigameLevel1, "goblin/map1.tmj", "goblin/goblin.png")
        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.GoblinMinigameLevel2, "goblin/map2.tmj", "goblin/goblin.png")
        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.GoblinMinigameLevel3, "goblin/map3.tmj", "goblin/goblin.png")
        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.ElfMinigame, "elf/minigame.tmj", "elf/1.png", "elf/2.png")
        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.ElfHub, "elf/hub.tmj", "elf/2.png", "goblin/goblin.png")
        SceneUtil.preloadTilemap(this, SceneEnums.Tilemap.Final, "final/castle.tmj", "final/castle.png")

        PlayerTexture.preload(this)
        KeyboardTexture.preload(this)
        DialogueTexture.preload(this)
        FoodTexture.preload(this)
        SlashesTexture.preload(this)
        ElfTexture.preload(this)
        FruitsTexture.preload(this)
        TorchesTexture.preload(this)
        GoblinTexture.preload(this)

        this.load.audio(SceneEnums.Music.Main, "/music/main.mp3", {

        })
        this.load.audio(SceneEnums.Music.ElfNeutral, "/music/elfneutral.mp3")
        this.load.audio(SceneEnums.Music.ElfMinigame, "/music/elfminigame.mp3")
        this.load.audio(SceneEnums.Music.GoblinNeutral, "/music/goblinneutral.mp3")
        this.load.audio(SceneEnums.Music.GoblinAlerted, "/music/goblinalerted.mp3")
        this.load.audio(SceneEnums.Music.Final, "/music/final.mp3")

        this.load.atlas("button", "/textures/buttons.png", "/textures/buttons.json");

        /* END LOADING */

        this.load.on("progress", (value: number) => {
            // Update progress bar as the game loads
            progressBar.clear()
            progressBar.fillStyle(0xF2F3F5, 1)
            progressBar.fillRect(SceneUtil.pct(cameraWidth, 11), SceneUtil.pct(cameraHeight, 51), SceneUtil.pct(cameraWidth, 78) * value, SceneUtil.pct(cameraHeight, 8))
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
        FoodTexture.load(this)
        SlashesTexture.load(this)
        ElfTexture.load(this)
        FruitsTexture.load(this)
        TorchesTexture.load(this)
        GoblinTexture.load(this)

        this.registry.set(GameData.DefaultGameData)

        this.scene.launch(SceneEnums.Name.GUI)
        this.scene.start(SceneEnums.Name.Menu)
    }
}