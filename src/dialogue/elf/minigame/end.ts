import { Dialogue } from "../../"

export enum EndDialogueEventNames {
    END = "end"
}

export type EndDialogueEvents = {
    [EndDialogueEventNames.END]: [],
}

export class EndDialogueEmitter extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    override emit<K extends keyof EndDialogueEvents>(
        eventName: K,
        ...args: EndDialogueEvents[K]
    ): boolean {
        return super.emit(eventName, ...args)
    }

    override once<K extends keyof EndDialogueEvents>(
        eventName: K,
        listener: (...args: EndDialogueEvents[K]) => void
    ): this {
        return super.once(eventName, listener)
    }
}

let Base: Dialogue<EndDialogueEmitter> = {
    getOptionText() { return "" },
    getDialogueText() {
        return [
            "I-I've been beat...",
            "Mr. Chef, you've mastered the art of the knife.",
            "I have never seen this level of skil... it's one in a thousand.",
            "Take this - the heirloom of the elves.",
            "Grown in seclusion by the high elves themselves, it's the pinnacle of elf cultivation.",
            "Now go, Master Chef, and make something to appease Rordon Gamsey."
        ]
    },
    choose(_, emitter) {
        emitter.emit(EndDialogueEventNames.END)
    },
    next: []
}

export const EndDialogue = Base