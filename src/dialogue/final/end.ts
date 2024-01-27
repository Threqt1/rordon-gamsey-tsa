import { Dialogue } from ".."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "In the end, the player's food caused the great Rordon Gamsey to fall",
            "Peace was once again restored to the world.",
            "From heaven, or wherever Ervin was, he looked on in...",
            "Pride? Something like that."
        ]
    },
    nextOptions: []
}

export const FinalEndDialogue = {
    Dialogue: Base,
    Events
}