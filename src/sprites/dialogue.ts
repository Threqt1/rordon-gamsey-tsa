import { Keybinds, BaseInput } from "."
import { DialogueSprite, Dialogue } from "../dialogue"
import { Controllable } from "../plugins"

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

/**
 * Handles communicating between player input and the internal dialogue walker
 */
export class BaseDialogue implements Controllable {
    activeScene!: Phaser.Scene
    dialogueSprite: DialogueSprite
    input: BaseInput
    dialogueWalker: Dialogue.Walker
    controllable: boolean
    endCallback?: (() => void)

    constructor(scene: Phaser.Scene, width: number, height: number) {
        this.dialogueSprite = new DialogueSprite(scene, width, height)
        this.dialogueSprite.setVisible(false)
        this.input = new BaseInput(scene, DialogueOptionKeybinds)
        this.dialogueWalker = new Dialogue.Walker(scene.registry)
        this.controllable = false

        scene.sprites.controllables.push(this)
    }

    /**
     * Start the dialogue on a specific dialogue block
     * @param scene The scene the function was called from
     * @param dialogue The dialogue to start
     * @param emitter THe emitter to emit events to
     * @param endCallback Function to run once dialogue is finished
     * @returns 
     */
    start(scene: Phaser.Scene, dialogue: Dialogue.Dialogue, emitter: Phaser.Events.EventEmitter, endCallback?: () => void): void {
        if (this.controllable) return
        this.activeScene = scene
        this.endCallback = endCallback

        this.dialogueWalker.startWithNewDialogue(dialogue, emitter)
        this.dialogueSprite.setVisible(true)
        this.activeScene.sprites.setControllable(false)
        this.input.input.resetKeys()
        this.controllable = true
        this.displayCurrentDialogue()
    }

    /**
     * Display the current dialogue based on the dialogue walker's state
     */
    displayCurrentDialogue(): void {
        if (this.dialogueWalker.state === Dialogue.WalkerState.CONTENT) {
            this.dialogueSprite.setText(this.dialogueWalker.getCurrentContent())
        } else if (this.dialogueWalker.state === Dialogue.WalkerState.OPTIONS) {
            let dialogueOptionsText = this.dialogueWalker.currentOptions
                //Format text properly
                .map((option, index) => `(${index + 1}) ${option.getOptionText(this.dialogueWalker.registry)}`)
                .join("\n")
            this.dialogueSprite.setText(dialogueOptionsText)
        }
    }

    /**
     * Handle input while the state is on content
     */
    handleContentInput(): void {
        if (this.input.checkIfKeyDown(DialogueInteractions.SUBMIT)) {
            this.input.input.resetKeys()
            this.dialogueWalker.progressContent()
            this.displayCurrentDialogue()
        }
    }

    /**
     * Handle input while the state is on options
     */
    handleOptionsInput(): void {
        this.input.input.resetKeys()
        if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_1)) {
            this.dialogueWalker.chooseOption(0)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_2)) {
            this.dialogueWalker.chooseOption(1)
        } else if (this.input.checkIfKeyDown(DialogueInteractions.OPTION_3)) {
            this.dialogueWalker.chooseOption(2)
        } else {
            // If no valid key was chosen, exit
            return
        }
        this.displayCurrentDialogue()
    }

    /**
     * Handle input
     */
    control(): void {
        if (!this.controllable) return
        switch (this.dialogueWalker.state) {
            case Dialogue.WalkerState.CONTENT:
                this.handleContentInput()
                break;
            case Dialogue.WalkerState.OPTIONS:
                this.handleOptionsInput()
                break;
            case Dialogue.WalkerState.FINISHED:
                if (this.endCallback !== undefined) this.endCallback()
                this.stop()
                break;
        }
        this.input.input.resetKeys()
    }

    /**
     * Stop the dialogue
     */
    stop(): void {
        this.controllable = false
        this.dialogueSprite.setVisible(false)
        this.activeScene.sprites.setControllable(true)
    }

    setControllable(controllable: boolean): void {
        this.controllable = controllable
    }
}
