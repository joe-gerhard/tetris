import { HEIGHT, SQUARESIZE, WIDTH } from './constants';
import Piece from './piece';

export default class View {
    boardContext: CanvasRenderingContext2D;
    nextContext: CanvasRenderingContext2D;

    constructor() {
        const boardContext = this.getCanvasContextById('board');
        boardContext.canvas.width = WIDTH;
        boardContext.canvas.height = HEIGHT;

        const nextContext = this.getCanvasContextById('next');
        nextContext.canvas.width = SQUARESIZE * 6;
        nextContext.canvas.height = SQUARESIZE * 5;

        this.boardContext = boardContext;
        this.nextContext = nextContext;
    }

    getCanvasContextById(id: string): CanvasRenderingContext2D {
        const canvas = document.getElementById(id);

        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error('Expected canvas to be an HTMLCanvasElement');

        const context = canvas.getContext('2d');

        if (!context)
            throw new Error('canvas.getContext() failed unexpectedly');

        return context;
    }

    drawSquare(
        x: number,
        y: number,
        color: number,
        context: CanvasRenderingContext2D = this.boardContext,
    ): void {
        context.fillStyle = this.getColor(color);
        context.fillRect(
            x * SQUARESIZE,
            y * SQUARESIZE,
            SQUARESIZE,
            SQUARESIZE,
        );
        context.strokeStyle = color ? this.getColor(color - 2) : 'black';
        context.lineWidth = 3;
        context.lineJoin = 'bevel';
        context.strokeRect(
            x * SQUARESIZE,
            y * SQUARESIZE,
            SQUARESIZE,
            SQUARESIZE,
        );
        context.strokeStyle = color ? this.getColor(color + 2) : 'black';
        context.lineWidth = 3;
        context.lineJoin = 'bevel';
        context.strokeRect(
            x * SQUARESIZE + 1,
            y * SQUARESIZE + 1,
            SQUARESIZE,
            SQUARESIZE,
        );
    }

    renderBoard(board: number[][]) {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                this.drawSquare(x, y, board[y][x]);
            }
        }
    }

    renderNextPanel({ blocks }: Piece) {
        this.clearCanvas(this.nextContext);
        const pieceX =
            this.nextContext.canvas.width / SQUARESIZE / 2 - blocks.length / 2;
        const pieceY =
            this.nextContext.canvas.height / SQUARESIZE / 2 -
            blocks.length / 2 +
            1;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                this.drawSquare(
                    x + pieceX,
                    y + pieceY,
                    blocks[y][x],
                    this.nextContext,
                );
            }
        }

        this.nextContext.fillStyle = 'white';
        this.nextContext.font = '48px VT323';
        this.nextContext.textAlign = 'center';
        this.nextContext.textBaseline = 'middle';
        this.nextContext.fillText(
            'NEXT',
            this.nextContext.canvas.width / 2,
            16,
        );
    }

    clearCanvas(context: CanvasRenderingContext2D = this.boardContext) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    getColor(c: number): string {
        if (c === 0) return 'black';
        return `hsl(${c * 4} ${c * 5 + 50}% ${c * 5 + 20}%)`;
    }

    renderGameOver() {
        this.boardContext.fillStyle = 'rgba(0, 0, 0, .8)';
        this.boardContext.fillRect(0, 0, WIDTH, HEIGHT);

        this.boardContext.fillStyle = 'white';
        this.boardContext.font = '32px VT323';
        this.boardContext.textAlign = 'center';
        this.boardContext.textBaseline = 'middle';
        this.boardContext.fillText('Game Over', WIDTH / 2, HEIGHT / 2 - 48);
        this.boardContext.font = '24px VT323';
        this.boardContext.fillText(
            'Press Space to Play Again',
            WIDTH / 2,
            HEIGHT / 2,
        );
    }

    renderPauseScreen() {
        this.boardContext.fillStyle = 'rgba(0, 0, 0, .8)';
        this.boardContext.fillRect(0, 0, WIDTH, HEIGHT);

        this.boardContext.fillStyle = 'white';
        this.boardContext.font = '32px VT323';
        this.boardContext.textAlign = 'center';
        this.boardContext.textBaseline = 'middle';
        this.boardContext.fillText('PAUSED', WIDTH / 2, HEIGHT / 2 - 48);
        this.boardContext.font = '24px VT323';
        this.boardContext.fillText(
            'Press Space to Resume',
            WIDTH / 2,
            HEIGHT / 2,
        );
    }

    renderStartScreen() {
        this.boardContext.fillStyle = 'rgba(0, 0, 0)';
        this.boardContext.fillRect(0, 0, WIDTH, HEIGHT);

        this.boardContext.fillStyle = 'white';
        this.boardContext.font = '24px VT323';
        this.boardContext.textAlign = 'center';
        this.boardContext.textBaseline = 'middle';
        this.boardContext.fillText(
            'Press SPACE to Start',
            WIDTH / 2,
            HEIGHT / 2 - 48,
        );
    }
}
