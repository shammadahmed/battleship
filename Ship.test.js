const Ship = require("./src/Ship.js");
const Gameboard = require("./src/Gameboard.js");
const Player = require("./src/Player.js");
const Game = require("./src/Game.js");
const Battleship = require("./src/Battleship.js");

describe('Ship', () => {
	let someShip = new Ship(1, 2, 3);

	it('Ship hits count', () => {
		someShip.hit()
		expect(someShip.hitCount()).toBe(1);
	});

	it('Ship isSunk', () => {
		someShip.hit();
		someShip.hit();
		expect(someShip.isSunk()).toBe(true);
	});

	it('Place ship off the board', () => {
		expect(() => new Ship(101)).toThrow(Error);
	});

	it('Place ship with non-adjacent coordinates', () => {
		expect(() => new Ship(1, 3)).toThrow(Error);
	});

	it('Place ship that covers no cells', () => {
		expect(() => new Ship()).toThrow(Error);
	});

	it('Place ship that covers more than more 4 cells on the board', () => {
		expect(() => new Ship(1, 2, 3, 4, 5)).toThrow(Error);
	});
});

describe('Gameboard', () => {
	describe('Placing ships on the board', () => {
		it('Place ship at specific coordinates', () => {
			let shipAtCoors = new Ship(1);

			let gameboard = new Gameboard;

			gameboard.add(shipAtCoors);

			expect(gameboard.ships[gameboard.ships.length - 1]).toBe(shipAtCoors);
		});

		it('Cannot add more than 4 1-cell ships to the board', () => {
			let ship1 = new Ship(1);
			let ship2 = new Ship(3);
			let ship3 = new Ship(5);
			let ship4 = new Ship(7);
			let ship5 = new Ship(9);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			gameboard.add(ship2);
			gameboard.add(ship3);
			gameboard.add(ship4);
			expect(() => gameboard.add(ship5)).toThrow(Error);
		});

		it('Cannot add more than 3 2-cells ships to the board', () => {
			let ship1 = new Ship(1, 2);
			let ship2 = new Ship(4, 5);
			let ship3 = new Ship(7, 8);
			let ship4 = new Ship(33, 34);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			gameboard.add(ship2);
			gameboard.add(ship3);
			expect(() => gameboard.add(ship4)).toThrow(Error);
		});

		it('Cannot add more than 2 3-cells ships to the board', () => {
			let ship1 = new Ship(1, 2, 3);
			let ship2 = new Ship(5, 6, 7);
			let ship3 = new Ship(44, 45, 46);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			gameboard.add(ship2);
			expect(() => gameboard.add(ship3)).toThrow(Error);
		});

		it('Cannot add more than 1 4-cells ships to the board', () => {
			let ship1 = new Ship(1, 2, 3, 4);
			let ship2 = new Ship(55, 56, 57, 58);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			expect(() => gameboard.add(ship2)).toThrow(Error);
		});

		it('Cannot add ships with the same coordinates to the same board', () => {
			let ship1 = new Ship(1);
			let ship2 = new Ship(1);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			expect(() => gameboard.add(ship2)).toThrow(Error);
		});

		it('Cannot add ships with the overlapping coordinates to the same board', () => {
			let ship1 = new Ship(1, 2);
			let ship2 = new Ship(2, 3);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			expect(() => gameboard.add(ship2)).toThrow(Error);
		});

		it('Cannot add ships adjacently', () => {
			let ship1 = new Ship(1);
			let ship2 = new Ship(2);

			let gameboard = new Gameboard;

			gameboard.add(ship1);
			expect(() => gameboard.add(ship2)).toThrow(Error);
		});
	});



	describe('Recieve attack from opponent', () => {
		let board = new Gameboard();
		let ship = new Ship(1)

		board.add(ship);
		board.attack(1);

		it('records hit correctly', () => {
			expect(board.getHits()).toContain(1);
		});

		it('records missed attack', () => {
			let gameboard = new Gameboard();
			gameboard.attack(11);
			expect(gameboard.getMissedAttacks()).toContain(11);
		});
	});

	describe('Are all ships sunk?', () => {
		it('Ships are indeed sunk', () => {
			let gameboard = new Gameboard();

			gameboard.add(new Ship(1));
			gameboard.add(new Ship(3));
			gameboard.add(new Ship(5));
			gameboard.add(new Ship(7));
			gameboard.add(new Ship(22, 23));
			gameboard.add(new Ship(25, 26));
			gameboard.add(new Ship(28, 29));
			gameboard.add(new Ship(45, 46, 47));
			gameboard.add(new Ship(65, 66, 67));
			gameboard.add(new Ship(91, 92, 93, 94));

			gameboard.attack(1);
			gameboard.attack(3);
			gameboard.attack(5);
			gameboard.attack(7);
			gameboard.attack(22);
			gameboard.attack(23);
			gameboard.attack(25);
			gameboard.attack(26);
			gameboard.attack(28);
			gameboard.attack(29);
			gameboard.attack(45);
			gameboard.attack(46);
			gameboard.attack(47);
			gameboard.attack(65);
			gameboard.attack(66);
			gameboard.attack(67);
			gameboard.attack(91);
			gameboard.attack(92);
			gameboard.attack(93);
			gameboard.attack(94);

			expect(gameboard.areAllShipsSunk()).toBe(true);
		})

		it('Ships are not sunk yet', () => {
			let gameboard = new Gameboard();

			gameboard.add(new Ship(1));
			gameboard.add(new Ship(3));
			gameboard.add(new Ship(5));
			gameboard.add(new Ship(7));
			gameboard.add(new Ship(22, 23));
			gameboard.add(new Ship(25, 26));
			gameboard.add(new Ship(28, 29));
			gameboard.add(new Ship(45, 46, 47));
			gameboard.add(new Ship(65, 66, 67));
			gameboard.add(new Ship(91, 92, 93, 94));

			gameboard.attack(1);
			gameboard.attack(3);
			gameboard.attack(5);
			gameboard.attack(7);
			gameboard.attack(22);
			gameboard.attack(23);
			gameboard.attack(25);
			gameboard.attack(26);
			gameboard.attack(28);
			gameboard.attack(29);
			gameboard.attack(45);
			gameboard.attack(46);
			gameboard.attack(47);
			gameboard.attack(65);
			gameboard.attack(66);
			gameboard.attack(67);
			gameboard.attack(91);
			gameboard.attack(92);
			gameboard.attack(93);
			gameboard.attack(95);


			expect(gameboard.areAllShipsSunk()).toBe(false);
		})
	});
});

