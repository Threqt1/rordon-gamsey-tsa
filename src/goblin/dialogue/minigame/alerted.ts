import { DialogueSystem } from "../../../shared/systems"

export enum Events {

}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "HEY! SOMEONE STOLE THE APPLE!",
            "THEY STOLE MY SAUSAGES TOO!!!",
            "FIND THEM!!!"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base