import { DialogueSystem } from "../../../game/systems"

enum Events {
}

let Base: DialogueSystem.Dialogue = {
    getOptionText() { return "" },
    getContentText() {
        return [
            "Hm?... I see, you must be Ervin's boy.",
            "Where are my manners, I am Estel.",
        ]
    },
    nextOptions: []
}

let Option1: DialogueSystem.Dialogue = {
    getOptionText() { return "You knew my father?" },
    getContentText() {
        return [
            "Regrettably so yes.",
            "He was quite the social butterfly but a little too preoccupied in his work to be any fun."
        ]
    },
    nextOptions: []
}

let Option2: DialogueSystem.Dialogue = {
    getOptionText() { return "Fun?" },
    getContentText() {
        return [
            "Everytime I tried to involve him in one of my many schemes he would turn me down instantly.",
            "He was always going on about recipes and concentration, such an ample man lost to his own dedication."
        ]
    },
    nextOptions: []
}

let Option3: DialogueSystem.Dialogue = {
    getOptionText() { return "I need your help, I want to take down Gamsey!" },
    getContentText() {
        return [
            "You… wish to overthrow Gamsey?",
            "Really. I understand everyone grieves in their own way but… a coup?",
            "To be frank I, alongside my people, see no reason in undertaking such an endeavor."
        ]
    },
    nextOptions: []
}

let Option4: DialogueSystem.Dialogue = {
    getOptionText() { return "Huh? Why not?" },
    getContentText() {
        return [
            "Why, things are fun as they are now, of course.",
            "Cause a child to fall face first in the dirt, produce a small spore that causes people's backs to itch,",
            "All without a consequence!",
            "What better life could we hope for?"
        ]
    },
    nextOptions: []
}

let Option5: DialogueSystem.Dialogue = {
    getOptionText() { return "Please, I'll give you anything!" },
    getContentText() {
        return [
            "Ugh… bribery, really?",
            "That won't work on us.",
            "Us elves are beyond the grasp of materialism. The forest is enough for us."
        ]
    },
    nextOptions: []
}

let Option6: DialogueSystem.Dialogue = {
    getOptionText() { return "Wait! My father said you owe him a favor!" },
    getContentText() {
        return [
            "Hm?",
            "I had hoped he'd leave that little detail out…",
            "Fine, I suppose it couldn't hurt too badly..."
        ]
    },
    nextOptions: []
}


Base.nextOptions = [Option1]
Option1.nextOptions = [Option2, Option3]
Option2.nextOptions = [Option3]
Option3.nextOptions = [Option4]
Option4.nextOptions = [Option5, Option6]
Option5.nextOptions = [Option6]
Option6.nextOptions = []

export const EstelInitial = {
    Dialogue: Base,
    Events
}