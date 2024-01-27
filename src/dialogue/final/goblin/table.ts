import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Goblin dialogue"
        ]
    },
    nextOptions: []
}

export const FinalGoblinTableDialogue = {
    Dialogue: Base,
    Events
}