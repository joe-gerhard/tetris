import { COLORS } from './constants';

export default class View {
    SQUARESIZE: number = 20;
    ctx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.getElementById('tetris');

        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error('Expected canvas to be an HTMLCanvasElement');

        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('canvas.getContext() failed unexpectedly');

        this.ctx = ctx;
    }

    drawSquare(x: number, y: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.SQUARESIZE,
            y * this.SQUARESIZE,
            this.SQUARESIZE,
            this.SQUARESIZE,
        );
        this.ctx.strokeStyle = color === 'black' ? 'black' : 'white';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'bevel';
        this.ctx.strokeRect(
            x * this.SQUARESIZE + 1,
            y * this.SQUARESIZE + 1,
            this.SQUARESIZE,
            this.SQUARESIZE,
        );
    }

    renderBoard(board: number[][]) {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                this.drawSquare(x, y, COLORS[board[y][x]]);
            }
        }
    }
}
