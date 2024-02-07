import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Would you look at that!",
            "I see Ervin has trained quite the impressive pupil.",
            "Very well, I am a lady of my word.",
            "Here, your reward.",
            "*Pumpkin Obtained!*"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "Yippee!" },
    getContentText() {
        return [
            "While your end goal seems futile, I have high hopes for you.",
            "But I must ask, do you not fear you'll befall the same fate as those before you?"
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "Nah, I'll cook." },
    getContentText() {
        return [
            "...",
            "What?"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]
Option1.nextOptions = [Option2]

export const Dialogue = Base