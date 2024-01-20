import { Dialogue } from "../../"

enum Events {

}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Wait... where did the treasure go?!",
            "Thief! Theres a thief! Find him!"
        ]
    },
    nextOptions: []
}

export const GoblinMinigameEndDialogue = {
    Dialogue: Base,
    Events
}