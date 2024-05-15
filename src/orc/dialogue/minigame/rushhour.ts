import { DialogueSystem } from "../../../shared/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "ORC LINE CHEF" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "HERE IT COMES... RUSH HOUR BABY!!!"
        ]
    },
    nextOptions: []
}

Base.nextOptions = []

export const Dialogue = Base