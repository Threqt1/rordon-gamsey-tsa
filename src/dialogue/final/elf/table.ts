import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
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

export const FinalElfTableDialogue = {
    Dialogue: Base,
    Events
}