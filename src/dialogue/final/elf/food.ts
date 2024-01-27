import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "This is the elf dialogue"
        ]
    },
    nextOptions: []
}

export const FinalElfFoodDialogue = {
    Dialogue: Base,
    Events
}