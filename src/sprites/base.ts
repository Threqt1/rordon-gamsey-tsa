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

export abstract class BaseSpriteWithInput extends BaseSprite {
    protected _keyCodeKeyBindings: { [key: string]: Phaser.Input.Keyboard.Key }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this._keyCodeKeyBindings = {}

        for (let keyBind of Object.values(this.getKeybinds())) {
            let foundKey = scene.input.keyboard!.keys.find(r => r.keyCode === Phaser.Input.Keyboard.KeyCodes[keyBind])
            if (foundKey) {
                this._keyCodeKeyBindings[keyBind] = foundKey
            } else {
                this._keyCodeKeyBindings[keyBind] = scene.input.keyboard!.addKey(keyBind)
            }
        }
    }

    protected getKeyFor(interaction: number) {
        return this._keyCodeKeyBindings[this.getKeybinds()[interaction]]
    }

    protected checkDown(input: Phaser.Input.Keyboard.KeyboardPlugin, interaction: number) {
        return input.checkDown(this.getKeyFor(interaction))
    }

    protected abstract getKeybinds(): Keybinds
}

export abstract class BaseInput {
    protected _keyCodeKeyBindings: { [key: string]: Phaser.Input.Keyboard.Key }

    constructor(scene: Phaser.Scene) {
        this._keyCodeKeyBindings = {}

        for (let keyBind of Object.values(this.getKeybinds())) {
            this._keyCodeKeyBindings[keyBind] = scene.input.keyboard!.addKey(keyBind)
        }
    }

    protected getKeyFor(interaction: number) {
        return this._keyCodeKeyBindings[this.getKeybinds()[interaction]]
    }

    protected checkDown(input: Phaser.Input.Keyboard.KeyboardPlugin, interaction: number) {
        return input.checkDown(this.getKeyFor(interaction))
    }

    protected abstract getKeybinds(): Keybinds
}