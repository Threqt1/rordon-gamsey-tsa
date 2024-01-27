import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Elf dialogue"
        ]
    },
    nextOptions: []
}

export const FinalElfTableDialogue = {
    Dialogue: Base,
    Events
}