import { SceneUtil } from "../../util";
import { DialogueTexture } from "../../textures";

const DIALOGUE_BOX_SCALE = 8

const DIALOGUE_BOX_BOTTOM_PCT = 4
const DIALOGUE_BOX_X_PCT = 3

const TEXT_PADDING = 20
const TEXT_OFFSET_X_PCT = 2
const TEXT_OFFSET_Y_PCT = 15
const TEXT_FONT_SIZE = 35

const NAME_OFFSET_X_PCT = 10
const NAME_OFFSET_Y_PCT = 18
const NAME_FONT_SIZE = 28

const NEXT_FONT_SIZE = 28
const NEXT_OFFSET_X_PCT = 20
const NEXT_OFFSET_Y_PCT = 65

/**
 * The sprite that displays dialogue on the screen
 */
export class DialogueSprite {
    scene: Phaser.Scene
    dialogueBox: Phaser.GameObjects.Group
    boxLeft: Phaser.GameObjects.Sprite
    boxMiddle: Phaser.GameObjects.Sprite
    boxRight: Phaser.GameObjects.Sprite
    dialogueText: Phaser.GameObjects.Text
    nameText: Phaser.GameObjects.Text
    nextText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.dialogueBox = scene.add.group()

        let leftX = SceneUtil.pct(scene.cameras.main.width, DIALOGUE_BOX_X_PCT)
        let leftY = SceneUtil.pct(scene.cameras.main.height, 100 - DIALOGUE_BOX_BOTTOM_PCT)
        this.boxLeft = scene.add.sprite(leftX, leftY, DialogueTexture.Frames.Left)
            .setOrigin(0, 1)
            .setScale(DIALOGUE_BOX_SCALE)
            .setDepth(2)
        this.boxMiddle = scene.add.sprite(this.boxLeft.x + this.boxLeft.displayWidth, leftY, DialogueTexture.Frames.Middle)
            .setOrigin(0, 1)
            .setScale(1, DIALOGUE_BOX_SCALE)
            .setDepth(1)
        let rightX = SceneUtil.pct(scene.cameras.main.width, 100 - DIALOGUE_BOX_X_PCT)
        let rightY = this.boxMiddle.y - this.boxMiddle.displayHeight
        this.boxRight = scene.add.sprite(rightX, rightY, DialogueTexture.Frames.Right)
            .setOrigin(1, 0)
            .setScale(DIALOGUE_BOX_SCALE)
            .setDepth(2)
        let remainingX = (this.boxRight.x - this.boxRight.displayWidth) - (this.boxLeft.x + this.boxLeft.displayWidth)
        this.boxMiddle.setScale(remainingX / this.boxMiddle.displayWidth + 0.5, DIALOGUE_BOX_SCALE)

        this.dialogueBox.addMultiple([this.boxLeft, this.boxMiddle, this.boxRight])

        this.dialogueText = scene.make.text({
            x: 0,
            y: 0,
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                wordWrap: { width: this.boxMiddle.displayWidth - SceneUtil.pct(this.boxMiddle.displayWidth, TEXT_OFFSET_X_PCT), useAdvancedWrap: true },
                fixedHeight: this.boxMiddle.displayHeight,
                align: "left",
                fontSize: TEXT_FONT_SIZE
            }
        }).setDepth(3)

        this.nameText = scene.make.text({
            x: 0,
            y: 0,
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                align: "center",
                fontSize: NAME_FONT_SIZE,
                fixedWidth: SceneUtil.pct(this.boxLeft.displayWidth, 70)
            }
        }).setDepth(3)

        this.nextText = scene.make.text({
            x: 0,
            y: 0,
            text: "E to Continue ->",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                align: "center",
                fontSize: NEXT_FONT_SIZE,
            }
        }).setDepth(3)

        let textX = this.boxLeft.x + this.boxLeft.displayWidth + SceneUtil.pct(this.boxMiddle.displayWidth, TEXT_OFFSET_X_PCT)
        let textY = this.boxMiddle.y - this.boxMiddle.displayHeight + SceneUtil.pct(this.boxMiddle.displayHeight, TEXT_OFFSET_Y_PCT)
        this.dialogueText.setPosition(textX, textY)

        let nameX = this.boxLeft.x + SceneUtil.pct(this.boxLeft.displayWidth, NAME_OFFSET_X_PCT)
        let nameY = this.boxLeft.y - this.boxLeft.displayHeight + SceneUtil.pct(this.boxLeft.displayHeight, NAME_OFFSET_Y_PCT)
        this.nameText.setPosition(nameX, nameY)

        let nextX = this.boxRight.x - this.boxRight.displayWidth + SceneUtil.pct(this.boxRight.displayWidth, NEXT_OFFSET_X_PCT)
        let nextY = this.boxRight.y + SceneUtil.pct(this.boxRight.displayHeight, NEXT_OFFSET_Y_PCT)
        this.nextText.setPosition(nextX, nextY)
    }

    updatePositions() {
        let center = SceneUtil.pct(this.scene.cameras.main.width, 50)
        let xScale = (this.dialogueText.displayWidth + TEXT_PADDING) / this.boxMiddle.width
        this.boxMiddle.setX(center).setScale(xScale + 1, DIALOGUE_BOX_SCALE)
        let leftX = center - this.boxMiddle.displayWidth / 2
        this.boxLeft.setX(leftX)
        let rightX = center + this.boxMiddle.displayWidth / 2
        this.boxRight.setX(rightX)


    }

    setText(text: string) {
        this.dialogueText.setText(text)
        //this.updatePositions()
    }

    setName(name: string) {
        this.nameText.setText(name)
        //this.updatePositions()
    }

    setVisible(visible: boolean) {
        this.dialogueText.setVisible(visible)
        this.nameText.setVisible(visible)
        this.nextText.setVisible(visible)
        this.dialogueBox.setVisible(visible)
    }
}