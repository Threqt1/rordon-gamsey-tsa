import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "Such masterful slices... such precision...",
            "Kid, you have potential.",
            "Take it - our Sacred Pumpkin and our Sacred Apple-",
            "What? Where'd it go...?",
            "Uhm. Talk to the elf that's by the path, I think she has the apple.",
            "I must take my leave."
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getName(_) { return "CARETAKER" },
    getOptionText() { return "Nah, I'll cook." },
    getContentText() {
        return [
            "...",
            "I'm leaving.",
            "[Sacred Pumpkin obtained!]"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]

export const Dialogue = Base