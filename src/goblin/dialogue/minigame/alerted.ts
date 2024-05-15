import { DialogueSystem } from "../../../shared/systems"

export enum Events {

}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "GOBLINS" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "HEY! SOMEONE STOLE THE APPLE!",
            "THEY STOLE MY SAUSAGES TOO!!!",
            "FIND THEM!!!",
            "[ESCAPE THE CAVE BY RETRACING YOUR STEPS]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base