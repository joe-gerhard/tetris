import Controller from './controller';
import Game from './game';
import View from './view';

const game = new Game();
const view = new View();
const controller = new Controller(game, view);

controller.init();
