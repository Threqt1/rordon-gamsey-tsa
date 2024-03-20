import { SceneEnums } from "../repository"
import { SceneUtil } from "../util"

/**
 * TODO: REDO THIS GARBAGE SHIT, WHY IS THIS A THING
 */
export class MenuScene extends Phaser.Scene {
    constructor() {
        super(SceneEnums.Name.Menu)
    }

    preload() {
        this.anims.create({
            key: "startButton_animate",
            frames: this.anims.generateFrameNames("button", { start: 1, end: 7, prefix: "start_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        // this.anims.create({
        //     key: "creditsButton_animate",
        //     frames: this.anims.generateFrameNames("button", { start: 0, end: 9, prefix: "credits_", suffix: ".png" }),
        //     repeat: -1,
        //     frameRate: 10
        // })
    }

    create() {
        let music = this.sound.add(SceneEnums.Music.Main)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play({
            loop: true
        })

        const cameraWidth = this.cameras.main.width
        const cameraHeight = this.cameras.main.height

        const startSprite = this.add.sprite(cameraWidth / 2, cameraHeight / 2, "button", "start_1.png")
        const buttonScale = Math.max(cameraWidth / startSprite.width, cameraHeight / startSprite.height) / 10
        startSprite.setScale(buttonScale)
        startSprite.setInteractive()

        // const creditsSprite = this.add.sprite(cameraWidth / 2, cameraHeight / 2 + (startSprite.displayHeight + startSprite.displayHeight / 4), "button", "credits_0.png")
        // creditsSprite.setScale(buttonScale)
        // creditsSprite.setInteractive()

        let switching = false

        startSprite.on("pointerover", () => {
            startSprite.anims.play("startButton_animate")
        })

        startSprite.on("pointerout", () => {
            startSprite.anims.stop()
            startSprite.setFrame(this.anims.get("startButton_animate").frames[0].textureFrame)
        })

        startSprite.on("pointerup", () => {
            if (!switching) {
                switching = true
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.Menu)
            }
        })

        // creditsSprite.on("pointerover", () => {
        //     creditsSprite.play("creditsButton_animate")
        // })

        // creditsSprite.on("pointerout", () => {
        //     creditsSprite.anims.stop()
        //     creditsSprite.setFrame(this.anims.get("creditsButton_animate").frames[0].textureFrame)
        // })

        // creditsSprite.on("pointerup", () => {
        //     if (!switching) {
        //         switching = true 
        //         switchScenesFadeOut(this, SceneEnums.SceneNames.GO)
        //     }
        // })
    }
}