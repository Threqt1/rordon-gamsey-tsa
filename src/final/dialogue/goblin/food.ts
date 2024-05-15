import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "RORDON GAMSEY" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "*munch munch*",
            "BLEEEEGHHH!",
            "So much... meat!",
            "Brutish goblins, you do not understand what a varied palette is!",
            "Outta my sight!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base