import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Gamsey! I have made the ultimate dish!",
            "This is sure to satisfy you!",
            "I call it \"Elysian\", made with ingredients from all across the world!"
        ]
    },
    nextOptions: []
}

export const FinalPlayerTableDialogue = {
    Dialogue: Base,
    Events
}