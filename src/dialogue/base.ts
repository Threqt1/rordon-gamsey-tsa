export type Dialogue<E extends Phaser.Events.EventEmitter> = {
    isAvaliable?: (registry: Phaser.Data.DataManager) => boolean
    getOptionText: (registry: Phaser.Data.DataManager) => string
    getDialogueText: (registry: Phaser.Data.DataManager) => string[]
    choose?: (registry: Phaser.Data.DataManager, eventEmitter: E) => void
    next: Dialogue<E>[]
}

export enum DialogueWalkerStatus {
    DIALOGUE,
    OPTIONS,
    FINISHED
}

export class DialogueWalker<E extends Phaser.Events.EventEmitter> {
    baseDialogue: Dialogue<E>
    currentDialogue!: Dialogue<E>
    currentDialoguePosition!: number
    currentDialogueText!: string[]
    currentOptions!: Dialogue<E>[]
    eventEmitter: E
    status: DialogueWalkerStatus
    registry: Phaser.Data.DataManager

    constructor(emitter: E, dialogue: Dialogue<E>, registry: Phaser.Data.DataManager) {
        this.baseDialogue = dialogue
        this.eventEmitter = emitter
        this.registry = registry
        this.status = DialogueWalkerStatus.DIALOGUE

        this.goToDialogue(dialogue)
    }

    getCurrentText() {
        return this.currentDialogueText[this.currentDialoguePosition]
    }

    getCurrentOptions() {
        return this.currentOptions
    }

    computeAvaliableOptions() {
        let availableOptions: Dialogue<E>[] = []

        for (let option of this.currentDialogue.next) {
            if (option.isAvaliable !== undefined && !option.isAvaliable(this.registry)) continue
            availableOptions.push(option)
        }

        return availableOptions
    }

    progressDialogue() {
        this.currentDialoguePosition++
        if (this.currentDialoguePosition >= this.currentDialogueText.length) {
            switch (this.currentOptions.length) {
                case 0:
                    this.status = DialogueWalkerStatus.FINISHED
                    break;
                case 1:
                    this.goToDialogue(this.currentOptions[0])
                    break;
                default:
                    this.status = DialogueWalkerStatus.OPTIONS
                    break;
            }
        }
    }

    goToDialogue(dialogue: Dialogue<E>) {
        this.currentDialogue = dialogue
        this.currentDialogueText = this.currentDialogue.getDialogueText(this.registry)
        this.currentDialoguePosition = 0
        this.currentOptions = this.computeAvaliableOptions();
        this.status = DialogueWalkerStatus.DIALOGUE
    }

    reset() {
        this.goToDialogue(this.baseDialogue)
    }

    chooseOption(index: number) {
        if (index >= this.currentOptions.length) return
        let selectedDialogue = this.currentDialogue.next[index]!
        if (selectedDialogue.choose != undefined) selectedDialogue.choose(this.registry, this.eventEmitter)
        this.goToDialogue(selectedDialogue)
    }
}