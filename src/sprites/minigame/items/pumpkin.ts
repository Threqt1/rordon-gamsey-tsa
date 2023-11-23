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
        [ItemsTexture.Frames.Pumpkin + "_1", ItemsTexture.Frames.Pumpkin + "_1"],
        [ItemsTexture.Frames.Pumpkin + "_2", ItemsTexture.Frames.Pumpkin + "_3"],
        [ItemsTexture.Frames.Pumpkin + "_4", ItemsTexture.Frames.Pumpkin + "_5"],
        [ItemsTexture.Frames.Pumpkin + "_6", ItemsTexture.Frames.Pumpkin + "_7"],
        [ItemsTexture.Frames.Pumpkin + "_8", ItemsTexture.Frames.Pumpkin + "_9"]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: ItemInformation) {
        super(scene, x, y, info, MinigamePumpkin.pattern, MinigamePumpkin.patternTextures)
    }
}