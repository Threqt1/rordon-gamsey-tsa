import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "ESTEL" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "Talk to the Caretaker, near the bonfire.",
            "She will allow you to obtain some of our sacred Fruits."
        ]
    },
    nextOptions: []
}

export const Dialogue = Base