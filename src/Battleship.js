const Ship = require('./Ship.js');

const Battleship = (() => {
	const generateRandomShips = () => {
        let coors = [];
        let newItem;
        let allFourOnesAdded = 0;

        while (true) {
            newItem = getRndNumBwt1And100();

            if (coors.includes(newItem)) continue;
            if (!coors.every(coor => {
                return (
                    coor + 1  !== newItem  &&
                    coor - 1  !== newItem  &&
                    coor + 10 !== newItem  &&
                    coor - 10 !== newItem  &&
                    coor + 11 !== newItem  &&
                    coor - 11 !== newItem  &&
                    coor + 9  !== newItem  &&
                    coor - 9  !== newItem
                );

            })) { continue };

            coors.push(newItem);

            allFourOnesAdded++;

            if (allFourOnesAdded === 4) break;
        }

        let allThreeTwosAdded = 0;

        while (true) {
            let newItem = [getRndNumBwt1And100()];

            if (newItem[0] === 100) continue;

            let vertical = ((Math.ceil(Math.random() * 2) > 1) && (Number(String(newItem[0])[0]) % 10 < 8)) ? 10 : 1;

            if (vertical === 1 && (digitNum(2, newItem[0]) > 9 || digitNum(2, newItem[0]) === 0)) continue;

            newItem.push(newItem[newItem.length - 1] + vertical);

            if (!newItem.every(newItemCoor => {
                return (coors.flat().every(coor => {
                    return cellCompatibilityCond(coor, newItemCoor);
                }));

            })) {
                continue;
            }

            coors.push(newItem);

            allThreeTwosAdded++;

            if (allThreeTwosAdded === 3) break;
        }

        let allTwoThreessAdded = 0;

        while (true) {
            let newItem = [getRndNumBwt1And100()];

            if (newItem[0] === 100) continue;

            let vertical = ((Math.ceil(Math.random() * 2) > 1) && (Number(String(newItem[0])[0]) % 10 < 7)) ? 10 : 1;

            if (vertical === 1 && (digitNum(2, newItem[0]) > 8 || digitNum(2, newItem[0]) === 0)) continue;

            newItem.push(newItem[newItem.length - 1] + vertical);
            newItem.push(newItem[newItem.length - 1] + vertical);

            if (!newItem.every(newItemCoor => {
                return (coors.flat().every(coor => {
                    return cellCompatibilityCond(coor, newItemCoor);
                }));

            })) {
                continue;
            }

            coors.push(newItem);

            allTwoThreessAdded++;

            if (allTwoThreessAdded === 2) break;
        }

        let allOneFoursAdded = 0;

        let attempts = 0;

        while (true) {
            attempts++;

            if (attempts === 25) return generateRandomShips();

            let newItem = [getRndNumBwt1And100()];

            if (newItem[0] === 100) continue;

            let vertical = ((Math.ceil(Math.random() * 2) > 1) && (digitNum(1, newItem[0]) < 6)) ? 10 : 1;

            if (vertical === 1 && (digitNum(2, newItem[0]) > 7 || digitNum(2, newItem[0]) === 0)) continue;

            newItem.push(newItem[newItem.length - 1] + vertical);
            newItem.push(newItem[newItem.length - 1] + vertical);
            newItem.push(newItem[newItem.length - 1] + vertical);

            if (!newItem.every(newItemCoor => {
                return (coors.flat().every(coor => {
                    return cellCompatibilityCond(coor, newItemCoor);
                }));

            })) {
                continue;
            }

            coors.push(newItem);

            allOneFoursAdded++;

            if (allOneFoursAdded === 1) break;
        }

        return [
            new Ship(...coors[9]),
            new Ship(...coors[8]), new Ship(...coors[7]),
            new Ship(...coors[6]), new Ship(...coors[5]), new Ship(...coors[4]),
            new Ship(coors[3]), new Ship(coors[2]), new Ship(coors[1]), new Ship(coors[0])
        ];
    };

    const cellCompatibilityCond = (a, b) => {
        return (
            a      !== b  &&
            a + 1  !== b  &&
            a - 1  !== b  &&
            a + 10 !== b  &&
            a - 10 !== b  &&
            a + 11 !== b  &&
            a - 11 !== b  &&
            a + 9  !== b  &&
            a - 9  !== b
        );
    };

    const getAvailablePos = (coors) => {
        let board = Array(100).fill().map((_, i) => i + 1);

        coors.forEach(coor => {
            if (Math.sign(board.indexOf(coor)) !== -1) {
                board.splice(board.indexOf(coor), 1);
            }

            if (String(coor)[String(coor).length - 1] === '0') {
                safeSplice(board, board.indexOf(coor - 1));
                safeSplice(board, board.indexOf(coor + 10));
                safeSplice(board, board.indexOf(coor - 10));
                safeSplice(board, board.indexOf(coor + 9));
                safeSplice(board, board.indexOf(coor - 11));
            } else if (String(coor)[String(coor).length - 1] === '1') {
                safeSplice(board, board.indexOf(coor + 1));
                safeSplice(board, board.indexOf(coor + 10));
                safeSplice(board, board.indexOf(coor - 10));
                safeSplice(board, board.indexOf(coor - 9));
                safeSplice(board, board.indexOf(coor + 11));
            } else {
                safeSplice(board, board.indexOf(coor + 1));
                safeSplice(board, board.indexOf(coor - 1));
                safeSplice(board, board.indexOf(coor + 10));
                safeSplice(board, board.indexOf(coor - 10));
                safeSplice(board, board.indexOf(coor + 9));
                safeSplice(board, board.indexOf(coor - 9));
                safeSplice(board, board.indexOf(coor + 11));
                safeSplice(board, board.indexOf(coor - 11));             
            }
        });

        for (let i = board.length - 1; i >= 0; i--) {            
            if (board[i] === 0) {
                board.splice(board.indexOf(0), 1);
            } else if (coors.includes(board[i])) {
                board.splice(board.indexOf(board[i]), 1);
            }
        }

        return board;
    };

    const getFrozenPos = (coors) => {
        let frozen = [];

        coors.forEach(coor => {
            if (String(coor)[String(coor).length - 1] === '0') {
                safePush(frozen, coor - 1);
                safePush(frozen, coor + 10);
                safePush(frozen, coor - 10);
                safePush(frozen, coor + 9);
                safePush(frozen, coor - 11);
            } else if (String(coor)[String(coor).length - 1] === '1') {
                safePush(frozen, coor + 1);
                safePush(frozen, coor + 10);
                safePush(frozen, coor - 10);
                safePush(frozen, coor - 9);
                safePush(frozen, coor + 11);
            } else {
                safePush(frozen, coor + 1);
                safePush(frozen, coor - 1);
                safePush(frozen, coor + 10);
                safePush(frozen, coor - 10);
                safePush(frozen, coor + 9);
                safePush(frozen, coor - 9);
                safePush(frozen, coor + 11);
                safePush(frozen, coor - 11);
            }
        });


        for (let i = frozen.length - 1; i >= 0; i--) {            
            if (frozen[i] === 0) {
                frozen.splice(frozen.indexOf(0), 1);
            } else if (coors.includes(frozen[i])) {
                frozen.splice(frozen.indexOf(frozen[i]), 1);
            }
        }

        return [...new Set(frozen)];
    };

    const getDiagonalPos = coors => {
        let diag = [];

        coors.forEach(coor => {
            if (String(coor)[String(coor).length - 1] === '0') {
                safePush(diag, coor + 9);
                safePush(diag, coor - 11);
            } else if (String(coor)[String(coor).length - 1] === '1') {
                safePush(diag, coor - 9);
                safePush(diag, coor + 11);
            } else {
                safePush(diag, coor + 9);
                safePush(diag, coor - 9);
                safePush(diag, coor + 11);
                safePush(diag, coor - 11);
            }
        });

        return diag;
    }; 

    const getRndNumBwt1And100 =  () => {
        while (true) {
            let num = Math.ceil(Math.random() * 100);

            if (num >= 1 && num <= 100) return num;
        }
    }    

    const getRndNumBwt1And = (n) => {
        while (true) {
            let num = Math.ceil(Math.random() * n);

            if (num >= 1 && num <= 100) return num;
        }
    }

    const canBePlacedOn = (blockOrientation, blockSize, on) => {
        let cell = Number(on);

        let lastDigit = Number(String(on)[String(on).length - 1]);

        if (blockSize === 1) {
            return true;
        } else if (blockSize === 2) {
            if (blockOrientation === 'vertical') {
                if (cell > 90) return false;
            } else if (blockOrientation === 'horizontal') {
                if (lastDigit === 0) return false;
            }
        } else if (blockSize === 3) {
            if (blockOrientation === 'vertical') {
                if (cell > 80) return false;
            } else if (blockOrientation === 'horizontal') {
                if (lastDigit === 9 || lastDigit === 0) return false;
            }
        } else if (blockSize === 4) {
            if (blockOrientation === 'vertical') {
                if (cell > 70) return false;
            } else if (blockOrientation === 'horizontal') {
                if (lastDigit === 8 || lastDigit === 9 || lastDigit === 0) return false;
            }
        }

        return true;
    };

    const getPossibleHits = (ship, hits, unplayableCoors) => {
        let sortedHits = hits.sort((a, b) => a - b);

        let possibleHits = [];

        if (ship.hitCount() === 1) {
            if (digitNum(2, sortedHits[0]) !== 0) safePush(possibleHits, sortedHits[0] + 1);
            if (digitNum(2, sortedHits[0]) !== 1) safePush(possibleHits, sortedHits[0] - 1);
            if (digitNum(1, sortedHits[0]) !== 9) safePush(possibleHits, sortedHits[0] + 10);
            if (String(sortedHits[0]).length !== 1) safePush(possibleHits, sortedHits[0] - 10);

            return possibleHits.filter(hit => !unplayableCoors.includes(hit))[0];
        }

        let add = ship.getOrientation();

        if (add === 1 && digitNum(2, sortedHits[sortedHits.length - 1]) !== 0) {
            if (!unplayableCoors.includes(sortedHits[sortedHits.length - 1] + add) && sortedHits[sortedHits.length - 1] + add <= 100) {
                return sortedHits[sortedHits.length - 1] + add;
            }
        } else if (add === 10 && digitNum(1, sortedHits[sortedHits.length - 1]) !== 9) {
            if (!unplayableCoors.includes(sortedHits[sortedHits.length - 1] + add) && sortedHits[sortedHits.length - 1] + add <= 100) {
                return sortedHits[sortedHits.length - 1] + add;
            }
        }
        
        if (add === 1 && digitNum(2, sortedHits[0]) !== 1) {
            if (!unplayableCoors.includes(sortedHits[0] - add) && (sortedHits[0] - add) >= 1) {
                return sortedHits[0] - add;
            }
        } else if (add === 10 && String(sortedHits[0]).length !== 1) {
            if (!unplayableCoors.includes(sortedHits[0] - add) && (sortedHits[0] - add) >= 1) {
                return sortedHits[0] - add;
            }
        }
    };

    const safeSplice =  (array, index) => {
        if (Math.sign(index) === -1 || index > 100) return array;

        return array.splice(index, 1);
    };

    const safePush = (array, coor) => {
        if (coor < 0 || coor > 100) return array;

        return array.push(coor);
    };

    const digitNum = (num, of) => {
        if (of.toString().length === 1) return of;
        return Number(String(of)[num - 1]);
    };

    return {
    	generateRandomShips, cellCompatibilityCond, getAvailablePos, getFrozenPos,
        digitNum, canBePlacedOn, getRndNumBwt1And100, getDiagonalPos, getPossibleHits
    };
})();

module.exports = Battleship;
