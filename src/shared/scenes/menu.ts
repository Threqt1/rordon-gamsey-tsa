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
        this.load.image("loading", "img/loading.png")

        this.anims.create({
            key: "startButton_animate",
            frames: this.anims.generateFrameNames("button", { start: 1, end: 7, prefix: "start_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })
    }

    create() {
        let music = this.sound.add(SceneEnums.Music.Main)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play({
            loop: true
        })

        const camera = this.cameras.main;
        const cameraWidth = camera.width
        const cameraHeight = camera.height

        let image = this.add.image(camera.centerX, camera.centerY, "loading")
        image.setScale(Math.min(camera.width / image.width, camera.height / image.height))

        const startSprite = this.add.sprite(camera.centerX, camera.centerY + image.displayHeight / 3, "button", "start_1.png")
        const buttonScale = Math.max(cameraWidth / startSprite.width, cameraHeight / startSprite.height) / 15
        startSprite.setScale(buttonScale)
        startSprite.setInteractive()

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
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.Initial)
            }
        })
    }
}