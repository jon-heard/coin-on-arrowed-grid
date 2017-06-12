
const HELP_OFFSET_X = 10;
const HELP_OFFSET_Y = 10;
const BOARD_POSITION_X = 10;
const BOARD_POSITION_Y = 90;
const BOARD_INITIAL_SIZE = 10;
const FRAME_RATE = 100;
const BUTTON_START_X = 370;
const BUTTON_PADDING = 10;

/// <reference path="../typings/index.d.ts" />
import PIXI = require('pixi.js');
//import audio = require('pixi-sound');
import { Board } from "./class_board";
import { Tile } from "./class_tile";
import { Ticker } from "./class_ticker";
import { Button } from "./class_button";

// global vars
    // system
    const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(3000, 3000);
    const stage:PIXI.Container = new PIXI.Container();
    
    // game constants
    const coinAnimationFrames = [[0,3,4,0],[0,1,2,0],[0,4,3,0],[0,2,1,0]];
    // game resources
    let resources:any;
    var fontStyle;
    var explosionTextures;
    var coinTextures;
    var helpText;
    // game state
    var board;
    var coin;
    var explosion;
    var ticker;
    var buttons;

function initialize() {
    // System
    document.body.appendChild(renderer.view);
    // Textures
    PIXI.loader
        .add('tile_0', 'images/tile_blue.png')
        .add('tile_1', 'images/tile_green.png')
        .add('arrow_up', 'images/arrow_up.png')
        .add('arrow_right', 'images/arrow_right.png')
        .add('arrow_down', 'images/arrow_down.png')
        .add('arrow_left', 'images/arrow_left.png')
        .add('explosion_1', 'images/explosion_1.png')
        .add('explosion_2', 'images/explosion_2.png')
        .add('explosion_3', 'images/explosion_3.png')
        .add('explosion_4', 'images/explosion_4.png')
        .add('explosion_5', 'images/explosion_5.png')
        .add('coin', 'images/coin.png')
        .add('coin_horizontal1', 'images/coin_horizontal1.png')
        .add('coin_horizontal2', 'images/coin_horizontal2.png')
        .add('coin_vertical1', 'images/coin_vertical1.png')
        .add('coin_vertical2', 'images/coin_vertical2.png')
        .add('button_play', 'images/button_play.png')
        .add('button_pause', 'images/button_pause.png')
        .add('button_shuffle', 'images/button_shuffle.png')
        .add('button_increase', 'images/button_increase.png')
        .add('button_decrease', 'images/button_decrease.png')
        .load(function (loader:PIXI.loaders.Loader, newResources:any) {
            resources = newResources;
            setupUi();
            setupBoard();
            setupCoinAndExplosion();
            setupTicker();
        });
}

function setupUi() {
    // Setup style
    fontStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'white',
    });
    // Setup help text
    helpText = new PIXI.Text(
            "Click on a tile to drop a coin.\n" +
            "A looping path will explode the coin.\n" +
            "Try to find a long path off of the board.", fontStyle);
    helpText.x = HELP_OFFSET_X;
    helpText.y = HELP_OFFSET_Y;
    stage.addChild(helpText);
    buttons = {};
    var positionX = BUTTON_START_X;
    buttons.play = new Button(
            stage, resources.button_play.texture,
            onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.pause = new Button(
            stage, resources.button_pause.texture,
            onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.shuffle = new Button(
            stage, resources.button_shuffle.texture,
            onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.increase = new Button(
            stage, resources.button_increase.texture,
            onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.decrease = new Button(
            stage, resources.button_decrease.texture,
            onButtonClick, positionX, 15);
}

function setupBoard() {
    board = new Board(
            resources, stage, onBoardClick,
            BOARD_INITIAL_SIZE, BOARD_POSITION_X, BOARD_POSITION_Y);
    board.shuffle();
}

function setupCoinAndExplosion() {
    coinTextures = [];
    coinTextures[0] = resources.coin.texture;
    coinTextures[1] = resources.coin_horizontal1.texture;
    coinTextures[2] = resources.coin_horizontal2.texture;
    coinTextures[3] = resources.coin_vertical1.texture;
    coinTextures[4] = resources.coin_vertical2.texture;

    coin = new PIXI.Sprite(resources.coin.texture);
    coin.frame = -1;
    coin.visible = false;
    stage.addChild(coin);

    explosionTextures = [];
    explosionTextures[0] = resources.explosion_1.texture;
    explosionTextures[1] = resources.explosion_2.texture;
    explosionTextures[2] = resources.explosion_3.texture;
    explosionTextures[3] = resources.explosion_4.texture;
    explosionTextures[4] = resources.explosion_5.texture;

    explosion = new PIXI.Sprite(explosionTextures[0]);
    explosion.frame = -1;
    explosion.visible = false;
    stage.addChild(explosion);
}

function setupTicker() {
    ticker = new Ticker(FRAME_RATE, onFrame);
    ticker.play();
}

function onBoardClick(event) {
    var tile = event.target;
    // remove remaining explosion and coin memory
    explosion.visible = false;
    board.clearCoinMemory();
    // place the coin
    coin.tile = tile; 
    coin.position.x = tile.getX();
    coin.position.y = tile.getY();
    coin.direction = tile.getDirection();
    coin.visible = true;
}

function onButtonClick(event) {
    if (event.target == buttons.play) {
        ticker.play();
    } else if (event.target == buttons.pause) {
        ticker.pause();
    } else if (event.target == buttons.shuffle) {
        board.shuffle();
    } else if (event.target == buttons.increase) {
        var size = board.getSize();
        if (size < 15) {
            ++size;
            board.setSize(size);
            board.shuffle();
        }
    } else if (event.target == buttons.decrease) {
        var size = board.getSize();
        if (size > 1) {
            --size;
            board.setSize(size);
            board.shuffle();
        }
    }
}

function onFrame() {
    // animate coin
    if (coin.visible) {
      coin.frame += 1;
      if (coin.frame > 3) { coin.frame = 0; }
      coin.texture = coinTextures[coinAnimationFrames[coin.direction][coin.frame]];
    }
    // handle coin movement
    if (coin.visible && coin.frame == 2 && !explosion.visible) {
        var tile = coin.tile;
        // add to coin trail
          coin.tile.setHasCoinMemory(true);
        // Get new position
        var newTile = tile.getPointedNeighbor();
        // Check for trail loop
        if (newTile != null && newTile.getHasCoinMemory()) {
            explosion.visible = true;
        }
        // Remove coin (if applicable)
        if (!newTile || explosion.visible) {
            board.clearCoinMemory();
            if (!explosion.visible) {
                coin.visible = false;
                coin.frame = -1;
            }
        // move coin
        } else {
            coin.tile = newTile;
            coin.position.x = newTile.getX();
            coin.position.y = newTile.getY();
            coin.direction = newTile.getDirection();
        }
    }
    // animate explosion
    if (explosion.visible) {
        ++explosion.frame;
        // special frames
        if (explosion.frame == 0) {
          explosion.position = coin.position;
        } else if (explosion.frame == 1) {
          coin.visible = false;
          coin.frame = -1;
        }
        // Draw or remove
        if (explosion.frame == 5) {
            explosion.visible = false;
            explosion.frame = -1;
        } else {
            explosion.texture = explosionTextures[explosion.frame];
        }
    }
    renderer.render(stage);
}

initialize();
