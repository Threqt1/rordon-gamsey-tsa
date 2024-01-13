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
            "Hey, you! What are you doing here!",
            "You're coming with us..."
        ]
    },
    choose(_, emitter) {
        emitter.emit(EndDialogueEventNames.END)
    },
    next: []
}

export const EndDialogue = Base