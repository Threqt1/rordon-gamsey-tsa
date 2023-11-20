export namespace ItemsTexture {
    export const TextureKey = "item"
    export const Items = {
        Pumpkin: "Pumpkin",
        Apple: "Apple"
    }

    export function preload(scene: Phaser.Scene) {
        scene.load.atlas(TextureKey, "/textures/items.png", "/textures/items.json")
    }

    export function load(scene: Phaser.Scene) {
    }
}