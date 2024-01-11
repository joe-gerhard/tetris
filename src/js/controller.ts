import Game from './game';
import View from './view';

export default class Controller {
    game: Game;
    view: View;
    intervalId: number | null = null;

    constructor(game: Game, view: View) {
        this.game = game;
        this.view = view;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.updateView();
        this.startTimer();
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.game.movePieceDown();
                this.updateView();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.game.movePieceRight();
                this.updateView();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.game.rotatePiece();
                this.updateView();
                break;
            default:
        }
    }

    onKeyUp(event: KeyboardEvent) {}

    updateView() {
        const state = this.game.getState();

        this.view.renderBoard(state.board);
    }

    startTimer() {
        const speed = 1000;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.tick();
            }, speed);
        }
    }

    tick() {
        this.game.movePieceDown();
        this.updateView();
    }
}
