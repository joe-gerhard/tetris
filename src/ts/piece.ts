export enum Tetromino {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    T = 'T',
    Z = 'Z',
}

export const TETROMINOES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    J: [
        [2, 2, 2],
        [0, 0, 2],
        [0, 0, 0],
    ],
    L: [
        [3, 3, 3],
        [3, 0, 0],
        [0, 0, 0],
    ],
    O: [
        [4, 4],
        [4, 4],
    ],
    S: [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],
    T: [
        [6, 6, 6],
        [0, 6, 0],
        [0, 0, 0],
    ],
    Z: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
    ],
};

export default class Piece {
    tetromino: Tetromino;
    blocks: number[][];
    x: number;
    y: number;
    softDropScore: number = 0;

    constructor(tetromino: Tetromino) {
        this.tetromino = tetromino;
        this.blocks = TETROMINOES[tetromino];
        this.x = Math.ceil(5 - this.blocks.length / 2);
        this.y = 0;
    }
}
