import { SlashesTexture, FruitsTexture } from "../../../../textures/elf";
import { BaseFruit, FruitInformation, FruitInteraction } from "../../";
import { ElfMinigameScene } from "../../../../scenes/elf";

/**
 * An apple fruit
 */
export class Apple extends BaseFruit {
    private static pattern = [FruitInteraction.SliceUp, FruitInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Apple.Base, FruitsTexture.Frames.Apple.Base],
        [FruitsTexture.Frames.Apple.Core1, FruitsTexture.Frames.Apple.Chunk1],
        [FruitsTexture.Frames.Apple.Core2, FruitsTexture.Frames.Apple.Chunk2]
    ]
    private static slashes: string[] = [
        SlashesTexture.Animations.Diagonal,
        SlashesTexture.Animations.SideCurved,
    ]

    constructor(scene: ElfMinigameScene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, Apple.pattern, Apple.patternTextures, Apple.slashes)
    }
}