import { DialogueSystem } from "../../../shared/systems"

export enum Events {

}

let Base: DialogueSystem.Dialogue = {
    getName(_) { return "GOBLINS" },
    getOptionText() { return "" },
    getContentText() {
        return [
            "NO! YOU CAN'T STEAL THAT! WE STOLE IT FIRST!",
            "AARGH! WHAT AM I GOING TO WIPE WITH NOW?!",
            "[Sacred Apple AND Contraband Sausages obtained!]"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base