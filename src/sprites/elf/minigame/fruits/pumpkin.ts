import { SlashesTexture, FruitsTexture } from "../../../../textures/elf";
import { ElfMinigameBaseFruit, ElfMinigameFruitInformation, ElfMinigameFruitInteraction } from "./fruit";
import { ElfMinigameScene } from "../../../../scenes/elf";

/**
 * A pumpkin fruit
 */
export class ElfMinigamePumpkin extends ElfMinigameBaseFruit {
    private static pattern = [
        ElfMinigameFruitInteraction.SliceUp,
        ElfMinigameFruitInteraction.SliceDown,
        ElfMinigameFruitInteraction.SliceLeft,
        ElfMinigameFruitInteraction.SliceRight
    ]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Pumpkin.Base, FruitsTexture.Frames.Pumpkin.Base],
        [FruitsTexture.Frames.Pumpkin.Core1, FruitsTexture.Frames.Pumpkin.Chunk1],
        [FruitsTexture.Frames.Pumpkin.Core2, FruitsTexture.Frames.Pumpkin.Chunk2],
        [FruitsTexture.Frames.Pumpkin.Core3, FruitsTexture.Frames.Pumpkin.Chunk3],
        [FruitsTexture.Frames.Pumpkin.Core4, FruitsTexture.Frames.Pumpkin.Chunk4]
    ]
    private static slashes: string[] = [
        SlashesTexture.Animations.Diagonal,
        SlashesTexture.Animations.Vertical,
        SlashesTexture.Animations.SideCurved,
        SlashesTexture.Animations.SideStraight,
    ]

    constructor(scene: ElfMinigameScene, x: number, y: number, info: ElfMinigameFruitInformation) {
        super(scene, x, y, info, ElfMinigamePumpkin.pattern, ElfMinigamePumpkin.patternTextures, ElfMinigamePumpkin.slashes)
    }
}