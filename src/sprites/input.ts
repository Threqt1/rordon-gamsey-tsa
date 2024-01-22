export type Keybinds = {
    [key: number]: keyof typeof Phaser.Input.Keyboard.KeyCodes
}

export class BaseInput {
    scene: Phaser.Scene
    input: Phaser.Input.Keyboard.KeyboardPlugin
    keyMap: { [key: string]: Phaser.Input.Keyboard.Key }
    keybinds: Keybinds

    constructor(scene: Phaser.Scene, keybinds: Keybinds) {
        this.scene = scene
        this.input = this.scene.input.keyboard!
        this.keyMap = {}
        this.keybinds = keybinds

        this.registerNewKeybinds(keybinds)
    }

    registerNewKeybinds(keybinds: Keybinds) {
        for (let keyBind of Object.values(keybinds)) {
            this.keyMap[keyBind] = this.scene.input.keyboard!.addKey(keyBind)
        }
    }

    getKeyForInteraction(interaction: number) {
        return this.keyMap[this.keybinds[interaction]]
    }

    checkIfKeyDown(interaction: number) {
        let key = this.getKeyForInteraction(interaction)
        if (!key) return false
        if (key.isDown) {
            return true
        }
        return false
    }
}
