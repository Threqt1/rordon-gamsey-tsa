import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "...",
            "Are you serious?",
            "*sigh*",
            "*munch munch*",
            "BLEEEEGH!!",
            "DEAR LORD, SO MUCH GLASS!!!",
            "O-OUTTA MY SIGHHHT!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base