import { pct } from "../scenes";
import { DialogueTexture } from "../textures";

const DIALOGUE_BOX_SCALE_X = 80
const DIALOGUE_BOX_SCALE_Y = 25
const TEXT_OFFSET_X = 12
const TEXT_OFFSET_Y = 20
const FONT_SIZE = 40

export class DialogueSprite {
    sprite: Phaser.GameObjects.Sprite
    text: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, mapWidth: number, mapHeight: number) {
        this.sprite = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height, DialogueTexture.Frames.Box)
            .setDepth(100).setOrigin(0.5, 1)
        this.sprite.setScale(pct(mapWidth, DIALOGUE_BOX_SCALE_X) / this.sprite.displayWidth, pct(mapHeight, DIALOGUE_BOX_SCALE_Y) / this.sprite.displayHeight)
        this.text = scene.make.text({
            x: (this.sprite.x - (this.sprite.displayWidth / 2)) + pct(this.sprite.displayWidth, TEXT_OFFSET_X),
            y: (this.sprite.y - this.sprite.displayHeight) + pct(this.sprite.displayHeight, TEXT_OFFSET_Y),
            text: "",
            origin: { x: 0, y: 0 },
            style: {
                fontFamily: 'font',
                color: 'white',
                wordWrap: { width: this.sprite.displayWidth - pct(this.sprite.displayWidth, TEXT_OFFSET_X * 2), useAdvancedWrap: true },
                fixedHeight: this.sprite.displayHeight - pct(this.sprite.displayHeight, TEXT_OFFSET_Y * 2),
                align: "left",
                fontSize: FONT_SIZE
            }
        }).setDepth(100)
    }

    setText(text: string) {
        this.text.setText(text.toLowerCase())
    }

    setVisible(visible: boolean) {
        this.text.setVisible(visible)
        this.sprite.setVisible(visible)
    }
}