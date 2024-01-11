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
        const tempBoard = this.copyBoard();

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

    copyBoard(): number[][] {
        const tempBoard = this.createBoard();

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                tempBoard[y][x] = this.board[y][x];
            }
        }

        return tempBoard;
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
            this.lockPiece();
            this.clearRows();
            this.activePiece = this.createPiece();
        }
    }

    rotatePiece() {
        const { blocks } = this.activePiece;

        this.activePiece.blocks = this.rotateBlocksClockwise(blocks);
        if (this.hasCollision()) this.activePiece.blocks = blocks;
    }

    rotateBlocksClockwise(blocks: number[][]) {
        return blocks[0].map((_val, index) =>
            blocks.map((row) => row[index]).reverse(),
        );
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

    lockPiece() {
        const { blocks, x: activeX, y: activeY } = this.activePiece;

        // Loop over every block in the piece
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                // If the block has a value, copy it to the main board state
                if (blocks[y][x]) {
                    this.board[y + activeY][x + activeX] = blocks[y][x];
                }
            }
        }
    }

    clearRows() {
        // Start with a clone of the real board so we can mutate it freely
        let tempBoard: number[][] = this.copyBoard();

        // Check every row for 0's
        for (let y = 0; y < this.board.length; y++) {
            // If a row doesn't include a 0 we can assume it's full
            if (!this.board[y].includes(0)) {
                // Remove the full row and add an empty row at the top
                tempBoard.splice(y, 1);
                tempBoard.unshift(Array(this.COLUMN).fill(0));
            }
        }
        // Set the current board to the new mutated board
        this.board = tempBoard;
    }
}
