
/// <reference path="../typings/index.d.ts" />
import PIXI = require('pixi.js');
//import audio = require('pixi-sound');
import { Tile } from "./class_tile";

// global vars
    // system
    const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(3000, 3000);
    const stage:PIXI.Container = new PIXI.Container();
    // game constants
    const HELP_OFFSET_X = 10;
    const HELP_OFFSET_Y = 10;
    const BOARD_OFFSET_X = 10;
    const BOARD_OFFSET_Y = 70;
    const BOARD_PADDING_X = 2;
    const BOARD_PADDING_Y = 2;
    const FRAME_SPEED = 100;
    const coinAnimationFrames = [[0,3,4,0],[0,1,2,0],[0,4,3,0],[0,2,1,0]];
    // game resources
    let resources:any;
    var fontStyle;
    var arrowTextures;
    var explosionTextures;
    var coinTextures;
    var helpText;
    // game state
    var boardSize = 10;
    var board = [];
    var coin;
    var explosion;
    var frameTime = 0;

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
        .add('coin',    'images/coin.png')
        .add('coin_horizontal1',    'images/coin_horizontal1.png')
        .add('coin_horizontal2',    'images/coin_horizontal2.png')
        .add('coin_vertical1',    'images/coin_vertical1.png')
        .add('coin_vertical2',    'images/coin_vertical2.png')
        .load(function (loader:PIXI.loaders.Loader, newResources:any) {
            resources = newResources;
            setupTextureResources();
            setupUi();
            setupBoard();
            setupCoinAndExplosion();
            runMainLoop(0);
        });
}

function setupTextureResources() {
    arrowTextures = [];
    arrowTextures[0] = resources.arrow_up.texture;
    arrowTextures[1] = resources.arrow_right.texture;
    arrowTextures[2] = resources.arrow_down.texture;
    arrowTextures[3] = resources.arrow_left.texture;
    explosionTextures = [];
    explosionTextures[0] = resources.explosion_1.texture;
    explosionTextures[1] = resources.explosion_2.texture;
    explosionTextures[2] = resources.explosion_3.texture;
    explosionTextures[3] = resources.explosion_4.texture;
    explosionTextures[4] = resources.explosion_5.texture;
    coinTextures = [];
    coinTextures[0] = resources.coin.texture;
    coinTextures[1] = resources.coin_horizontal1.texture;
    coinTextures[2] = resources.coin_horizontal2.texture;
    coinTextures[3] = resources.coin_vertical1.texture;
    coinTextures[4] = resources.coin_vertical2.texture;
}

function setupUi() {
    // Setup style
    fontStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'white',
    });
    // Setup help text
    helpText = new PIXI.Text("Click on a tile to drop a coin.\nSee quickly you can find the paths off of the board.", fontStyle);
    helpText.x = HELP_OFFSET_X;
    helpText.y = HELP_OFFSET_Y;
    stage.addChild(helpText);
}

function setupBoard() {
    // Setup board sprites
    for (var y = 0; y < boardSize; ++y) {
        board[y] = [];
        for (var x = 0; x < boardSize; ++x) {
            // tile
            var tileType = ((x + y) % 2);
            var positionX = x * (64 + BOARD_PADDING_X) + BOARD_OFFSET_X;
            var positionY = y * (64 + BOARD_PADDING_Y) + BOARD_OFFSET_Y;
            board[y][x] = new Tile(resources, stage, tileType, positionX, positionY, onBoardClick);
        }
    }
    // Setup neighbor links
    for (var y = 0; y < boardSize; ++y) {
        for (var x = 0; x < boardSize; ++x) {
            var tile = board[y][x];
            tile.neighbor = [];
            if (y > 0)           { tile.setNeighbor(0, board[y-1][x]); }
            if (x < boardSize-1) { tile.setNeighbor(1, board[y][x+1]); }
            if (y < boardSize-1) { tile.setNeighbor(2, board[y+1][x]); }
            if (x > 0)           { tile.setNeighbor(3, board[y][x-1]); }
        }
    }
    randomizeBoard();
}

function setupCoinAndExplosion() {
    coin = new PIXI.Sprite(resources.coin.texture);
    coin.frame = -1;
    coin.visible = false;
    stage.addChild(coin);
    explosion = new PIXI.Sprite(explosionTextures[0]);
    explosion.frame = -1;
    explosion.visible = false;
    stage.addChild(explosion);
}

function randomizeBoard() {
    for (var y = 0; y < boardSize; ++y) {
        for (var x = 0; x < boardSize; ++x) {
            var type = Math.floor(Math.random() * 4);
            board[y][x].setArrowType(type);
        }
    }
}

function onBoardClick(event) {
    var tile = event.target.tile;
    // remove the explosion (if still visible)
    explosion.visible = false;
    // place the coin
    coin.tile = tile; 
    coin.position.x = tile.getX();
    coin.position.y = tile.getY();
    coin.direction = tile.getArrowType();
    coin.visible = true;
}

function runFrameLogic() {
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
            for (var y = 0; y < boardSize; ++y) {
                for (var x = 0; x < boardSize; ++x) {
                    board[y][x].setHasCoinMemory(false);
                }
            }
            if (!explosion.visible) {
                coin.visible = false;
                coin.frame = -1;
            }
        // move coin
        } else {
            coin.tile = newTile;
            coin.position.x = newTile.getX();
            coin.position.y = newTile.getY();
            coin.direction = newTile.getArrowType();
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
}

function runMainLoop(timeStamp) {
    // call "runFrameLogic()" at FRAME_SPEED intervals
    if (timeStamp-frameTime > FRAME_SPEED) {
        frameTime = timeStamp;
        runFrameLogic();
    }
    // Render and loop
    renderer.render(stage);
    requestAnimationFrame(runMainLoop);
}

initialize();
