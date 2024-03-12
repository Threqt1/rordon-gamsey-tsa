import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Not even being able to pass this simple trial...",
            "Lay these foolish ambitions to rest!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = []

export const Dialogue = Base