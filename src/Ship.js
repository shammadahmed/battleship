module.exports = class Ship {
	hits = 0;
	coordinates = [];
	length = 1;
	orientation = false;

	constructor (...coordinates) {
		let allCoorsAreAdjacent = coordinates.every((c, i) => i === 0 || coordinates[i - 1] + 1 === c || coordinates[i - 1] + 10 === c || coordinates[i - 1] - 10 === c);

		if (!allCoorsAreAdjacent) throw Error("The coordinates are not adjacent");

		coordinates.forEach(coor => {
			if (coor < 0 || coor > 100) throw Error("This coordinate is off the board");
			this.coordinates.push(coor);
		});

		if (this.coordinates.length === 0) throw Error("No Coordinates provided for the ship");
		if (this.coordinates.length > 4) throw Error("Ships can only cover at most 4 cells on the board");

		this.coordinates = this.coordinates.sort((a, b) => a - b);

		this.length = this.coordinates.length;

		if (this.length > 1) {
			 this.orientation = this.coordinates[1] - this.coordinates[0];
		}

	}

	hit () {
		this.hits++;
	}

	hitCount () {
		return this.hits;
	}

	isSunk () {
		return (this.hits === this.length) ? true : false;
	}

	getLength () {
		return this.length;
	}

	getCoors () {
		return this.coordinates.sort();
	}

	getOrientation () {
		return this.orientation;
	}
}