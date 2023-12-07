import { ItemsTexture } from "../../../../textures/elf/minigame/items";
import { BaseFruit, FruitInformation, FruitInteraction } from "./fruit";

export class Apple extends BaseFruit {
    private static pattern = [FruitInteraction.SliceUp, FruitInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Frames.Apple.Base, ItemsTexture.Frames.Apple.Base],
        [ItemsTexture.Frames.Apple.Core1, ItemsTexture.Frames.Apple.Chunk1],
        [ItemsTexture.Frames.Apple.Core2, ItemsTexture.Frames.Apple.Chunk2]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, Apple.pattern, Apple.patternTextures)
    }
}