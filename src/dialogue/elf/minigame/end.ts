import { Dialogue } from "../../"

export enum EndDialogueEventNames {
    END = "end"
}

export type EndDialogueEvents = {
    [EndDialogueEventNames.END]: [],
}

let Base: Dialogue = {
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