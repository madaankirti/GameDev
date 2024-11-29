const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: ['Easy', 'Medium', 'Hard', 'Very Hard'],
    LEVEL: [38, 47, 52, 64] 
};
const newGrid = (size) => {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);
    }
    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
    }
    return arr;
};
const isColSafe = (grid, col, value) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false;
    }
    return true;
};
const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
};
const isBoxSafe = (grid, box_row, box_col, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
};
const isSafe = (grid, row, col, value) => {
    return (
        isColSafe(grid, col, value) &&
        isRowSafe(grid, row, value) &&
        isBoxSafe(grid, row-(row %3), col - (col % 3), value) &&
        value !== CONSTANT.UNASSIGNED
    );
};
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
};
const shuffleArray = (arr) => {
    let curr_index = arr.length;
    while (curr_index !== 0) {
        let rand_index = Math.floor(Math.random() * curr_index);
        curr_index -= 1;
        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }
    return arr;
};
const isFullGrid = (grid) => {
    for (let row of grid) {
        for (let value of row) {
            if (value === CONSTANT.UNASSIGNED) {
                return false;
            }
        }
    }
    return true;
}; 
const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    };
    if (!findUnassignedPos(grid, unassigned_pos)) return true;
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);
    let row = unassigned_pos.row;
    let col = unassigned_pos.col;
    for (let num of number_list) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (isFullGrid(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }
            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    }
    return isFullGrid(grid);
};
const sudokuCheck = (grid) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (
                grid[row][col] === CONSTANT.UNASSIGNED ||
                !isSafe(grid, row, col, grid[row][col])
            ) {
                return false;
            }
        }
    }
    return true;
};
const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);
const removeCells = (grid, level) => {
    let res = grid.map((row) => row.slice());
    let attempts = level;
    while (attempts > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === CONSTANT.UNASSIGNED) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attempts--;
    }
    return res;
};
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        };
    }
    return undefined;
 };
const game_screen = document.querySelector('#game-screen');
const cells = document.querySelectorAll('.main-grid-cell');
const number_inputs = document.querySelectorAll('.number');
const game_time = document.querySelector('#game-time');
const mistakesCountElem = document.querySelector('#mistakes-count');
const difficultySelect = document.querySelector('#difficulty');
const btnNewGame = document.querySelector('#btn-new-game');
const btnDelete = document.querySelector('#btn-delete');
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let timer = null;
let seconds = 0;
let mistakes = 0;
const MAX_MISTAKES = 3;
let su = undefined;
let su_answer = undefined;
let selected_cell = -1;
const initGameGrid = () => {
    let index = 0;
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5) cells[index].style.marginBottom = '10px';
        if (col === 2 || col === 5) cells[index].style.marginRight = '3px';
        index++;
    }
};
const showTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
};
const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled', 'selected', 'err', 'cell-err');
        cells[i].setAttribute('data-value', 0);
    }
};
const initSudoku = () => {
    clearSudoku();
    resetBg();
    su = sudokuGen(level);
    su_answer = su.question.map((row) => row.slice());
    seconds = 0;
    mistakes = 0;
    mistakesCountElem.textContent = mistakes;
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute('data-value', su.question[row][col]);

        if (su.question[row][col] !== CONSTANT.UNASSIGNED) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }
    }
};
const resetBg = () => {
    cells.forEach((e) => e.classList.remove('hover'));
};
const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - (row % 3);
    let box_start_col = col - (col % 3);
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell =
                cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
        }
    }
    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }
    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }
    step = 1;
    while (index - step >= 9 * row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }
    step = 1;
    while (index + step < 9 * row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
};
const removeErr = () => cells.forEach((e) => e.classList.remove('err'));
const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err', 'cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    };
    let index = selected_cell;
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - (row % 3);
    let box_start_col = col - (col % 3);
    let hasError = false;
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cellIndex =
                9 * (box_start_row + i) + (box_start_col + j);
            let cell = cells[cellIndex];
            if (
                cellIndex !== index &&
                parseInt(cell.getAttribute('data-value')) === value
            ) {
                hasError = true;
                addErr(cell);
            }
        }
    }
    let step = 9;
    while (index - step >= 0) {
        let cell = cells[index - step];
        if (parseInt(cell.getAttribute('data-value')) === value) {
            hasError = true;
            addErr(cell);
        }
        step += 9;
    }
    step = 9;
    while (index + step < 81) {
        let cell = cells[index + step];
        if (parseInt(cell.getAttribute('data-value')) === value) {
            hasError = true;
            addErr(cell);
        }
        step += 9;
    }
    step = 1;
    while (index - step >= 9 * row) {
        let cell = cells[index - step];
        if (parseInt(cell.getAttribute('data-value')) === value) {
            hasError = true;
            addErr(cell);
        }
        step += 1;
    }
    step = 1;
    while (index + step < 9 * row + 9) {
        let cell = cells[index + step];
        if (parseInt(cell.getAttribute('data-value')) === value) {
            hasError = true;
            addErr(cell);
        }
        step += 1;
    }
    if (hasError) {
        mistakes++;
        mistakesCountElem.textContent = mistakes;
        if (mistakes >= MAX_MISTAKES) {
            alert('Game Over! You have made too many mistakes.');
            stopTimer();
            cells.forEach((cell) => cell.classList.add('filled'));
        }
    }
};
const initNumberInputEvent = () => {
    number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (
                selected_cell !== -1 &&
                !cells[selected_cell].classList.contains('filled')
            ) {
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute(
                    'data-value',
                    index + 1
                );
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index + 1;
                removeErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                }, 500);
                if (isGameWin()) showResult();
            }
        });
    });
};
const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach((e) => e.classList.remove('selected'));
                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        });
    });
};
const startGame = () => {
    game_screen.classList.add('active');
    level_index = difficultySelect.value;
    level = CONSTANT.LEVEL[level_index];
    initSudoku();
    resetTimer();
    startTimer();
};
let timerInterval;
const resetTimer = () => {
    clearInterval(timerInterval);
    seconds = 0;
    game_time.innerHTML = showTime(seconds);
};
const startTimer = () => {
    timerInterval = setInterval(() => {
        seconds++;
        game_time.innerHTML = showTime(seconds);
    }, 1000);
};
const stopTimer = () => {
    clearInterval(timerInterval);
};
const isGameWin = () => {
    return (
        su_answer.flat().every((num) => num !== CONSTANT.UNASSIGNED) &&
        sudokuCheck(su_answer)
    );
};
const showResult = () => {
    stopTimer();
    let score = calculateScore();
    alert(
        `Congratulations! You completed the puzzle.\nTime: ${showTime(
            seconds
        )}\nScore: ${score}`
    );
};
const calculateScore = () => {
    let baseScore = 1000;
    let timePenalty = seconds * 2;
    let mistakesPenalty = mistakes * 50;
    let finalScore = baseScore - timePenalty - mistakesPenalty;
    return finalScore > 0 ? finalScore : 0;
};
btnNewGame.addEventListener('click', startGame);
btnDelete.addEventListener('click', () => {
    if (
        selected_cell !== -1 &&
        !cells[selected_cell].classList.contains('filled')
    ) {
        cells[selected_cell].innerHTML = '';
        cells[selected_cell].setAttribute('data-value', 0);
        let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
        let col = selected_cell % CONSTANT.GRID_SIZE;
        su_answer[row][col] = CONSTANT.UNASSIGNED;
        removeErr();
    }
});
const init = () => {
    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();
    startGame();
};
document.addEventListener('DOMContentLoaded', init);
