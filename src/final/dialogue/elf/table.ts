import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Lord Gamsey, accept our dish.",
            "We call it \"Xuiye's Salad\". It's made with the finest pickings from our latest harvest.",
            "Enjoy!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base