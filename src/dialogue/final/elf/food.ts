import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
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

export const FinalElfFoodDialogue = {
    Dialogue: Base,
    Events
}