describe('Player', () => {
	let computer = new Player('bot', new Gameboard());
	let player = new Player('human', new Gameboard());

	it('Player has a gameboard', () => {
		expect(player.getBoard()).toBeInstanceOf(Gameboard);
	})

	it('there are two types of players', () => {
		expect(computer.getType()).toBe('bot');
		expect(player.getType()).toBe('human');
	})
});

describe('Game', () => {
	let game = new Game('computer', 'human');
	let player = game.getFirstPlayer();
	let computer = game.getSecondPlayer();

	it('Can generate randoms ships for a board', () => {
		let randomShips = Battleship.generateRandomShips();

		expect(randomShips.length).toBe(10);

		expect(randomShips.filter(ship => ship.getLength() === 4).length).toBe(1);
		expect(randomShips.filter(ship => ship.getLength() === 3).length).toBe(2);
		expect(randomShips.filter(ship => ship.getLength() === 2).length).toBe(3);
		expect(randomShips.filter(ship => ship.getLength() === 1).length).toBe(4);
	});
	
	computer.getBoard().addAllShips(Battleship.generateRandomShips());
	player.getBoard().addAllShips(Battleship.generateRandomShips());

	it('Can fill gameboards with random ships', () => {
		computer.getBoard().getShips().every(ship => expect(ship).toBeInstanceOf(Ship));
		player.getBoard().getShips().every(ship => expect(ship).toBeInstanceOf(Ship));

		expect(computer.getBoard().getShips().filter(ship => ship.length === 4).length).toBe(1);
		expect(computer.getBoard().getShips().filter(ship => ship.length === 3).length).toBe(2);
		expect(computer.getBoard().getShips().filter(ship => ship.length === 2).length).toBe(3);
		expect(computer.getBoard().getShips().filter(ship => ship.length === 1).length).toBe(4);

		expect(player.getBoard().getShips().filter(ship => ship.length === 4).length).toBe(1);
		expect(player.getBoard().getShips().filter(ship => ship.length === 3).length).toBe(2);
		expect(player.getBoard().getShips().filter(ship => ship.length === 2).length).toBe(3);
		expect(player.getBoard().getShips().filter(ship => ship.length === 1).length).toBe(4);
	});

	it('Returns 0 on strike on an already struck upon cell', () => {
		let game = new Game('human');
		game.getFirstPlayer().getBoard().addAllShips(Battleship.generateRandomShips());
		game.getSecondPlayer().getBoard().addAllShips(Battleship.generateRandomShips());

		game.strike(25);
		game.strike(26);
		game.strike(27)


		expect(game.strike(25)).toBe(0);
	});

});

