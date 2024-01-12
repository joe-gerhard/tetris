import { HEIGHT, SQUARESIZE, WIDTH } from './constants';

export default class View {
    ctx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.getElementById('tetris');

        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error('Expected canvas to be an HTMLCanvasElement');

        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('canvas.getContext() failed unexpectedly');

        ctx.canvas.width = WIDTH;
        ctx.canvas.height = HEIGHT;

        this.ctx = ctx;
    }

    drawSquare(x: number, y: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * SQUARESIZE,
            y * SQUARESIZE,
            SQUARESIZE,
            SQUARESIZE,
        );
        this.ctx.strokeStyle = color === 'black' ? 'black' : 'black';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'bevel';
        this.ctx.strokeRect(
            x * SQUARESIZE + 1,
            y * SQUARESIZE + 1,
            SQUARESIZE,
            SQUARESIZE,
        );
    }

    renderBoard(board: number[][]) {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                const color = this.getColor(board[y][x]);
                this.drawSquare(x, y, color);
            }
        }
    }

    getColor(c: number): string {
        if (c === 0) return 'black';
        return `hsl(${c * 4} ${c * 5 + 50}% ${c * 9 + 10}%)`;
    }

    renderGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2 - 48);
        this.ctx.font = '16px arial';
        this.ctx.fillText('Press Space to Play Again', WIDTH / 2, HEIGHT / 2);
    }

    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSED', WIDTH / 2, HEIGHT / 2 - 48);
        this.ctx.font = '16px arial';
        this.ctx.fillText('Press Space to Resume', WIDTH / 2, HEIGHT / 2);
    }

    renderStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0)';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Press SPACE to Start', WIDTH / 2, HEIGHT / 2 - 48);
    }
}
