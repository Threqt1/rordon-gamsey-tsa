import { DialogueSystem } from "../../../game/systems"

export enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "*munch munch*",
            "W-what is this..!!",
            "Such a variety of flavors...",
            "I can taste some from every tribe, and they complement each other so well...",
            "I want more... I MUST HAVE MORE!!",
            "W-wait.., I'm feelin' a bit sleepy-",
            "Zzzz.., *snore*"
        ]
    },
    nextOptions: []
}

export const Dialogue = Base