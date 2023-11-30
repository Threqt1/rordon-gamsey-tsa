import { ItemsTexture } from "../../../../textures/elf/minigame/items";
import { BaseFruit, FruitInformation, FruitInteraction } from "./base";

export class Pumpkin extends BaseFruit {
    private static pattern = [
        FruitInteraction.SliceUp,
        FruitInteraction.SliceDown,
        FruitInteraction.SliceLeft,
        FruitInteraction.SliceRight
    ]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Frames.Pumpkin + "_1", ItemsTexture.Frames.Pumpkin + "_1"],
        [ItemsTexture.Frames.Pumpkin + "_2", ItemsTexture.Frames.Pumpkin + "_3"],
        [ItemsTexture.Frames.Pumpkin + "_4", ItemsTexture.Frames.Pumpkin + "_5"],
        [ItemsTexture.Frames.Pumpkin + "_6", ItemsTexture.Frames.Pumpkin + "_7"],
        [ItemsTexture.Frames.Pumpkin + "_8", ItemsTexture.Frames.Pumpkin + "_9"]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, Pumpkin.pattern, Pumpkin.patternTextures)
    }
}