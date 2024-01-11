import Piece, { Tetromino } from './piece';

export default class Game {
    ROW: number = 20;
    COLUMN: number = 10;
    VACANT: number = 0;
    board: number[][] = [];
    activePiece: Piece = this.createPiece();

    constructor() {
        this.initialize();
    }

    initialize() {
        this.board = this.createBoard();
        this.activePiece = this.createPiece();
    }

    createBoard(): number[][] {
        let board: number[][] = [];

        for (let y = 0; y < this.ROW; y++) {
            board[y] = [];
            for (let x = 0; x < this.COLUMN; x++) {
                board[y][x] = this.VACANT;
            }
        }
        return board;
    }

    createPiece(): Piece {
        const values = Object.keys(Tetromino);
        const randomNumber = Math.floor(Math.random() * values.length);
        const key = values[randomNumber];

        return new Piece(Tetromino[key as keyof typeof Tetromino]);
    }

    getState() {
        // Copy current board state to temp board
        const tempBoard = this.createBoard();

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                tempBoard[y][x] = this.board[y][x];
            }
        }

        // Add active piece to temp board
        const { blocks, x: activeX, y: activeY } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x])
                    tempBoard[y + activeY][x + activeX] = blocks[y][x];
            }
        }

        // Return the result
        return {
            board: tempBoard,
        };
    }

    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.hasCollision()) this.activePiece.x += 1;
    }

    movePieceRight() {
        this.activePiece.x += 1;
        if (this.hasCollision()) this.activePiece.x -= 1;
    }

    movePieceDown() {
        this.activePiece.y += 1;
        if (this.hasCollision()) {
            this.activePiece.y -= 1;
        }
    }

    hasCollision() {
        const { blocks, x: activeX, y: activeY } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    // If we are checking a solid block and...
                    blocks[y][x] &&
                    // ...it collides with the bottom...
                    (this.board[y + activeY] === undefined ||
                        // ...or it collides with an edge...
                        this.board[y + activeY][x + activeX] === undefined ||
                        // ...or it collides with another block.
                        this.board[y + activeY][x + activeX])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {}
}
