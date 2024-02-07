import { SlashesTexture, FruitsTexture } from "../../../../textures/elf";
import { BaseFruit, FruitInfo, FruitInteraction } from "./fruit";
import { ElfMinigameScene } from "../../../../scenes/elf";

/**
 * The pumpkin in the elf minigame
 */
export class Pumpkin extends BaseFruit {
    private static pattern = [
        FruitInteraction.SliceUp,
        FruitInteraction.SliceDown,
        FruitInteraction.SliceLeft,
        FruitInteraction.SliceRight
    ]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Pumpkin.Base, FruitsTexture.Frames.Pumpkin.Base],
        [FruitsTexture.Frames.Pumpkin.Core1, FruitsTexture.Frames.Pumpkin.Chunk1],
        [FruitsTexture.Frames.Pumpkin.Core2, FruitsTexture.Frames.Pumpkin.Chunk2],
        [FruitsTexture.Frames.Pumpkin.Core3, FruitsTexture.Frames.Pumpkin.Chunk3],
        [FruitsTexture.Frames.Pumpkin.Core4, FruitsTexture.Frames.Pumpkin.Chunk4]
    ]
    private static slashes: string[] = [
        SlashesTexture.Animations.SideCurved,
        SlashesTexture.Animations.Vertical,
        SlashesTexture.Animations.Diagonal,
        SlashesTexture.Animations.SideStraight,
    ]

    constructor(scene: ElfMinigameScene, x: number, y: number, info: FruitInfo) {
        super(scene, x, y, info, Pumpkin.pattern, Pumpkin.patternTextures, Pumpkin.slashes)
    }
}