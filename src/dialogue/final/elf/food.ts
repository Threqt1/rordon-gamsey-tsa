import { Dialogue } from "../.."

enum Events {
}

let Base: Dialogue.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "*munch munch*",
            "BLEGHHHHH!",
            "So many greens... these elves.",
            "Vegetarian as always.",
            "Get outta my sight!"
        ]
    },
    nextOptions: []
}

export const FinalElfFoodDialogue = {
    Dialogue: Base,
    Events
}