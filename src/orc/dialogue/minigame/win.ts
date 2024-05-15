import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "Whew... we got past rush hour",
            "Wonderful performance, young chef",
            "You are deserving of my holy treasure - THE SAUCE"
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getName(_) { return "ORC HEAD CHEF" },
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