export type Keybinds = {
    [key: number]: keyof typeof Phaser.Input.Keyboard.KeyCodes
}

export class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    }
}

export class BaseInput {
    keyMap: { [key: string]: Phaser.Input.Keyboard.Key }
    keybinds: Keybinds

    constructor(scene: Phaser.Scene, keybinds: Keybinds) {
        this.keyMap = {}
        this.keybinds = keybinds

        for (let keyBind of Object.values(this.keybinds)) {
            this.keyMap[keyBind] = scene.input.keyboard!.addKey(keyBind)
        }
    }

    getKeyFor(interaction: number) {
        return this.keyMap[this.keybinds[interaction]]
    }

    checkDown(input: Phaser.Input.Keyboard.KeyboardPlugin, interaction: number) {
        return input.checkDown(this.getKeyFor(interaction))
    }
}