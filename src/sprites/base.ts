import { Dialogue, DialogueSprite, DialogueWalker, DialogueWalkerStatus } from "../dialogue"
import { Controllable } from "../plugins"

type Keybinds = {
    [key: number]: keyof typeof Phaser.Input.Keyboard.KeyCodes
}

class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame)

        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    }
}

class BaseInput {
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

enum DialogueInteractions {
    OPTION_1,
    OPTION_2,
    OPTION_3,
    SUBMIT
}

const DialogueOptionKeybinds: Keybinds = {
    [DialogueInteractions.OPTION_1]: "ONE",
    [DialogueInteractions.OPTION_2]: "TWO",
    [DialogueInteractions.OPTION_3]: "THREE",
    [DialogueInteractions.SUBMIT]: "E"

}

export class BaseDialogue implements Controllable {
    scene: Phaser.Scene
    dialogueSprite: DialogueSprite
    input: BaseInput
    dialogueWalker!: DialogueWalker
    emitter: Phaser.Events.EventEmitter
    controllable: boolean

    constructor(scene: Phaser.Scene, width: number, height: number) {
        this.scene = scene
        this.dialogueSprite = new DialogueSprite(scene, width, height)
        this.dialogueSprite.setVisible(false)
        this.emitter = new Phaser.Events.EventEmitter()
        this.input = new BaseInput(scene, DialogueOptionKeybinds)
        this.controllable = false

        scene.sprites.addGUIControllables(this)
    }

    display() {
        if (this.dialogueWalker.status === DialogueWalkerStatus.DIALOGUE) {
            this.dialogueSprite.setText(this.dialogueWalker.getCurrentText())
        } else if (this.dialogueWalker.status === DialogueWalkerStatus.OPTIONS) {
            this.dialogueSprite.setText(this.dialogueWalker.getCurrentOptions().map((r, i) => `(${i + 1}) ${r.getOptionText(this.dialogueWalker.registry)}`).join("\n"))
        }
    }

    processDialogue() {
        if (this.input.checkIfKeyDown(DialogueInteractions.SUBMIT)) {
            this.input.input.resetKeys()
            this.dialogueWalker.progressDialogue()
            this.display()
        }
    }

    processOptions() {
        if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_1)) {
            this.dialogueWalker.chooseOption(0)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_2)) {
            this.dialogueWalker.chooseOption(1)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_3)) {
            this.dialogueWalker.chooseOption(2)
        } else {
            return
        }
        this.input.input.resetKeys()
        this.display()
    }

    stop() {
        this.controllable = false
        this.dialogueSprite.setVisible(false)
        this.scene.sprites.setGameControllable(true)
    }

    start(dialogue: Dialogue) {
        if (this.controllable) return
        this.dialogueWalker = new DialogueWalker(this.emitter, dialogue, this.scene.registry)
        this.dialogueWalker.reset()
        this.controllable = true
        this.dialogueSprite.setVisible(true)
        this.scene.sprites.setGameControllable(false)
        this.display()
    }

    setControllable(controllable: boolean): void {
        this.controllable = controllable
    }

    control() {
        if (!this.controllable) return
        switch (this.dialogueWalker.status) {
            case DialogueWalkerStatus.DIALOGUE:
                this.processDialogue()
                break;
            case DialogueWalkerStatus.OPTIONS:
                this.processOptions()
                break;
            case DialogueWalkerStatus.FINISHED:
                this.stop()
                break;
        }
    }
}

export { BaseSprite, BaseInput }
export type { Keybinds }
