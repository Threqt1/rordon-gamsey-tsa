import { SpriteUtil } from "../../../../shared/util";
import { ElfMinigameScene } from "../../../scenes";
import { SlashesTexture, FruitsTexture } from "../../../textures"
import { BaseFruit, FruitInfo } from "./fruit";

/**
 * The apple in the elf minigame
 */
export class Apple extends BaseFruit {
    private static pattern = [SpriteUtil.Direction.UP, SpriteUtil.Direction.DOWN]
    private static patternTextures: [string, string][] = [
        [FruitsTexture.Frames.Apple.Base, FruitsTexture.Frames.Apple.Base],
        [FruitsTexture.Frames.Apple.Core1, FruitsTexture.Frames.Apple.Chunk1],
        [FruitsTexture.Frames.Apple.Core2, FruitsTexture.Frames.Apple.Chunk2]
    ]
    private static slashes: string[] = [
        SlashesTexture.Animations.SideCurved,
        SlashesTexture.Animations.Vertical,
    ]

    constructor(scene: ElfMinigameScene, x: number, y: number, info: FruitInfo) {
        super(scene, x, y, info, Apple.pattern, Apple.patternTextures, Apple.slashes)
    }
}