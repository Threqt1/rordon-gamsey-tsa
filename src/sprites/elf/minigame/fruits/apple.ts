import { FruitsTexture } from "../../../../textures/elf/minigame/fruits";
import { BaseFruit, FruitInformation, FruitInteraction } from "./fruit";

export class Apple extends BaseFruit {
    private static pattern = [FruitInteraction.SliceUp, FruitInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Apple.Base, FruitsTexture.Frames.Apple.Base],
        [FruitsTexture.Frames.Apple.Core1, FruitsTexture.Frames.Apple.Chunk1],
        [FruitsTexture.Frames.Apple.Core2, FruitsTexture.Frames.Apple.Chunk2]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, Apple.pattern, Apple.patternTextures)
    }
}