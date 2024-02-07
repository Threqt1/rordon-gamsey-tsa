import { DialogueSystem } from "../../../shared/systems"

export enum Events {

}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "NO! You can't steal that! We stole it first!",
            "Aargh Darn! Now what am I gonna wipe with!",
            "*Apple and Sausages Obtained*"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base