module.exports = class Gameboard {
	ships = [];
	missedAttacks = [];
	hitAttacks = [];

	constructor () {

	}

	add (ship) {
		if (this.ships.length === 10) {
			console.error('This board already has 10 ships');

			return;
		}

		if (this.shipExists(ship)) {
			this.ships = [];

			throw Error("There is already a ship on these coordinates.");
		} 

		ship.getCoors().forEach(coor => {
			if (this.coordinateTaken(coor)) {
				this.ships = [];

				throw Error("Coordinate already taken by another ship on the board");
			}
		});

		ship.getCoors().forEach(coor => {
			if (this.adjacentCoordinateTaken(coor)) {
				this.ships = [];

				throw Error("Cannot place a ship adjacently to another ship on the board");
			}
		});

		let l = ship.getLength();

		if ((this.ships.filter(s => s.getLength() === l)).length === this.maxNumOfShips(l)) {
			this.ships = [];

			throw(Error('Cannot add more than ' + this.maxNumOfShips(l) + " ships of size " + l + "."));
		}

		this.ships.push(ship);
	}

	addAllShips (ships) {
		for (let i = 0; i < ships.length; i++) {
			this.add(ships[i]);
		}
	}

	attack (c) {
		c = Number(c);

		if (this.hitAttacks.includes(c) || this.missedAttacks.includes(c)) return 0;

		let missed = true;

		this.ships.forEach(ship => {
			ship.getCoors().forEach(coor => {
				if (coor === c) {
					ship.hit()

					this.hitAttacks.push(c)

					missed = false;
				}
			})
		});


		if (missed) this.missedAttacks.push(c);

		return !missed;
	}

	areAllShipsSunk () {
		return this.ships.every(ship => ship.isSunk());
	}

	maxNumOfShips (shipSize) {
		switch (shipSize) {
			case 4: return 1;
			case 3: return 2;
			case 2: return 3;
			case 1: return 4; 
		}
	}

	shipExists(ship) {
		return this.ships.find(s => s.getCoors().sort().join(",") === ship.getCoors().sort().join(","));
	}

	coordinateTaken (coor) {
		return this.getOccupiedCells().includes(coor);
	}

	adjacentCoordinateTaken (coor) {
		if (String(coor)[String(coor).length - 1] === '0') {
			return (
				this.getOccupiedCells().includes(coor - 1)   ||
				this.getOccupiedCells().includes(coor + 10)  ||
				this.getOccupiedCells().includes(coor - 10)  ||
				this.getOccupiedCells().includes(coor + 9)   ||
				this.getOccupiedCells().includes(coor - 11) 
			);
		} else if (String(coor)[String(coor).length - 1] === '1') {
			return (
				this.getOccupiedCells().includes(coor + 1)   ||
				this.getOccupiedCells().includes(coor + 10)  ||
				this.getOccupiedCells().includes(coor - 10)  ||
				this.getOccupiedCells().includes(coor - 9)   ||
				this.getOccupiedCells().includes(coor + 11)
			);
		}

		return (
			this.getOccupiedCells().includes(coor + 1)   ||
			this.getOccupiedCells().includes(coor - 1)   ||
			this.getOccupiedCells().includes(coor + 10)  ||
			this.getOccupiedCells().includes(coor - 10)  ||
			this.getOccupiedCells().includes(coor + 9)   ||
			this.getOccupiedCells().includes(coor - 9)   ||
			this.getOccupiedCells().includes(coor + 11)  ||
			this.getOccupiedCells().includes(coor - 11) 
		);
	}

	getMissedAttacks () {
		return this.missedAttacks;
	}

	getHits() {
		return this.hitAttacks;
	}

	getShips () {
		return this.ships;
	}

	getSunkShips () {
		return this.ships.filter(ship => ship.isSunk());
	}

	getUnsunkShips () {
		return this.ships.filter(ship => !ship.isSunk());
	}

	getSunkShipsCoors () {
		let coors = [];

		this.getSunkShips().forEach(ship => coors = coors.concat(ship.getCoors()));

		return coors;
	}

	getUnsunkShipsCoors () {
		let coors = [];

		this.getUnsunkShips().forEach(ship => coors = coors.concat(ship.getCoors()));

		return coors;
	}

	getUnsunkHitShips () {
		const shipsAndHits = [];

		const ships = this.ships.filter(ship => ship.getLength() > 1 && ship.hitCount() > 0 && !ship.isSunk());

		ships.forEach(ship => {
			let shipAndHit = {
				ship: ship,
				hits: []
			};

			ship.getCoors().forEach(coor => {
				if (this.hitAttacks.includes(coor)) {
					shipAndHit.hits.push(coor);
				}
			});

			shipsAndHits.push(shipAndHit);
		});

		return shipsAndHits;
	}

	findShip (coor) {
		return this.ships.find(ship => ship.getCoors().includes(coor));
	}

	getOccupiedCells () {
		return this.ships.reduce((occupiedCells, ship) => occupiedCells.concat(ship.getCoors()), []);
	}

	getPlayedCells () {
		return this.getHits().concat(this.getMissedAttacks());
	}
}