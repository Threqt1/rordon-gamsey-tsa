import { ItemsTexture } from "../../../textures/items";
import { BaseSprite } from "../../base";
import { MinigameItem } from "./base";

export class MinigameApple extends BaseSprite implements MinigameItem {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ItemsTexture.TextureKey, ItemsTexture.Items.Apple + "_1")

    }
}