export namespace ItemsTexture {
    export const TextureKey = "items"
    export const Frames = {
        Pumpkin: "Pumpkin",
        Apple: "Apple"
    }

    export function preload(scene: Phaser.Scene) {
        scene.load.atlas(TextureKey, "/textures/items.png", "/textures/items.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}