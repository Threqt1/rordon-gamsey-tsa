import { SlashesTexture, FruitsTexture } from "../../../../textures/elf";
import { ElfMinigameBaseFruit, ElfMinigameFruitInformation, ElfMinigameFruitInteraction } from "./fruit";
import { ElfMinigameScene } from "../../../../scenes/elf";

/**
 * An apple fruit
 */
export class ElfMinigameApple extends ElfMinigameBaseFruit {
    private static pattern = [ElfMinigameFruitInteraction.SliceUp, ElfMinigameFruitInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Apple.Base, FruitsTexture.Frames.Apple.Base],
        [FruitsTexture.Frames.Apple.Core1, FruitsTexture.Frames.Apple.Chunk1],
        [FruitsTexture.Frames.Apple.Core2, FruitsTexture.Frames.Apple.Chunk2]
    ]
    private static slashes: string[] = [
        SlashesTexture.Animations.Diagonal,
        SlashesTexture.Animations.SideCurved,
    ]

    constructor(scene: ElfMinigameScene, x: number, y: number, info: ElfMinigameFruitInformation) {
        super(scene, x, y, info, ElfMinigameApple.pattern, ElfMinigameApple.patternTextures, ElfMinigameApple.slashes)
    }
}