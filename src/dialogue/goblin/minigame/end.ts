import { Dialogue } from "../../"

export enum Events {
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

export default {
    Dialogue: Base,
    Events
}