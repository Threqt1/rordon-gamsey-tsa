import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "This is the player dialogue"
        ]
    },
    nextOptions: []
}

export const FinalPlayerFoodDialogue = {
    Dialogue: Base,
    Events
}