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
        [ItemsTexture.Frames.Pumpkin.Base, ItemsTexture.Frames.Pumpkin.Base],
        [ItemsTexture.Frames.Pumpkin.Core1, ItemsTexture.Frames.Pumpkin.Chunk1],
        [ItemsTexture.Frames.Pumpkin.Core1, ItemsTexture.Frames.Pumpkin.Chunk1],
        [ItemsTexture.Frames.Pumpkin.Core2, ItemsTexture.Frames.Pumpkin.Chunk2],
        [ItemsTexture.Frames.Pumpkin.Core2, ItemsTexture.Frames.Pumpkin.Chunk3],
        [ItemsTexture.Frames.Pumpkin.Core3, ItemsTexture.Frames.Pumpkin.Chunk2],
        [ItemsTexture.Frames.Pumpkin.Core3, ItemsTexture.Frames.Pumpkin.Chunk3],
        [ItemsTexture.Frames.Pumpkin.Core4, ItemsTexture.Frames.Pumpkin.Chunk4],
        [ItemsTexture.Frames.Pumpkin.Core4, ItemsTexture.Frames.Pumpkin.Chunk4]

    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, MegaPumpkin.pattern, MegaPumpkin.patternTextures)

        this.mainBody.setScale(2)
    }
}