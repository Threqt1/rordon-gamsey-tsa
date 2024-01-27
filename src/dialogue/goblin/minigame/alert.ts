import { Dialogue } from "../../"

enum Events {

}

let Base: Dialogue.Dialogue = {
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

export const GoblinMinigameAlertedDialogue = {
    Dialogue: Base,
    Events
}