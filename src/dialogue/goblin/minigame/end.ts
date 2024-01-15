import { Dialogue } from "../../"

enum Events {
    END = "end"
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Hey, you! What are you doing here!",
            "You're coming with us..."
        ]
    },
    dialogueFinished(_, emitter) {
        emitter.emit(Events.END)
    },
    nextOptions: []
}

export const GoblinMinigameEndDialogue = {
    Dialogue: Base,
    Events
}