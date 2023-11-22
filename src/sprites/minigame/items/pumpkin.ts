import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseMinigameItem, ItemInformation, MinigameItemInteraction } from "./base";

export default class MinigamePumpkin extends BaseMinigameItem {
    private static pattern = [
        MinigameItemInteraction.SliceUp,
        MinigameItemInteraction.SliceDown,
        MinigameItemInteraction.SliceLeft,
        MinigameItemInteraction.SliceRight
    ]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Pumpkin + "_1", ItemsTexture.Items.Pumpkin + "_1"],
        [ItemsTexture.Items.Pumpkin + "_2", ItemsTexture.Items.Pumpkin + "_3"],
        [ItemsTexture.Items.Pumpkin + "_4", ItemsTexture.Items.Pumpkin + "_5"],
        [ItemsTexture.Items.Pumpkin + "_6", ItemsTexture.Items.Pumpkin + "_7"],
        [ItemsTexture.Items.Pumpkin + "_8", ItemsTexture.Items.Pumpkin + "_9"]
    ]

    getPattern(): MinigameItemInteraction[] {
        return MinigamePumpkin.pattern
    }
    getPatternTextures(): [string, string][] {
        return MinigamePumpkin.patternTextures
    }

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info)
    }
}