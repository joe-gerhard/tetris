import { BASE_SCORES, COLUMNS, ROWS } from './constants';
import Piece, { Tetromino } from './piece';

export default class Game {
    board: number[][] = [];
    activePiece: Piece = this.createPiece();
    nextPiece: Piece = this.createPiece();
    topOut: boolean = false;
    statistics = {
        T: 0,
        J: 0,
        Z: 0,
        O: 0,
        S: 0,
        L: 0,
        I: 0,
    };
    lines: number = 0;
    level: number = 1;
    score: number = 0;
    topScore: number = 0;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.board = this.createBoard();
        this.nextPiece = this.createPiece();
        this.activePiece = this.createPiece();
        this.countPiece(this.activePiece);
        this.topOut = false;
        this.topScore = Math.max(this.score, this.topScore);
        this.score = 0;
        this.level = 1;
    }

    createBoard(): number[][] {
        let board: number[][] = [];

        for (let y = 0; y < ROWS; y++) {
            board[y] = [];
            for (let x = 0; x < COLUMNS; x++) {
                board[y][x] = 0;
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

    countPiece({ tetromino }: Piece): void {
        this.statistics[tetromino]++;
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
            isGameOver: this.topOut,
            statistics: this.statistics,
            score: this.score,
            topScore: this.topScore,
            lines: this.lines,
            level: this.level,
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

    movePieceDown(isHoldingDown: boolean = false) {
        // Move the piece down one unit
        this.activePiece.y += 1;
        // If the player has pressed the down button they get extra points
        if (isHoldingDown) this.incrementSoftDropScore();
        // Once the piece hits the bottom, lock it in place and create a new piece
        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            this.clearRows();
            this.activePiece = this.nextPiece;
            this.countPiece(this.nextPiece);
            this.nextPiece = this.createPiece();
        }

        // If there is still a collision at this point, the player has topped out
        if (this.hasCollision()) {
            this.topOut = true;
        }
    }

    incrementSoftDropScore() {
        this.activePiece.softDropScore++;
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
        let clearedRows: number = 0;

        // Check every row for 0's
        for (let y = 0; y < this.board.length; y++) {
            // If a row doesn't include a 0 we can assume it's full
            if (!this.board[y].includes(0)) {
                // Remove the full row and add an empty row at the top
                tempBoard.splice(y, 1);
                tempBoard.unshift(Array(COLUMNS).fill(0));

                // Count the cleared row for scoring purposes
                clearedRows++;
            }
        }
        // Set the current board to the new mutated board
        this.board = tempBoard;

        // Calulate the score
        let baseScore = BASE_SCORES[clearedRows];
        let lineScore = baseScore * (this.level + 1);
        let totalScore = lineScore + this.activePiece.softDropScore;

        this.lines += clearedRows;
        this.score += totalScore;

        if (this.lines >= this.level * 10) this.level++;
    }
}
