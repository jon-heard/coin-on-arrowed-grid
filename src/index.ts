/// <reference path="../typings/index.d.ts" />
import PIXI = require('pixi.js');

// global vars
    // system
    const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(1280, 720);
    const stage:PIXI.Container = new PIXI.Container();
    let resources:any;
    // game constants
    const BOARD_OFFSET_X = 10;
    const BOARD_OFFSET_Y = 50;
    const BOARD_PADDING_X = 4;
    const BOARD_PADDING_Y = 4;
    // game state
    var boardSize = 8;
    // game resources
    var arrowTextures = [];
    var board = [];
function initialize() {
    // System
    document.body.appendChild(renderer.view);
    // Textures
    PIXI.loader
        .add('tile1', 'images/tile_blue.png')
        .add('tile2', 'images/tile_red.png')
        .add('arrow_up', 'images/arrow_up.png')
        .add('arrow_right', 'images/arrow_right.png')
        .add('arrow_down', 'images/arrow_down.png')
        .add('arrow_left', 'images/arrow_left.png')
        .add('chip',    'images/chip.png')
        .load(function (loader:PIXI.loaders.Loader, newResources:any) {
            resources = newResources;
            arrowTextures[0] = resources.arrow_up.texture;
            arrowTextures[1] = resources.arrow_right.texture;
            arrowTextures[2] = resources.arrow_down.texture;
            arrowTextures[3] = resources.arrow_left.texture;
            generateBoard();
            execFrame();
        });
}

function generateBoard() {
    for (var y = 0; y < boardSize; ++y) {
        board[y] = [];
        for (var x = 0; x < boardSize; ++x) {
            var tile = ((x + y) % 2 == 0) ? resources.tile1.texture : resources.tile2.texture;
            var positionX = x * (64 + BOARD_PADDING_X) + BOARD_OFFSET_X;
            var positionY = y * (64 + BOARD_PADDING_Y) + BOARD_OFFSET_Y;
            board[y][x] = new PIXI.Sprite(tile);
            board[y][x].position.x = positionX;
            board[y][x].position.y = positionY;
            board[y][x].arrow = new PIXI.Sprite(arrowTextures[2]);
            board[y][x].arrow.type = 2;
            board[y][x].addChild(board[y][x].arrow);
            stage.addChild(board[y][x]);
        }
    }
}

function execFrame() {
    requestAnimationFrame(execFrame);
    renderer.render(stage);
}

initialize();
