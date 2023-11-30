import { ItemsTexture } from "../../../../textures/elf/minigame/items";
import { BaseFruit, FruitInformation, FruitInteraction } from "./base";

export class MegaPumpkin extends BaseFruit {
    private static pattern = [
        FruitInteraction.SliceUp,
        FruitInteraction.SliceDown,
        FruitInteraction.SliceUp,
        FruitInteraction.SliceLeft,
        FruitInteraction.SliceDown,
        FruitInteraction.SliceRight,
        FruitInteraction.SliceRight,
        FruitInteraction.SliceLeft,
    ]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Frames.Pumpkin + "_1", ItemsTexture.Frames.Pumpkin + "_1"],
        [ItemsTexture.Frames.Pumpkin + "_3", ItemsTexture.Frames.Pumpkin + "_2"],
        [ItemsTexture.Frames.Pumpkin + "_3", ItemsTexture.Frames.Pumpkin + "_2"],
        [ItemsTexture.Frames.Pumpkin + "_5", ItemsTexture.Frames.Pumpkin + "_4"],
        [ItemsTexture.Frames.Pumpkin + "_7", ItemsTexture.Frames.Pumpkin + "_4"],
        [ItemsTexture.Frames.Pumpkin + "_5", ItemsTexture.Frames.Pumpkin + "_6"],
        [ItemsTexture.Frames.Pumpkin + "_7", ItemsTexture.Frames.Pumpkin + "_6"],
        [ItemsTexture.Frames.Pumpkin + "_9", ItemsTexture.Frames.Pumpkin + "_8"],
        [ItemsTexture.Frames.Pumpkin + "_9", ItemsTexture.Frames.Pumpkin + "_8"]

    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, MegaPumpkin.pattern, MegaPumpkin.patternTextures)

        this.mainBody.setScale(2)
    }
}