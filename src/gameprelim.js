const gameLoop = require('./gameloop.js');
const Ship = require('./Ship.js');
const Battleship = require('./Battleship.js');
const blocksSpritemap = require('./blocks-spritemap.png');
const blocksSpritemapFlipped = require('./blocks-spritemap-flipped.png');

const gamePrelim = (game) => {
  let selectedShips = [];
  let selectedCoors = [];
  let randomShips;
  let playerChoice = 1;
  let randomShipsFlat = [];
  let draggableSize;
  let draggableOrientation;
  let draggableCoors = []
  let feedbackImg = new Image();
  feedbackImg.src = blocksSpritemap;
  feedbackImg.style.objectFit = 'none';
  feedbackImg.style.objectPosition = '0px 0px';
  feedbackImg.style.width = '192px';
  feedbackImg.style.height = '53px';
  feedbackImg.style.clipPath = 'inset(50px 50px)';
  document.body.appendChild(feedbackImg)

  document.querySelector('#game').style.display = 'none';
  document.querySelector('.ships-selection').style.display = 'grid';

  document.querySelector('.ships-selection h3').innerText = 'Player 1: Place your ships';

  document.querySelectorAll('.board .box').forEach(box => {
    box.dataset.ship = '';

    if (box.classList.contains('frozen')) box.classList.remove('frozen');
  });

  selectedCoors = [];
  selectedShips = [];

  document.querySelectorAll('.block').forEach(block => {
    block.dataset.placed = 'false';

    if (Number(block.dataset.size) > 1) document.querySelector(`span[data-block="${block.id}"]`).style.display = 'initial';

    if (block.dataset.orientation === 'vertical') {
      block.style.width = window.getComputedStyle(block).height;

      block.style.height = '40px';

      block.dataset.orientation = 'horizontal';
    }

    block.style.top = 'initial';
    block.style.left = 'initial';

    block.style.position = 'initial';

    document.querySelector(`.ships-selection #blocks ol:nth-last-of-type(${Number(block.dataset.size)}) li:nth-of-type(${Number(block.id[block.id.length - 1])})`)
      .appendChild(block);
  });

  document.querySelectorAll('#blocks span[data-block]').forEach(span => span.addEventListener('click', e => {
    let block = document.getElementById(span.dataset.block);

    let size = block.dataset.size;

    let style = window.getComputedStyle(block);

    let orientation = block.dataset.orientation;

    if (orientation === 'vertical') {
      block.style.width = style.height;

      block.style.height = '40px';

      block.dataset.orientation = 'horizontal';

      feedbackImg.src = blocksSpritemapFlipped;

      if (Number(e.target.dataset.size) === 4) {
        feedbackImg.style.objectPosition = '0px 0px';
        feedbackImg.style.height = '192px';
      } else if (Number(e.target.dataset.size) === 3) {
        feedbackImg.style.objectPosition = '0px -192px';
        feedbackImg.style.height = '145.5px';
      } else if (Number(e.target.dataset.size) === 2) {
        feedbackImg.style.objectPosition = '0px -337.5px';
        feedbackImg.style.height = '98.5px';
      } else if (Number(e.target.dataset.size) === 1) {
        feedbackImg.style.objectPosition = '0px -436px';
        feedbackImg.style.height = '53px';
      }

    } else if (orientation === 'horizontal') {
      block.style.height = style.width;

      block.style.width = '40px';

      block.dataset.orientation = 'vertical';

      feedbackImg.src = blocksSpritemapFlipped;

      if (Number(e.target.dataset.size) === 4) {
        feedbackImg.style.objectPosition = '0px 0px';
        feedbackImg.style.height = '192px';
      } else if (Number(e.target.dataset.size) === 3) {
        feedbackImg.style.objectPosition = '0px -192px';
        feedbackImg.style.height = '145.5px';
      } else if (Number(e.target.dataset.size) === 2) {
        feedbackImg.style.objectPosition = '0px -337.5px';
        feedbackImg.style.height = '98.5px';
      } else if (Number(e.target.dataset.size) === 1) {
        feedbackImg.style.objectPosition = '0px -436px';
        feedbackImg.style.height = '53px';
      }
    }
  }));

  document.querySelectorAll('.block').forEach(block => block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.id);
    draggableSize = e.target.dataset.size;

    feedbackImg.src = blocksSpritemap;

    if (Number(e.target.dataset.size) === 4) {
      feedbackImg.style.objectPosition = '0px 0px';
      feedbackImg.style.width = '192px';
    } else if (Number(e.target.dataset.size) === 3) {
      feedbackImg.style.objectPosition = '-192px 0px';
      feedbackImg.style.width = '145.5px';
    } else if (Number(e.target.dataset.size) === 2) {
      feedbackImg.style.objectPosition = '-337.5px 0px';
      feedbackImg.style.width = '98.5px';
    } else if (Number(e.target.dataset.size) === 1) {
      feedbackImg.style.objectPosition = '-436px 0px';
      feedbackImg.style.width = '53px';
    }
    
    if (e.target.dataset.orientation === 'vertical') {
      feedbackImg.src = blocksSpritemapFlipped;

      if (Number(e.target.dataset.size) === 4) {
        feedbackImg.style.objectPosition = '0px 0px';
        feedbackImg.style.height = '192px';
      } else if (Number(e.target.dataset.size) === 3) {
        feedbackImg.style.objectPosition = '0px -192px';
        feedbackImg.style.height = '145.5px';
      } else if (Number(e.target.dataset.size) === 2) {
        feedbackImg.style.objectPosition = '0px -337.5px';
        feedbackImg.style.height = '98.5px';
      } else if (Number(e.target.dataset.size) === 1) {
        feedbackImg.style.objectPosition = '0px -436px';
        feedbackImg.style.height = '53px';
      }
    }

    e.dataTransfer.setDragImage(feedbackImg, 22, 22);

    block.style.opacity = '0.5';

    draggableOrientation = e.target.dataset.orientation;
    draggableCoors = [];

    if (block.dataset.placed === "true") {
      let cell = document.elementsFromPoint(block.getBoundingClientRect().x + 5, block.getBoundingClientRect().y + 5)[1];

      let orientation = block.dataset.orientation;

      draggableCoors.push(Number(cell.dataset.box));

      for (let i = 1; i < block.dataset.size; i++) {
        if (orientation === 'horizontal') {
          draggableCoors.push(Number(cell.nextElementSibling.dataset.box));

          cell = cell.nextElementSibling;
        } else if (orientation === 'vertical') {
          draggableCoors.push(Number(cell.dataset.box) + 10 * i);
        }
      }
    }

    if (block.dataset.placed === "true") {
      draggableCoors.forEach(coor => {
        document.querySelector(`.ships-selection .board .box[data-box="${coor}"]`).dataset.ship = '';

        if (selectedCoors.includes(coor)) {
          selectedCoors.splice(selectedCoors.indexOf(coor), 1);
        }
      });

      block.style.opacity = '0.5';
    }

    document.querySelectorAll('.ships-selection .box').forEach(box => {
      if (!Battleship.getAvailablePos(selectedCoors).includes(Number(box.dataset.box)) && box.dataset.ship !== "true") {
        box.classList.add('frozen');
      } else if (box.classList.contains('frozen')) box.classList.remove('frozen');
    });

    e.dataTransfer.effectAllowed = 'move'

    if (selectedCoors.length !== 20) {
      document.getElementById('continue').setAttribute('disabled', true);
    }
  }));

  document.querySelectorAll('.block').forEach(block => block.addEventListener('dragend', e => {
    if (e.dataTransfer.dropEffect === 'none') {
      e.target.style.opacity = '1';

      if (e.target.dataset.placed === 'true') {
        let cell = document.elementsFromPoint(block.getBoundingClientRect().x + 5, block.getBoundingClientRect().y + 5)[1];

        cell.dataset.ship = "true";
        selectedCoors.push(cell.dataset.box);

        for (let i = 1; i < draggableSize; i++) {
          if (cell.nextElementSibling.classList.contains('box')) {
            if (block.dataset.orientation === 'horizontal') {
              cell.nextElementSibling.dataset.ship = true;
              selectedCoors.push(Number(cell.nextElementSibling.dataset.box));

              cell = cell.nextElementSibling;
            } else if (block.dataset.orientation === 'vertical') {
              cell = document.querySelector(`.ships-selection .board span[data-box="${Number(cell.dataset.box) + 10}"]`);
              cell.dataset.ship = true;
              selectedCoors.push(Number(cell.dataset.box));
            }
          }
        }

        Battleship.getFrozenPos(draggableCoors).forEach(coor => {
          if (draggableCoors.includes(coor)) return;

          document.querySelector(`.ships-selection .box[data-box="${coor}"]`).classList.add('frozen');
        });
      }
    }
  }));

  document.querySelectorAll('.ships-selection .box').forEach(cell => cell.addEventListener('dragover', e => {
    e.preventDefault();

    if (e.target.classList.contains('frozen')
    ||  e.target.dataset.ship === "true"
    ||  !Battleship.canBePlacedOn(draggableOrientation, Number(draggableSize), Number(e.target.dataset.box)))
    {
      return;
    }

    let target = e.target;

    for (let i = 1; i < draggableSize; i++) {
      if (draggableOrientation === 'horizontal') {
        if (target.nextElementSibling.classList.contains('frozen') || target.nextElementSibling.dataset.ship === 'true') return;

        target = target.nextElementSibling;
      } else if (draggableOrientation === 'vertical') {
        target = document.querySelector(`.ships-selection .board span[data-box="${Number(target.dataset.box) + 10}"]`);

        if (target.classList.contains('frozen') || target.dataset.ship === 'true') return; 
      }
    }

    e.target.style.border = '2px solid green';

    target = e.target;

    for (let i = 1; i < draggableSize; i++) {
      if (draggableOrientation === 'horizontal') {
        target.nextElementSibling.style.border = '2px solid green';

        target = target.nextElementSibling;
      } else if (draggableOrientation === 'vertical') {
        target = document.querySelector(`.ships-selection .board span[data-box="${Number(target.dataset.box) + 10}"]`);

        target.style.border = '2px solid green';
      }
    }
  }));
  
  document.querySelectorAll('.ships-selection .box').forEach(cell => cell.addEventListener('dragleave', e => {
    document.querySelectorAll('.ships-selection .box').forEach(box => box.style.border = 'none');
  }));

  document.querySelector('.ships-selection #blocks').addEventListener('mouseover', e => {
    e.preventDefault();
  });

  document.querySelector('.ships-selection #blocks').addEventListener('drop', e => {
    let block = document.getElementById(e.dataTransfer.getData('text/plain'));

    if ((block.dataset.size) > 1) {
      let rotate = document.querySelector(`li span[data-block="${block.id}"]`);

      rotate.style.display = 'initial';
    }

    block.dataset.placed = 'false';

    block.style.position = 'initial';
    block.style.top = 'initial';
    block.style.left = 'initial';

    block.style.opacity = '1';
  });

  document.querySelectorAll('.ships-selection .board .box').forEach(cell => cell.addEventListener('drop', e => {
    document.querySelectorAll('.ships-selection .box').forEach(box => box.style.border = 'none');

    if (!Battleship.getAvailablePos(selectedCoors).includes(Number(e.target.dataset.box)) || !Battleship.canBePlacedOn(draggableOrientation, Number(draggableSize), Number(e.target.dataset.box))) {
      return;
    }

    let target = e.target;

    for (let i = 1; i < draggableSize; i++) {
      if (draggableOrientation === 'horizontal') {
        if (target.nextElementSibling.classList.contains('frozen') || target.nextElementSibling.dataset.ship === 'true') return;

        target = target.nextElementSibling;
      } else if (draggableOrientation === 'vertical') {
        target = document.querySelector(`.ships-selection .board span[data-box="${Number(target.dataset.box) + 10}"]`);

        if (target.classList.contains('frozen') || target.nextElementSibling.dataset.ship === 'true') return; 
      }
    }

    e.target.dataset.ship = 'true';
    selectedCoors.push(Number(e.target.dataset.box));

    target = e.target;

    let block = document.getElementById(e.dataTransfer.getData('text/plain'));

    block.style.opacity = '1';

    if (block.dataset.placed === "true") {
      draggableCoors.forEach(coor => {
        // document.querySelector(`.ships-selection .board .box[data-box="${coor}"]`).dataset.ship = '';
        // if (selectedCoors.includes(coor)) {
        //   selectedCoors.splice(selectedCoors.indexOf(coor), 1);
        // }
      });

      Battleship.getFrozenPos(draggableCoors).forEach(coor => {
        // if (selectedCoors.includes(coor)) {
        //   selectedCoors.splice(selectedCoors.indexOf(coor), 1);
        // }

        // document.querySelector(`.ships-selection .board .box[data-box="${coor}"]`).classList.remove('frozen')
      });

      selectedShips = [];
    }

    for (let i = 1; i < draggableSize; i++) {
      if (block.dataset.orientation === 'horizontal') {
        target.nextElementSibling.dataset.ship = true;
        selectedCoors.push(Number(target.nextElementSibling.dataset.box));

        target = target.nextElementSibling;
      } else if (block.dataset.orientation === 'vertical') {
        target = document.querySelector(`.ships-selection .board span[data-box="${Number(target.dataset.box) + 10}"]`);
        target.dataset.ship = true;
        selectedCoors.push(Number(target.dataset.box));
      }
    }

    let position = e.target.getBoundingClientRect();


    block.style.position = 'absolute';

    block.style.top = `${position.y - 5}px`;
    block.style.left = `${position.x - 5}px`;

    if (block.dataset.placed !== "true")  {
      document.querySelector('.ships-selection .board').appendChild(block);
    }

    block.dataset.placed = "true";

    if (Number(block.dataset.size) > 1) document.querySelector(`span[data-block="${block.id}"]`).style.display = 'none';

    document.querySelectorAll('.ships-selection .box').forEach(box => {
      if (!Battleship.getAvailablePos(selectedCoors).includes(Number(box.dataset.box)) && box.dataset.ship !== "true") {
        box.classList.add('frozen');
      }
    });

    if (selectedCoors.length === 20) {
      document.getElementById('continue').removeAttribute('disabled');
    }
  }));

  document.querySelector('.ships-selection #randomize').addEventListener('click', e => {
    e.target.setAttribute('disabled', true);

    setTimeout(() => {
      e.target.removeAttribute('disabled');
    }, 300);

    document.querySelectorAll('.ships-selection .board .box').forEach(box => {
      box.dataset.ship = '';

      if (box.classList.contains('frozen')) box.classList.remove('frozen');
    });

    selectedCoors = [];

    document.querySelectorAll('.block').forEach(block => {
      block.style.top = 'initial';
      block.style.left = 'initial';

      block.style.position = 'absolute';

      block.dataset.placed = 'false';

      if (block.dataset.orientation === 'vertical') {
        block.style.width = window.getComputedStyle(block).height;

        block.style.height = '40px';

        block.dataset.orientation = 'horizontal';
      }

      document.querySelector(`.ships-selection #blocks ol:nth-last-of-type(${Number(block.dataset.size)}) li:nth-of-type(${Number(block.id[block.id.length - 1])})`)
          .appendChild(block);

      if (Number(block.dataset.size) > 1) document.querySelector(`span[data-block="${block.id}"]`).style.display = 'none';
    });

    randomShips = Battleship.generateRandomShips();
    randomShipsFlat = [];

    randomShips.forEach(ship => {
        randomShipsFlat = randomShipsFlat.concat(ship.getCoors());
    });

    let blocks = document.querySelectorAll('.block');

    for (let i = 0; i < randomShips.length; i++) {
      let cell = document.querySelector(`.ships-selection .board .box[data-box="${randomShips[i].coordinates[0]}"]`);
      cell.dataset.ship = true;

      let length = randomShips[i].length;

      cell.parentNode.appendChild(blocks[i]);

      blocks[i].dataset.placed = 'true';

      if (length > 1 && randomShips[i].coordinates[0] + 10 == randomShips[i].coordinates[1]) {
        blocks[i].dataset.orientation = 'vertical';

        blocks[i].style.height = window.getComputedStyle(blocks[i]).width;

        blocks[i].style.width = "40px";
      }

        blocks[i].style.top = `${cell.getBoundingClientRect().top - 5}px`;
        blocks[i].style.left = `${cell.getBoundingClientRect().left - 5}px`;

      for (let j = 1; j < length; j++) {
        if (length > 1 && randomShips[i].coordinates[0] + 10 == randomShips[i].coordinates[1]) {
          cell = document.querySelector(`.ships-selection .board span[data-box="${Number(cell.dataset.box) + 10}"]`);

          cell.dataset.ship = true;
        } else {
          cell.nextElementSibling.dataset.ship = true;

          cell = cell.nextElementSibling;
        }

      }
    }

    selectedShips = randomShips;

    selectedCoors = randomShipsFlat;

    document.querySelectorAll('.ships-selection .box').forEach(box => {
      if (!Battleship.getAvailablePos(selectedCoors).includes(Number(box.dataset.box)) && box.dataset.ship !== "true") {
        box.classList.add('frozen');
      }
    });

    document.querySelector('#continue').removeAttribute('disabled');
  });

  document.querySelector('.ships-selection #continue').addEventListener('click', e => {
    if (selectedShips.length !== 10) {
      selectedShips = [];

      document.querySelectorAll('.block').forEach(block => {
        let coors = [];

        let cell = document.elementsFromPoint(block.getBoundingClientRect().x + 5, block.getBoundingClientRect().y + 5)[1];

        let orientation = block.dataset.orientation;

        coors.push(Number(cell.dataset.box));

        for (let i = 1; i < block.dataset.size; i++) {
          if (orientation === 'horizontal') {
            coors.push(Number(cell.nextElementSibling.dataset.box));

            cell = cell.nextElementSibling;
          } else if (orientation === 'vertical') {
            coors.push(Number(cell.dataset.box) + 10 * i);
          }
        }

        selectedShips.push(new Ship(...coors));
      });
    }

    if (playerChoice === 1) {
      game.getSecondPlayer().getBoard().addAllShips(selectedShips);
    } else if (playerChoice === 2) {
      game.getFirstPlayer().getBoard().addAllShips(selectedShips);
    }

    if (game.getSecondPlayer().getType() === 'bot' || playerChoice === 2) {
      document.querySelector('.ships-selection').style.display = 'none';
      document.querySelector('#game').style.display = 'grid';

      gameLoop(game);
    } else {
      playerChoice = 2;

      document.querySelector('.ships-selection h3').innerText = 'Player 2: Place your ships'

      document.querySelectorAll('.ships-selection .board .box').forEach(box => {
        box.dataset.ship = '';

        if (box.classList.contains('frozen')) box.classList.remove('frozen');
      });

      selectedCoors = [];

      document.querySelectorAll('.block').forEach(block => {
        block.dataset.placed = 'false';

        if (Number(block.dataset.size) > 1) document.querySelector(`span[data-block="${block.id}"]`).style.display = 'initial';

        if (block.dataset.orientation === 'vertical') {
          block.style.width = window.getComputedStyle(block).height;

          block.style.height = '40px';

          block.dataset.orientation = 'horizontal';
        }

        block.style.top = 'initial';
        block.style.left = 'initial';

        block.style.position = 'initial';

        document.querySelector(`.ships-selection #blocks ol:nth-last-of-type(${Number(block.dataset.size)}) li:nth-of-type(${Number(block.id[block.id.length - 1])})`)
          .appendChild(block);
      });

      document.getElementById('continue').setAttribute('disabled', true);
    }
  });
}

module.exports = gamePrelim;