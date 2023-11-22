import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseMinigameItem, ItemInformation, MinigameItemInteraction } from "./base";

export default class MinigameMegaPumpkin extends BaseMinigameItem {
    private static pattern = [
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceDown,
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceLeft,
        MinigameItemInteraction.SliceDown,
        MinigameItemInteraction.SliceRight,
        MinigameItemInteraction.SliceRight,
        MinigameItemInteraction.SliceLeft,
    ]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Pumpkin + "_1", ItemsTexture.Items.Pumpkin + "_1"],
        [ItemsTexture.Items.Pumpkin + "_3", ItemsTexture.Items.Pumpkin + "_2"],
        [ItemsTexture.Items.Pumpkin + "_3", ItemsTexture.Items.Pumpkin + "_2"],
        [ItemsTexture.Items.Pumpkin + "_5", ItemsTexture.Items.Pumpkin + "_4"],
        [ItemsTexture.Items.Pumpkin + "_7", ItemsTexture.Items.Pumpkin + "_4"],
        [ItemsTexture.Items.Pumpkin + "_5", ItemsTexture.Items.Pumpkin + "_6"],
        [ItemsTexture.Items.Pumpkin + "_7", ItemsTexture.Items.Pumpkin + "_6"],
        [ItemsTexture.Items.Pumpkin + "_9", ItemsTexture.Items.Pumpkin + "_8"],
        [ItemsTexture.Items.Pumpkin + "_9", ItemsTexture.Items.Pumpkin + "_8"]

    ]

    getPattern(): MinigameItemInteraction[] {
        return MinigameMegaPumpkin.pattern
    }
    getPatternTextures(): [string, string][] {
        return MinigameMegaPumpkin.patternTextures
    }

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info)

        this._sprites[0].setScale(2)
    }
}