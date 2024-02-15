import { loadElf, preloadElf } from "../../elf/export";
import { loadFinal, preloadFinal } from "../../final/export";
import { loadGoblin, preloadGoblin } from "../../goblin/export";
import { loadOrc, preloadOrc } from "../../orc/export";
import { loadShared, preloadShared } from "../export";
import { GameData, SceneEnums } from "../repository";
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

        preloadShared(this)
        preloadElf(this)
        preloadGoblin(this)
        preloadOrc(this)
        preloadFinal(this)

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
        loadShared(this)
        loadElf(this)
        loadGoblin(this)
        loadOrc(this)
        loadFinal(this)

        this.registry.set(GameData.DefaultGameData)

        this.scene.launch(SceneEnums.Name.GUI)
        this.scene.start(SceneEnums.Name.Menu)
    }
}