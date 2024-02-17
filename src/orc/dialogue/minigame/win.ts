import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Whew... we got past rush hour",
            "Great job, young chef",
            "You are deserving of our holy treasure - THE SAUCE"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "Yippee!" },
    getContentText() {
        return [
            "*Sauce Obtained*"
        ]
    },
    nextOptions: []
}

Base.nextOptions = [Option1]

export const Dialogue = Base