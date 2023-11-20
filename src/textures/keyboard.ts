export namespace KeyboardTexture {
    export const TextureKey = "keyboard"
    export const KeyPictures: { [key: number]: string } = {
        [Phaser.Input.Keyboard.KeyCodes.W]: TextureKey + "_14",
        [Phaser.Input.Keyboard.KeyCodes.S]: TextureKey + "_24"
    }

    export function preload(scene: Phaser.Scene) {
        scene.load.atlas(TextureKey, "/textures/keys.png", "/textures/keys.json")
    }

    export function load(scene: Phaser.Scene) {
    }
}