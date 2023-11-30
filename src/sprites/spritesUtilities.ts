export enum Zone {
    ENTERED,
    LEFT,
    NONE
}

export function checkIfInZone(zone: Phaser.GameObjects.Zone) {
    let touching = (zone.body as Phaser.Physics.Arcade.Body).touching.none
    let wasTouching = (zone.body as Phaser.Physics.Arcade.Body).wasTouching.none
    let embedded = (zone.body as Phaser.Physics.Arcade.Body).embedded

    if (touching && !wasTouching) {
        if (embedded) {
            return Zone.ENTERED
        } else {
            return Zone.LEFT
        }
    }
    else if (!touching && wasTouching) {
        return Zone.ENTERED
    }

    return Zone.NONE
}