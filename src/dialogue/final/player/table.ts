import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Player dialogue"
        ]
    },
    nextOptions: []
}

export const FinalPlayerTableDialogue = {
    Dialogue: Base,
    Events
}