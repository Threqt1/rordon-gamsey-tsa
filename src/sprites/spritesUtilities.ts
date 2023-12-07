export enum Zone {
    ENTERED,
    LEFT,
    NONE
}

export function checkIfInZone(zone: Phaser.GameObjects.Zone) {
    let body = zone.body as Phaser.Physics.Arcade.Body
    let touching = body.touching.none
    let wasTouching = body.wasTouching.none
    let embedded = body.embedded

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