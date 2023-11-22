import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseMinigameItem, ItemInformation, MinigameItemInteraction } from "./base";

export default class MinigameMegaApple extends BaseMinigameItem {
    private static pattern = [
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceDown,
        MinigameItemInteraction.SliceLeft,
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceRight,
        MinigameItemInteraction.SliceDown,
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceLeft
    ]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Apple + "_1", ItemsTexture.Items.Apple + "_1"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"],
    ]

    getPattern(): MinigameItemInteraction[] {
        return MinigameMegaApple.pattern
    }
    getPatternTextures(): [string, string][] {
        return MinigameMegaApple.patternTextures
    }

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info)

        this._sprites[0].setScale(2)
    }
}