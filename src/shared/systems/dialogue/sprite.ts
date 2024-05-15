import { SceneUtil } from "../../util";
import { DialogueTexture } from "../../textures";

const DIALOGUE_BOX_SCALE = 8

const DIALOGUE_BOX_BOTTOM_PCT = 4
const DIALOGUE_BOX_X_PCT = 3
const TEXT_OFFSET_PCT = 9
const TEXT_FONT_SIZE = 35

const NAME_OFFSET_X_PCT = 10
const NAME_OFFSET_Y_PCT = 10
const NAME_FONT_SIZE = 26

/**
 * The sprite that displays dialogue on the screen
 */
export class DialogueSprite {
    dialogueBox: Phaser.GameObjects.Group
    dialogueText: Phaser.GameObjects.Text
    nameText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        this.dialogueBox = scene.add.group()

        let leftX = SceneUtil.pct(scene.cameras.main.width, DIALOGUE_BOX_X_PCT)
        let leftY = SceneUtil.pct(scene.cameras.main.height, 100 - DIALOGUE_BOX_BOTTOM_PCT)
        let dialogueBoxLeft = scene.add.sprite(leftX, leftY, DialogueTexture.Frames.Left)
            .setOrigin(0, 1)
            .setScale(DIALOGUE_BOX_SCALE)
        let rightX = SceneUtil.pct(scene.cameras.main.width, 100 - DIALOGUE_BOX_X_PCT)
        let dialogueBoxMiddle = scene.add.sprite(dialogueBoxLeft.x + dialogueBoxLeft.displayWidth, leftY, DialogueTexture.Frames.Middle)
            .setOrigin(0, 1)
            .setScale(1, DIALOGUE_BOX_SCALE)
        let rightY = dialogueBoxMiddle.y - dialogueBoxMiddle.displayHeight
        let dialogueBoxRight = scene.add.sprite(rightX, rightY, DialogueTexture.Frames.Right)
            .setOrigin(1, 0)
            .setScale(DIALOGUE_BOX_SCALE)
        let remainingX = (dialogueBoxRight.x - dialogueBoxRight.displayWidth) - (dialogueBoxLeft.x + dialogueBoxLeft.displayWidth)
        dialogueBoxMiddle.setScale(remainingX / dialogueBoxMiddle.displayWidth, DIALOGUE_BOX_SCALE)

        this.dialogueBox.addMultiple([dialogueBoxLeft, dialogueBoxMiddle, dialogueBoxRight])

        let textX = dialogueBoxMiddle.x + SceneUtil.pct(dialogueBoxMiddle.displayWidth, TEXT_OFFSET_PCT)
        let textY = dialogueBoxMiddle.y - dialogueBoxMiddle.displayHeight + SceneUtil.pct(dialogueBoxMiddle.displayHeight, TEXT_OFFSET_PCT)
        this.dialogueText = scene.make.text({
            x: textX,
            y: textY,
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                wordWrap: { width: dialogueBoxMiddle.displayWidth - SceneUtil.pct(dialogueBoxMiddle.displayWidth, TEXT_OFFSET_PCT), useAdvancedWrap: true },
                fixedHeight: dialogueBoxMiddle.displayHeight,
                align: "left",
                fontSize: TEXT_FONT_SIZE
            }
        })

        let nameX = dialogueBoxLeft.x + SceneUtil.pct(dialogueBoxLeft.displayWidth, NAME_OFFSET_X_PCT)
        let nameY = dialogueBoxLeft.y - dialogueBoxLeft.displayHeight + SceneUtil.pct(dialogueBoxLeft.displayHeight, NAME_OFFSET_Y_PCT)
        this.nameText = scene.make.text({
            x: nameX,
            y: nameY,
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                align: "center",
                fontSize: NAME_FONT_SIZE,
                fixedWidth: SceneUtil.pct(dialogueBoxLeft.displayWidth, 70)
            }
        })
    }

    setText(text: string) {
        this.dialogueText.setText(text)
    }

    setName(name: string) {
        this.nameText.setText(name)
    }

    setVisible(visible: boolean) {
        this.dialogueText.setVisible(visible)
        this.nameText.setVisible(visible)
        this.dialogueBox.setVisible(visible)
    }
}