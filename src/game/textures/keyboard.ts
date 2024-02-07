let PRELOADED = false

export namespace KeyboardTexture {
    export const TextureKey = "keyboard"
    export const KeyPictures: { [key: string]: string } = {
        "W": "W",
        "S": "S",
        "A": "A",
        "D": "D",
        "E": "E"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/keys.png", "/textures/keys.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}