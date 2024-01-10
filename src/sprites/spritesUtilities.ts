export enum Zone {
    IN,
    OUT
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export function checkIfInZone(zone: Phaser.GameObjects.Zone) {
    let body = zone.body as Phaser.Physics.Arcade.Body
    let touching = !body.touching.none
    let wasTouching = !body.wasTouching.none
    let embedded = body.embedded

    if (touching && !wasTouching || touching && wasTouching || embedded) {
        return Zone.IN
    }

    return Zone.OUT
}
