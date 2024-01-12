import { HEIGHT, SQUARESIZE, WIDTH } from './constants';
import Piece, { TETROMINOES, Tetromino } from './piece';

export default class View {
    boardContext: CanvasRenderingContext2D;
    nextContext: CanvasRenderingContext2D;
    statisticsContext: CanvasRenderingContext2D;
    scoreContext: CanvasRenderingContext2D;
    linesCount: HTMLElement;
    levelCount: HTMLElement;
    level: number = 1;

    constructor() {
        const boardContext = this.getCanvasContextById('board');
        boardContext.canvas.width = WIDTH;
        boardContext.canvas.height = HEIGHT;

        const nextContext = this.getCanvasContextById('next');
        nextContext.canvas.width = SQUARESIZE * 4;
        nextContext.canvas.height = SQUARESIZE * 4;

        const statisticsContext = this.getCanvasContextById('statistics');
        statisticsContext.canvas.width = SQUARESIZE * 6;
        statisticsContext.canvas.height = HEIGHT * 0.9;

        const scoreContext = this.getCanvasContextById('score');
        scoreContext.canvas.width = SQUARESIZE * 4;
        scoreContext.canvas.height = SQUARESIZE * 4;

        this.boardContext = boardContext;
        this.nextContext = nextContext;
        this.statisticsContext = statisticsContext;
        this.scoreContext = scoreContext;

        const linesCount = document.getElementById('lines-count');

        if (!(linesCount instanceof HTMLElement))
            throw new Error('Expected lines-count to be an HTMLElement');

        this.linesCount = linesCount;

        const levelCount = document.getElementById('level-count');

        if (!(levelCount instanceof HTMLElement))
            throw new Error('Expected level-count to be an HTMLElement');

        this.levelCount = levelCount;
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
        squaresize: number = SQUARESIZE,
    ): void {
        context.fillStyle = this.getColor(color);
        context.fillRect(
            x * squaresize,
            y * squaresize,
            squaresize,
            squaresize,
        );
        context.strokeStyle = color ? this.getColor(color - 2) : 'black';
        context.lineWidth = 3;
        context.lineJoin = 'bevel';
        context.strokeRect(
            x * squaresize,
            y * squaresize,
            squaresize,
            squaresize,
        );
        context.strokeStyle = color ? this.getColor(color + 2) : 'black';
        context.lineWidth = 3;
        context.lineJoin = 'bevel';
        context.strokeRect(
            x * squaresize + 1,
            y * squaresize + 1,
            squaresize,
            squaresize,
        );
    }

    renderBoard(board: number[][]) {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                this.drawSquare(x, y, board[y][x]);
            }
        }
    }

    renderScorePanel(topScore: number, score: number) {
        this.clearCanvas(this.scoreContext);

        const height = this.scoreContext.canvas.height;

        this.scoreContext.fillStyle = 'white';
        this.scoreContext.font = '48px VT323';
        this.scoreContext.textAlign = 'left';
        this.scoreContext.textBaseline = 'middle';
        this.scoreContext.fillText('TOP', 2, 16);
        this.scoreContext.fillText(
            this.padNumber(topScore, 6),
            2,
            height * (1 / 4) + 16,
        );
        this.scoreContext.fillText('SCORE', 2, height * (2 / 4) + 16);
        this.scoreContext.fillText(
            this.padNumber(score, 6),
            2,
            height * (3 / 4) + 16,
        );
    }

    renderNextPanel({ blocks }: Piece) {
        this.clearCanvas(this.nextContext);
        const pieceX =
            this.nextContext.canvas.width / (SQUARESIZE * 0.8) / 2 -
            blocks.length / 2;
        const pieceY =
            this.nextContext.canvas.height / (SQUARESIZE * 0.8) / 2 -
            blocks.length / 2 +
            1;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                this.drawSquare(
                    x + pieceX,
                    y + pieceY,
                    blocks[y][x],
                    this.nextContext,
                    SQUARESIZE * 0.8,
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

    renderStatisticsPanel(statistics: { [key: string]: number }) {
        this.clearCanvas(this.statisticsContext);

        this.statisticsContext.fillStyle = 'white';
        this.statisticsContext.font = '48px VT323';
        this.statisticsContext.textAlign = 'center';
        this.statisticsContext.textBaseline = 'middle';
        this.statisticsContext.fillText(
            'STATISTICS',
            this.statisticsContext.canvas.width / 2,
            16,
        );

        let blocksX = 0.5;
        let blocksY = 2;
        let i = 0;

        for (let key in statistics) {
            const blocks = TETROMINOES[key as Tetromino];

            for (let y = 0; y < blocks.length; y++) {
                for (let x = 0; x < blocks[y].length; x++) {
                    this.drawSquare(
                        x + blocksX + (4 - blocks.length) / 2,
                        y + blocksY - (key === 'I' ? 0.5 : 0),
                        blocks[y][x],
                        this.statisticsContext,
                        SQUARESIZE * 0.8,
                    );
                }
            }
            this.statisticsContext.fillStyle = 'white';
            this.statisticsContext.fillText(
                this.padNumber(statistics[key]),
                (blocksX + 5.5) * SQUARESIZE * 0.8,
                (blocksY + 1) * SQUARESIZE * 0.8,
            );

            blocksY += 3;
            i++;
        }
    }

    updateLinesCount(lines: number) {
        this.linesCount.innerText = this.padNumber(lines, 3);
    }

    updateLevel(level: number) {
        this.level = level;
        this.levelCount.innerText = this.padNumber(level, 2);
    }

    padNumber(x: number, padding: number = 3): string {
        let arr = x.toString().split('');

        while (arr.length < padding) {
            arr.unshift('0');
        }

        return arr.join('');
    }

    clearCanvas(context: CanvasRenderingContext2D = this.boardContext) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    getColor(c: number, lightness: number = 0): string {
        if (c === 0) return 'black';
        return `hsl(${(c * 4 + (this.level - 1) * 124) % 360} ${
            c * 5 + 50 + lightness
        }% ${c * 5 + 20}%)`;
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
