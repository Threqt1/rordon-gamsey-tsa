export namespace KeyboardTexture {
    export const TextureKey = "keyboard"
    export const KeyPictures: { [key: string]: string } = {
        "W": TextureKey + "_14",
        "S": TextureKey + "_24",
        "A": TextureKey + "_23",
        "D": TextureKey + "_25"
    }

    export function preload(scene: Phaser.Scene) {
        scene.load.atlas(TextureKey, "/textures/keys.png", "/textures/keys.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}