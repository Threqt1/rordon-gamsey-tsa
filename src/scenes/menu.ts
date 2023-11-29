import { Scene } from "phaser";
import { SceneEnum, switchScenesFadeOut } from "./scenesUtilities";

export default class MenuScene extends Scene {
    constructor() {
        super(SceneEnum.SceneName.Menu)
    }

    preload() {
        this.anims.create({
            key: "startButton_animate",
            frames: this.anims.generateFrameNames("button", { start: 1, end: 7, prefix: "start_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: "creditsButton_animate",
            frames: this.anims.generateFrameNames("button", { start: 0, end: 9, prefix: "credits_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })
    }

    create() {
        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        const startSprite = this.add.sprite(cameraWidth / 2, cameraHeight / 2, "button", "start_1.png")
        const buttonScale = Math.max(cameraWidth / startSprite.width, cameraHeight / startSprite.height) / 10
        startSprite.setScale(buttonScale)
        startSprite.setInteractive()

        const creditsSprite = this.add.sprite(cameraWidth / 2, cameraHeight / 2 + (startSprite.displayHeight + startSprite.displayHeight / 4), "button", "credits_0.png")
        creditsSprite.setScale(buttonScale)
        creditsSprite.setInteractive()



        startSprite.on("pointerover", () => {
            startSprite.anims.play("startButton_animate")
        })

        startSprite.on("pointerout", () => {
            startSprite.anims.stop()
            startSprite.setFrame(this.anims.get("startButton_animate").frames[0].textureFrame)
        })

        let switching = false
        startSprite.on("pointerup", () => {
            if (!switching) {
                switching = true
                switchScenesFadeOut(this, SceneEnum.SceneName.Minigame)
            }
        })

        creditsSprite.on("pointerover", () => {
            creditsSprite.play("creditsButton_animate")
        })

        creditsSprite.on("pointerout", () => {
            creditsSprite.anims.stop()
            creditsSprite.setFrame(this.anims.get("creditsButton_animate").frames[0].textureFrame)
        })
    }
}