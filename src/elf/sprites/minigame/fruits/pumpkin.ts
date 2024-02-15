import { SpriteUtil } from "../../../../shared/util";
import { ElfMinigameScene } from "../../../scenes";
import { SlashesTexture, FruitsTexture } from "../../../textures"
import { BaseFruit, FruitInfo } from "./fruit";

/**
 * The pumpkin in the elf minigame
 */
export class Pumpkin extends BaseFruit {
    private static pattern = [
        SpriteUtil.Direction.UP,
        SpriteUtil.Direction.DOWN,
        SpriteUtil.Direction.LEFT,
        SpriteUtil.Direction.RIGHT
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