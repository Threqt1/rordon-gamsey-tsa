import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Lord Gamsey, accept our dish.",
            "We call it \"Xuiye's Salad\".",
            "Enjoy."
        ]
    },
    nextOptions: []
}

export const FinalElfTableDialogue = {
    Dialogue: Base,
    Events
}