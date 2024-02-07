import { SceneUtil } from "../../util";
import { DialogueTexture } from "../../textures";

const DIALOGUE_BOX_SCALE_X_PERCENT = 80
const DIALOGUE_BOX_SCALE_Y_PERCENT = 25
const TEXT_OFFSET_X_PERCENT = 12
const TEXT_OFFSET_Y_PERCENT = 20
const FONT_SIZE = 40

/**
 * The sprite that displays dialogue on the screen
 */
export class DisplaySprite {
    dialogueBoxSprite: Phaser.GameObjects.Sprite
    dialogueText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, mapWidth: number, mapHeight: number) {
        // Create the dialogue box's sprite
        this.dialogueBoxSprite = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height, DialogueTexture.Frames.Box)
        // Set the origin to the center-bottom
        this.dialogueBoxSprite.setOrigin(0.5, 1)

        let dialogueBoxWidth = SceneUtil.pct(mapWidth, DIALOGUE_BOX_SCALE_X_PERCENT) / this.dialogueBoxSprite.displayWidth
        let dialogueBoxHeight = SceneUtil.pct(mapHeight, DIALOGUE_BOX_SCALE_Y_PERCENT) / this.dialogueBoxSprite.displayHeight
        this.dialogueBoxSprite.setScale(dialogueBoxWidth, dialogueBoxHeight)

        let dialogueTextX = (this.dialogueBoxSprite.x - (this.dialogueBoxSprite.displayWidth / 2)) + SceneUtil.pct(this.dialogueBoxSprite.displayWidth, TEXT_OFFSET_X_PERCENT)
        let dialogueTextY = (this.dialogueBoxSprite.y - this.dialogueBoxSprite.displayHeight) + SceneUtil.pct(this.dialogueBoxSprite.displayHeight, TEXT_OFFSET_Y_PERCENT)
        this.dialogueText = scene.make.text({
            x: dialogueTextX,
            y: dialogueTextY,
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'Arial',
                color: 'white',
                wordWrap: { width: this.dialogueBoxSprite.displayWidth - SceneUtil.pct(this.dialogueBoxSprite.displayWidth, TEXT_OFFSET_X_PERCENT * 2), useAdvancedWrap: true },
                fixedHeight: this.dialogueBoxSprite.displayHeight - SceneUtil.pct(this.dialogueBoxSprite.displayHeight, TEXT_OFFSET_Y_PERCENT * 2),
                align: "left",
                fontSize: FONT_SIZE
            }
        })
    }

    setText(text: string) {
        this.dialogueText.setText(text)
    }

    setVisible(visible: boolean) {
        this.dialogueText.setVisible(visible)
        this.dialogueBoxSprite.setVisible(visible)
    }
}