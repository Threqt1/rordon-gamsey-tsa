import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "In the end, the player's food caused the great Rordon Gamsey to fall... asleep?",
            "Peace was once again restored to the world!",
            "From heaven, or wherever Ervin was, he looked on in...",
            "Pride? Disappointment??",
            "Alas, the tribes rejoiced as Rordon Gamsey fell deeper into his slumber.",
            "The player, Ervin's prodigy, was hailed as the hero of Elysian!",
            "[THE END]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base
