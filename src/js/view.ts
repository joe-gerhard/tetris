import { COLORS } from './constants';

export default class View {
    SQUARESIZE: number = 20;
    context: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.getElementById('tetris');

        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error('Expected canvas to be an HTMLCanvasElement');

        const context = canvas.getContext('2d');

        if (!context)
            throw new Error('canvas.getContext() failed unexpectedly');

        this.context = context;
    }

    drawSquare(x: number, y: number, color: string): void {
        this.context.fillStyle = color;
        this.context.fillRect(
            x * this.SQUARESIZE,
            y * this.SQUARESIZE,
            this.SQUARESIZE,
            this.SQUARESIZE,
        );
        this.context.strokeStyle = 'black';
        this.context.strokeRect(
            x * this.SQUARESIZE,
            y * this.SQUARESIZE,
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