describe('Battleship', () => {
	it('Can tell avalaible coordinates while adding ships', () => {
		let arr = Array(100).fill().map((_, i) => i + 1);

		arr.splice(arr.indexOf(1), 1);
		arr.splice(arr.indexOf(2), 1);
		arr.splice(arr.indexOf(11), 1);
		arr.splice(arr.indexOf(12), 1);

		expect(Battleship.getAvailablePos([1])).toEqual(arr);

		expect(Battleship.getAvailablePos([1,2,3,4,6,7,8,21,22,23,25,26,28,29,41,42,44,46,48]))
			.toEqual([
				10, 50, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
				78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
			]);

		let arr2 = Array(100).fill().map((_, i) => i + 1);

		arr2.splice(arr2.indexOf(24), 1);
		arr2.splice(arr2.indexOf(25), 1);
		arr2.splice(arr2.indexOf(26), 1);
		arr2.splice(arr2.indexOf(27), 1);

		arr2.splice(arr2.indexOf(13), 1);
		arr2.splice(arr2.indexOf(14), 1);
		arr2.splice(arr2.indexOf(15), 1);
		arr2.splice(arr2.indexOf(16), 1);
		arr2.splice(arr2.indexOf(17), 1);
		arr2.splice(arr2.indexOf(18), 1);
		
		arr2.splice(arr2.indexOf(23), 1);
		arr2.splice(arr2.indexOf(28), 1);

		arr2.splice(arr2.indexOf(33), 1);
		arr2.splice(arr2.indexOf(34), 1);
		arr2.splice(arr2.indexOf(35), 1);
		arr2.splice(arr2.indexOf(36), 1);
		arr2.splice(arr2.indexOf(37), 1);
		arr2.splice(arr2.indexOf(38), 1);


		expect(Battleship.getAvailablePos([24, 25, 26, 27])).toEqual(arr2);
	});

	it('Can tell frozen positions for a block', () => {
		expect(Battleship.getFrozenPos([8, 9])).toEqual(expect.arrayContaining([7, 10, 17, 18, 19, 20]));
		expect(Battleship.getFrozenPos([8, 9]).length).toBe(6);

		expect(Battleship.getFrozenPos([46])).toEqual(expect.arrayContaining([45, 47, 35, 36, 37, 55, 56, 56]));
		expect(Battleship.getFrozenPos([46]).length).toBe(8);

		expect(Battleship.getFrozenPos([23, 24, 25, 26])).toEqual(expect.arrayContaining([12, 13, 14, 15, 16, 17, 22, 27, 32, 33, 34, 35, 36, 37]));
		expect(Battleship.getFrozenPos([23,24, 25, 26]).length).toBe(14);


	});

	it('Can a block be placed on a certain cell', () => {
		expect(Battleship.canBePlacedOn('vertical', 4, 61)).toEqual(true);
		expect(Battleship.canBePlacedOn('vertical', 4, 71)).toEqual(false);
		expect(Battleship.canBePlacedOn('vertical', 1, 100)).toEqual(true);
		expect(Battleship.canBePlacedOn('horizontal', 2, 10)).toEqual(false);
		expect(Battleship.canBePlacedOn('horizontal', 4, 20)).toEqual(false);
	});

	it('Return diagnoal postions for an array of cells', () => {
		expect(Battleship.getDiagonalPos([15, 100, 20])).toEqual(expect.arrayContaining([89, 4, 6, 24, 26, 9, 29]));
		expect(Battleship.getDiagonalPos([15, 100, 20]).length).toBe(7);

	});
});