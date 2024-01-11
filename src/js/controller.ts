import Game from './game';
import View from './view';

export default class Controller {
    game: Game;
    view: View;

    constructor(game: Game, view: View) {
        this.game = game;
        this.view = view;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.updateView();
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
                console.log('ArrowUp');
                break;
            default:
        }
    }

    onKeyUp(event: KeyboardEvent) {}

    updateView() {
        const state = this.game.getState();

        this.view.renderBoard(state.board);
    }
}
