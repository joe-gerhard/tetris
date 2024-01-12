import Game from './game';
import View from './view';

export default class Controller {
    game: Game;
    view: View;
    isPlaying: boolean = false;
    intervalId: number | null = null;
    currentLevel: number = 1;

    constructor(game: Game, view: View) {
        this.game = game;
        this.view = view;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 's':
            case 'ArrowDown':
                event.preventDefault();
                if (this.isPlaying) {
                    this.game.movePieceDown(true);
                    this.updateView();
                }
                break;
            case 'a':
            case 'ArrowLeft':
                event.preventDefault();
                if (this.isPlaying) {
                    this.game.movePieceLeft();
                    this.updateView();
                }
                break;
            case 'd':
            case 'ArrowRight':
                event.preventDefault();
                if (this.isPlaying) {
                    this.game.movePieceRight();
                    this.updateView();
                }
                break;
            case 'w':
            case 'ArrowUp':
                event.preventDefault();
                if (this.isPlaying) {
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case ' ':
                event.preventDefault();
                const { isGameOver } = this.game.getState();

                if (isGameOver) this.reset();
                else if (this.isPlaying) this.pause();
                else this.play();
                break;
            default:
        }
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case 's':
            case 'ArrowDown':
                event.preventDefault();
                break;
            default:
        }
    }

    updateView() {
        const { board, isGameOver, statistics, score, topScore, lines, level } =
            this.game.getState();

        // Force timer to update on level up
        if (level > this.currentLevel) {
            this.stopTimer();
            this.startTimer();
            this.currentLevel = level;
        }

        this.view.updateLinesCount(lines);
        this.view.updateLevel(level);
        this.view.renderBoard(board);
        this.view.renderNextPanel(this.game.nextPiece);
        this.view.renderStatisticsPanel(statistics);
        this.view.renderScorePanel(topScore, score);

        if (isGameOver) {
            this.isPlaying = false;
            this.stopTimer();
            this.view.renderGameOver();
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        }
    }

    startTimer() {
        const speed = 1000 / this.game.level;
        console.log(speed);

        if (!this.intervalId) {
            this.intervalId = setInterval(
                () => {
                    this.tick();
                },
                speed > 50 ? speed : 50,
            );
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    tick() {
        this.game.movePieceDown();
        this.updateView();
    }

    reset() {
        this.game.initialize();
        this.play();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }
}
