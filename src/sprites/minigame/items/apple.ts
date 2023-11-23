import { ItemsTexture } from "../../../textures/minigame/items";
import { BaseMinigameItem, ItemInformation, MinigameItemInteraction } from "./base";

export default class MinigameApple extends BaseMinigameItem {
    private static pattern = [MinigameItemInteraction.SliceUp, MinigameItemInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Frames.Apple + "_1", ItemsTexture.Frames.Apple + "_1"],
        [ItemsTexture.Frames.Apple + "_3", ItemsTexture.Frames.Apple + "_2"],
        [ItemsTexture.Frames.Apple + "_5", ItemsTexture.Frames.Apple + "_4"]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info, MinigameApple.pattern, MinigameApple.patternTextures)
    }
}