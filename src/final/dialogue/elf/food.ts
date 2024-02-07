import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "*munch munch*",
            "BLEGHHHHH!",
            "So many greens....",
            "Never puttin' meat with anything!",
            "Get outta my sight!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base