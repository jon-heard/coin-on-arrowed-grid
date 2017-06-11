/// <reference path="../typings/index.d.ts" />
import PIXI = require('pixi.js');
//import audio = require('pixi-sound');

// global vars
    // system
    const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(3000, 3000);
    const stage:PIXI.Container = new PIXI.Container();
    // game constants
    const HELP_OFFSET_X = 10;
    const HELP_OFFSET_Y = 10;
    const BOARD_OFFSET_X = 10;
    const BOARD_OFFSET_Y = 70;
    const BOARD_PADDING_X = 4;
    const BOARD_PADDING_Y = 4;
    // game resources
    let resources:any;
    var fontStyle;
    var arrowTextures = [];
    var helpText;
    // game state
    var boardSize = 10;
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
        .add('coin',    'images/coin.png')
        .load(function (loader:PIXI.loaders.Loader, newResources:any) {
            resources = newResources;
            arrowTextures[0] = resources.arrow_up.texture;
            arrowTextures[1] = resources.arrow_right.texture;
            arrowTextures[2] = resources.arrow_down.texture;
            arrowTextures[3] = resources.arrow_left.texture;
            generateUi();
            generateBoard();
            execFrame();
        });
}

function generateUi() {
    // Setup style
    fontStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'white',
    });
    // Setup help text
    helpText = new PIXI.Text("Click on a tile to drop a coin.\nSee how long you can get it to stay before falling off the board.", fontStyle);
    helpText.x = HELP_OFFSET_X;
    helpText.y = HELP_OFFSET_Y;
    stage.addChild(helpText);
    console.log("Helo?");
}

function generateBoard() {
    // Setup sprites
    for (var y = 0; y < boardSize; ++y) {
        board[y] = [];
        for (var x = 0; x < boardSize; ++x) {
            var tileTexture = ((x + y) % 2 == 0) ? resources.tile1.texture : resources.tile2.texture;
            var positionX = x * (64 + BOARD_PADDING_X) + BOARD_OFFSET_X;
            var positionY = y * (64 + BOARD_PADDING_Y) + BOARD_OFFSET_Y;
            board[y][x] = new PIXI.Sprite(tileTexture);
            var tile = board[y][x];
            tile.position.x = positionX;
            tile.position.y = positionY;
            tile.arrow = new PIXI.Sprite(arrowTextures[2]);
            tile.arrowType = 2;
            tile.addChild(tile.arrow);
            tile.interactive = true;
            tile.buttonMode = true;
            tile.on('mouseup', boardClick);
            stage.addChild(tile);
        }
    }
    // Setup neighbor links
    for (var y = 0; y < boardSize; ++y) {
        for (var x = 0; x < boardSize; ++x) {
            var tile = board[y][x];
            tile.neighbor = [];
            if (y > 0)           { tile.neighbor[0] = board[y-1][x]; }
            if (x < boardSize-1) { tile.neighbor[1] = board[y][x+1]; }
            if (y < boardSize-1) { tile.neighbor[2] = board[y+1][x]; }
            if (x > 0)           { tile.neighbor[3] = board[y][x-1]; }
        }
    }
    randomizeBoard();
}

function randomizeBoard() {
    for (var y = 0; y < boardSize; ++y) {
        for (var x = 0; x < boardSize; ++x) {
            var type = Math.floor(Math.random() * 4);
            board[y][x].arrow.texture = arrowTextures[type];
            board[y][x].arrowType = type;
        }
    }
}

function boardClick(event) {
    var tile = event.target;
    tile = tile.neighbor[tile.arrowType];
    if (tile == null) {
    } else {
        tile.coin = new PIXI.Sprite(resources.coin.texture);
        tile.addChild(tile.coin);
    }
}

function execFrame() {
    requestAnimationFrame(execFrame);
    renderer.render(stage);
}

initialize();
