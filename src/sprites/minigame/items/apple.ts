import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseMinigameItem, ItemInformation, MinigameItemInteraction } from "./base";

export default class MinigameApple extends BaseMinigameItem {
    private static pattern = [MinigameItemInteraction.SliceUp, MinigameItemInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Items.Apple + "_1", ItemsTexture.Items.Apple + "_1"],
        [ItemsTexture.Items.Apple + "_3", ItemsTexture.Items.Apple + "_2"],
        [ItemsTexture.Items.Apple + "_5", ItemsTexture.Items.Apple + "_4"]
    ]

    getPattern(): MinigameItemInteraction[] {
        return MinigameApple.pattern
    }
    getPatternTextures(): [string, string][] {
        return MinigameApple.patternTextures
    }

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info)
    }
}