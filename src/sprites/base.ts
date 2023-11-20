import { Keybinds } from "../extensions";

export class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    }
}

export abstract class BaseSpriteWithInput extends BaseSprite {
    protected _keyCodeKeyBindings: { [key: number]: Phaser.Input.Keyboard.Key }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this._keyCodeKeyBindings = {}

        for (let keyBind of Object.values(this.getKeybinds())) {
            this._keyCodeKeyBindings[keyBind] = scene.input.keyboard!.addKey(keyBind)
        }
    }

    protected checkDown(input: Phaser.Input.Keyboard.KeyboardPlugin, keybind: number) {
        return input.checkDown(this._keyCodeKeyBindings[keybind])
    }

    protected abstract getKeybinds(): Keybinds
}

export type BaseTextures = {
    TextureKey: string
    Animations: {
        [key: string]: string
    }
    makeAnimations: (anims: Phaser.Animations.AnimationManager) => void
}