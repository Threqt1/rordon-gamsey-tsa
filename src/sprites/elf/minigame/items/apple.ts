import { ItemsTexture } from "../../../../textures/elf/minigame/items";
import { BaseFruit, FruitInformation, FruitInteraction } from "./base";

export class Apple extends BaseFruit {
    private static pattern = [FruitInteraction.SliceUp, FruitInteraction.SliceDown]
    private static patternTextures: [string, string][] = [
        [ItemsTexture.Frames.Apple + "_1", ItemsTexture.Frames.Apple + "_1"],
        [ItemsTexture.Frames.Apple + "_3", ItemsTexture.Frames.Apple + "_2"],
        [ItemsTexture.Frames.Apple + "_5", ItemsTexture.Frames.Apple + "_4"]
    ]

    constructor(scene: Phaser.Scene, x: number, y: number, info: FruitInformation) {
        super(scene, x, y, info, Apple.pattern, Apple.patternTextures)
    }
}