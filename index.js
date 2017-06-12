(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jiboProgrammingChallenge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var BOARD_PADDING_X = 2;
var BOARD_PADDING_Y = 2;
var class_tile_1 = require("./class_tile");
var Board = (function () {
    function Board(resources, stage, onClickCallback, size, x, y) {
        this.x = x;
        this.y = y;
        this.onClickCallback = onClickCallback;
        this.resources = resources;
        this.stage = stage;
        this.setSize(size);
    }
    Board.prototype.shuffle = function () {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                this.tiles[y][x].shuffleDirection();
            }
        }
    };
    Board.prototype.clearCoinMemory = function () {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                this.tiles[y][x].setHasCoinMemory(false);
            }
        }
    };
    Board.prototype.getX = function () { return this.x; };
    Board.prototype.getY = function () { return this.y; };
    Board.prototype.getSize = function () { return this.size; };
    Board.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        this.updateTilePositions();
    };
    Board.prototype.setSize = function (value) {
        // Remove old tiles
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                this.tiles[y][x].destroy();
            }
        }
        // Set new size
        this.size = value;
        // Create tiles
        this.tiles = [];
        for (var y = 0; y < this.size; ++y) {
            this.tiles[y] = [];
            for (var x = 0; x < this.size; ++x) {
                var tileType = ((x + y) % 2);
                this.tiles[y][x] = new class_tile_1.Tile(this.resources, this.stage, tileType, 0, 0, this.onClickCallback);
            }
        }
        // Setup neighbors
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                if (y > 0) {
                    this.tiles[y - 1][x].setNeighbor(2, this.tiles[y][x]);
                }
                if (x > 0) {
                    this.tiles[y][x - 1].setNeighbor(1, this.tiles[y][x]);
                }
                if (y < this.size - 1) {
                    this.tiles[y + 1][x].setNeighbor(0, this.tiles[y][x]);
                }
                if (x < this.size - 1) {
                    this.tiles[y][x + 1].setNeighbor(3, this.tiles[y][x]);
                }
            }
        }
        this.updateTilePositions();
    };
    Board.prototype.updateTilePositions = function () {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                var px = x * (64 + BOARD_PADDING_X) + this.x;
                var py = y * (64 + BOARD_PADDING_Y) + this.y;
                this.tiles[y][x].setPosition(px, py);
            }
        }
    };
    return Board;
}());
exports.Board = Board;
},{"./class_tile":4}],2:[function(require,module,exports){
"use strict";
var DIM_TINT = 0xbbbbbb;
var HOVER_TINT = 0xffffff;
var CLICK_TINT = 0xffff00;
var Button = (function () {
    function Button(stage, texture, onClickCallback, x, y) {
        this.onClickCallback = onClickCallback;
        this.x = x;
        this.y = y;
        this.sprite = new PIXI.Sprite(texture);
        stage.addChild(this.sprite);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.tint = DIM_TINT;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('mouseover', this.onMouseOver.bind(this));
        this.sprite.on('mouseout', this.onMouseOut.bind(this));
        this.sprite.on('mousedown', this.onMouseDown.bind(this));
        this.sprite.on('mouseup', this.onMouseUp.bind(this));
    }
    Button.prototype.onMouseOver = function (event) {
        this.sprite.tint = HOVER_TINT;
    };
    Button.prototype.onMouseOut = function (event) {
        this.sprite.tint = DIM_TINT;
    };
    Button.prototype.onMouseDown = function (event) {
        this.sprite.tint = CLICK_TINT;
    };
    Button.prototype.onMouseUp = function (event) {
        this.sprite.tint = HOVER_TINT;
        event.target = this;
        this.onClickCallback(event);
    };
    Button.prototype.getX = function () { return this.x; };
    Button.prototype.getY = function () { return this.y; };
    Button.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    };
    return Button;
}());
exports.Button = Button;
},{}],3:[function(require,module,exports){
"use strict";
var Ticker = (function () {
    function Ticker(frameRate, onFrameCallback) {
        this.lastFrameTime = 0;
        this.isRunning = false;
        this.frameRate = frameRate;
        this.onFrameCallback = onFrameCallback;
    }
    Ticker.prototype.play = function () {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.tickLoop(0);
    };
    Ticker.prototype.pause = function () {
        this.isRunning = false;
    };
    Ticker.prototype.tickLoop = function (timeStamp) {
        // call <onFrameCallback> at <frameRate> intervals
        if (timeStamp - this.lastFrameTime > this.frameRate) {
            this.lastFrameTime = timeStamp;
            this.onFrameCallback();
        }
        // loop
        if (this.isRunning) {
            requestAnimationFrame(this.tickLoop.bind(this));
        }
    };
    return Ticker;
}());
exports.Ticker = Ticker;
},{}],4:[function(require,module,exports){
"use strict";
var COIN_MEMORY_ALPHA = .35;
var Tile = (function () {
    function Tile(resources, stage, tileType, x, y, onClickCallback, direction) {
        if (direction === void 0) { direction = 0; }
        // static
        if (Tile.arrowTextures == null) {
            Tile.arrowTextures = [];
            Tile.arrowTextures[0] = resources.arrow_up.texture;
            Tile.arrowTextures[1] = resources.arrow_right.texture;
            Tile.arrowTextures[2] = resources.arrow_down.texture;
            Tile.arrowTextures[3] = resources.arrow_left.texture;
        }
        // instance
        // state
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.neighbors = [null, null, null, null];
        this.hasCoinMemory = false;
        this.onClickCallback = onClickCallback;
        // tile
        this.tileSprite = new PIXI.Sprite(resources["tile_" + tileType].texture);
        stage.addChildAt(this.tileSprite, 0);
        this.tileSprite.position.x = x;
        this.tileSprite.position.y = y;
        // arrow
        this.arrowSprite = new PIXI.Sprite(Tile.arrowTextures[direction]);
        this.tileSprite.addChild(this.arrowSprite);
        // Coin memory
        this.coinMemorySprite = new PIXI.Sprite(resources.coin.texture);
        this.tileSprite.addChild(this.coinMemorySprite);
        this.coinMemorySprite.alpha = COIN_MEMORY_ALPHA;
        this.coinMemorySprite.visible = false;
        // mouse
        this.tileSprite.interactive = true;
        this.tileSprite.buttonMode = true;
        this.tileSprite["tile"] = this;
        this.tileSprite.on('mouseup', this.onMouseUp.bind(this));
    }
    Tile.prototype.destroy = function () {
        this.tileSprite.destroy();
        this.arrowSprite.destroy();
        this.coinMemorySprite.destroy();
    };
    Tile.prototype.onMouseUp = function (event) {
        event.target = this;
        this.onClickCallback(event);
    };
    Tile.prototype.getX = function () { return this.x; };
    Tile.prototype.getY = function () { return this.y; };
    Tile.prototype.getDirection = function () { return this.direction; };
    Tile.prototype.getNeighbor = function (index) { return this.neighbors[index]; };
    Tile.prototype.getPointedNeighbor = function () { return this.neighbors[this.direction]; };
    Tile.prototype.getHasCoinMemory = function () { return this.hasCoinMemory; };
    Tile.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        this.tileSprite.position.x = x;
        this.tileSprite.position.y = y;
    };
    Tile.prototype.shuffleDirection = function () {
        var direction = Math.floor(Math.random() * 4);
        this.setDirection(direction);
    };
    Tile.prototype.setDirection = function (value) {
        if (value < 0 || value > 3) {
            return;
        } // TODO: Error reporting
        this.direction = value;
        this.arrowSprite.texture = Tile.arrowTextures[value];
    };
    Tile.prototype.setNeighbor = function (index, neighbor) {
        if (index < 0 || index > 3) {
            return;
        } // TODO: Error reporting
        this.neighbors[index] = neighbor;
    };
    Tile.prototype.setHasCoinMemory = function (value) {
        this.hasCoinMemory = value;
        this.coinMemorySprite.visible = value;
    };
    return Tile;
}());
exports.Tile = Tile;
},{}],5:[function(require,module,exports){
"use strict";
var HELP_OFFSET_X = 10;
var HELP_OFFSET_Y = 10;
var BOARD_POSITION_X = 30;
var BOARD_POSITION_Y = 90;
var BOARD_INITIAL_SIZE = 10;
var FRAME_RATE = 100;
var BUTTON_START_X = 360;
var BUTTON_PADDING = 10;
/// <reference path="../typings/index.d.ts" />
var PIXI = require('pixi.js');
//import audio = require('pixi-sound');
var class_board_1 = require("./class_board");
var class_ticker_1 = require("./class_ticker");
var class_button_1 = require("./class_button");
// global vars
// system
var renderer = new PIXI.WebGLRenderer(3000, 3000);
var stage = new PIXI.Container();
// game constants
var coinAnimationFrames = [[0, 3, 4, 0], [0, 1, 2, 0], [0, 4, 3, 0], [0, 2, 1, 0]];
// game resources
var resources;
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
        .load(function (loader, newResources) {
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
        fill: 'white'
    });
    // Setup help text
    helpText = new PIXI.Text("Click on a tile to drop a coin.\n" +
        "A looping path will explode the coin.\n" +
        "Try to find a long path off of the board.", fontStyle);
    helpText.x = HELP_OFFSET_X;
    helpText.y = HELP_OFFSET_Y;
    stage.addChild(helpText);
    buttons = {};
    var positionX = BUTTON_START_X;
    buttons.play = new class_button_1.Button(stage, resources.button_play.texture, onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.pause = new class_button_1.Button(stage, resources.button_pause.texture, onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.shuffle = new class_button_1.Button(stage, resources.button_shuffle.texture, onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.increase = new class_button_1.Button(stage, resources.button_increase.texture, onButtonClick, positionX, 15);
    positionX += 64 + BUTTON_PADDING;
    buttons.decrease = new class_button_1.Button(stage, resources.button_decrease.texture, onButtonClick, positionX, 15);
}
function setupBoard() {
    board = new class_board_1.Board(resources, stage, onBoardClick, BOARD_INITIAL_SIZE, BOARD_POSITION_X, BOARD_POSITION_Y);
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
    ticker = new class_ticker_1.Ticker(FRAME_RATE, onFrame);
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
    }
    else if (event.target == buttons.pause) {
        ticker.pause();
    }
    else if (event.target == buttons.shuffle) {
        board.shuffle();
    }
    else if (event.target == buttons.increase) {
        var size = board.getSize();
        if (size < 15) {
            ++size;
            board.setSize(size);
            board.shuffle();
        }
    }
    else if (event.target == buttons.decrease) {
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
        if (coin.frame > 3) {
            coin.frame = 0;
        }
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
        }
        else {
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
        }
        else if (explosion.frame == 1) {
            coin.visible = false;
            coin.frame = -1;
        }
        // Draw or remove
        if (explosion.frame == 5) {
            explosion.visible = false;
            explosion.frame = -1;
        }
        else {
            explosion.texture = explosionTextures[explosion.frame];
        }
    }
    renderer.render(stage);
}
initialize();
},{"./class_board":1,"./class_button":2,"./class_ticker":3,"pixi.js":undefined}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2NsYXNzX2JvYXJkLnRzIiwic3JjL2NsYXNzX2J1dHRvbi50cyIsInNyYy9jbGFzc190aWNrZXIudHMiLCJzcmMvY2xhc3NfdGlsZS50cyIsInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNDQSxJQUFNLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDMUIsSUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBRTFCLDJCQUFxQixjQUFjLENBQUMsQ0FBQTtBQUVwQztJQUNJLGVBQ1EsU0FBUyxFQUFFLEtBQXNCLEVBQ2pDLGVBQWUsRUFDZixJQUFhLEVBQUUsQ0FBVSxFQUFFLENBQVU7UUFDekMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFB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QUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUM7Z0JBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUM7Z0JBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQztnQkFDN0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFBQyxDQUFDO1lBQ2pGLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVPLG1DQUFtQixHQUEzQjtRQUNJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLGVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFXTCxZQUFDO0FBQUQsQ0ExRkEsQUEwRkMsSUFBQTtBQTFGWSxhQUFLLFFBMEZqQixDQUFBOzs7QUMvRkQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzFCLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUM1QixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFFNUI7SUFDSSxnQkFDUSxLQUFzQixFQUFFLE9BQXNCLEVBQzlDLGVBQWUsRUFBRSxDQUFVLEVBQUUsQ0FBVTtRQUMzQyxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSw0QkFBVyxHQUFsQixVQUFtQixLQUFLO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sMkJBQVUsR0FBakIsVUFBa0IsS0FBSztRQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7SUFDaEMsQ0FB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RyxDQUFDLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBQ0QsaUJBQWlCO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixTQUFTLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUMxQixTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFNBQVMsQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDTCxDQUFDO0lBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsVUFBVSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbmNvbnN0IEJPQVJEX1BBRERJTkdfWCA9IDI7XHJcbmNvbnN0IEJPQVJEX1BBRERJTkdfWSA9IDI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vY2xhc3NfdGlsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvYXJkIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcmVzb3VyY2VzLCBzdGFnZSA6IFBJWEkuQ29udGFpbmVyLFxyXG4gICAgICAgICAgICBvbkNsaWNrQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIHNpemUgOiBudW1iZXIsIHggOiBudW1iZXIsIHkgOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ2FsbGJhY2sgPSBvbkNsaWNrQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZShzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2h1ZmZsZSgpIHtcclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgKyt5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5zaXplOyArK3gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGlsZXNbeV1beF0uc2h1ZmZsZURpcmVjdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhckNvaW5NZW1vcnkoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNpemU7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuc2l6ZTsgKyt4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbGVzW3ldW3hdLnNldEhhc0NvaW5NZW1vcnkoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRYKCkgOiBudW1iZXIgeyByZXR1cm4gdGhpcy54OyB9XHJcbiAgICBwdWJsaWMgZ2V0WSgpIDogbnVtYmVyIHsgcmV0dXJuIHRoaXMueTsgfVxyXG4gICAgcHVibGljIGdldFNpemUoKSA6IG51bWJlciB7IHJldHVybiB0aGlzLnNpemU7IH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UG9zaXRpb24oeCA6IG51bWJlciwgeSA6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbGVQb3NpdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0U2l6ZSh2YWx1ZSA6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFJlbW92ZSBvbGQgdGlsZXNcclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgKyt5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5zaXplOyArK3gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGlsZXNbeV1beF0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldCBuZXcgc2l6ZVxyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgIC8vIENyZWF0ZSB0aWxlc1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgKyt5KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXNbeV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLnNpemU7ICsreCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbGVUeXBlID0gKCh4ICsgeSkgJSAyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGlsZXNbeV1beF0gPSBuZXcgVGlsZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMsIHRoaXMuc3RhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVUeXBlLCAwLCAwLCB0aGlzLm9uQ2xpY2tDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2V0dXAgbmVpZ2hib3JzXHJcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNpemU7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuc2l6ZTsgKyt4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeSA+IDApIHsgdGhpcy50aWxlc1t5LTFdW3hdLnNldE5laWdoYm9yKDIsIHRoaXMudGlsZXNbeV1beF0pOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDApIHsgdGhpcy50aWxlc1t5XVt4LTFdLnNldE5laWdoYm9yKDEsIHRoaXMudGlsZXNbeV1beF0pOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoeSA8IHRoaXMuc2l6ZS0xKSB7IHRoaXMudGlsZXNbeSsxXVt4XS5zZXROZWlnaGJvcigwLCB0aGlzLnRpbGVzW3ldW3hdKTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHggPCB0aGlzLnNpemUtMSkgeyB0aGlzLnRpbGVzW3ldW3grMV0uc2V0TmVpZ2hib3IoMywgdGhpcy50aWxlc1t5XVt4XSk7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbGVQb3NpdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVRpbGVQb3NpdGlvbnMoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNpemU7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuc2l6ZTsgKyt4KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHggPSB4ICogKDY0ICsgQk9BUkRfUEFERElOR19YKSArIHRoaXMueDtcclxuICAgICAgICAgICAgICAgIHZhciBweSA9IHkgKiAoNjQgKyBCT0FSRF9QQURESU5HX1kpICsgdGhpcy55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aWxlc1t5XVt4XS5zZXRQb3NpdGlvbihweCxweSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RhdGVcclxuICAgIHByaXZhdGUgeCA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgeSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgc2l6ZSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgb25DbGlja0NhbGxiYWNrO1xyXG4gICAgcHJpdmF0ZSB0aWxlcyA6IEFycmF5PEFycmF5PFRpbGU+PjtcclxuICAgIC8vIHN5c3RlbVxyXG4gICAgcHJpdmF0ZSByZXNvdXJjZXM7XHJcbiAgICBwcml2YXRlIHN0YWdlIDogUElYSS5Db250YWluZXI7XHJcbn0iLCJcclxuY29uc3QgRElNX1RJTlQgPSAweGJiYmJiYjtcclxuY29uc3QgSE9WRVJfVElOVCA9IDB4ZmZmZmZmO1xyXG5jb25zdCBDTElDS19USU5UID0gMHhmZmZmMDA7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgc3RhZ2UgOiBQSVhJLkNvbnRhaW5lciwgdGV4dHVyZSA6IFBJWEkuVGV4dHVyZSxcclxuICAgICAgICAgICAgb25DbGlja0NhbGxiYWNrLCB4IDogbnVtYmVyLCB5IDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ2FsbGJhY2sgPSBvbkNsaWNrQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKHRleHR1cmUpO1xyXG4gICAgICAgIHN0YWdlLmFkZENoaWxkKHRoaXMuc3ByaXRlKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ID0geDtcclxuICAgICAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi55ID0geTtcclxuICAgICAgICB0aGlzLnNwcml0ZS50aW50ID0gRElNX1RJTlQ7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLmJ1dHRvbk1vZGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLm9uKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2VPdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLm9uKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU91dC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5vbignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1vdXNlT3ZlcihldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnRpbnQgPSBIT1ZFUl9USU5UO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1vdXNlT3V0KGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUudGludCA9IERJTV9USU5UO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1vdXNlRG93bihldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnRpbnQgPSBDTElDS19USU5UO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1vdXNlVXAoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZS50aW50ID0gSE9WRVJfVElOVDtcclxuICAgICAgICBldmVudC50YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub25DbGlja0NhbGxiYWNrKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0WCgpIHsgcmV0dXJuIHRoaXMueDsgfVxyXG4gICAgcHVibGljIGdldFkoKSB7IHJldHVybiB0aGlzLnk7IH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UG9zaXRpb24oeCA6IG51bWJlciwgeSA6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ID0geDtcclxuICAgICAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi55ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwcml0ZSA6IFBJWEkuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBvbkNsaWNrQ2FsbGJhY2s7XHJcbiAgICBwcml2YXRlIHggOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHkgOiBudW1iZXI7XHJcbn1cclxuIiwiXHJcbmV4cG9ydCBjbGFzcyBUaWNrZXIge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGZyYW1lUmF0ZSA6IG51bWJlciwgb25GcmFtZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0RnJhbWVUaW1lID0gMDtcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xyXG4gICAgICAgIHRoaXMub25GcmFtZUNhbGxiYWNrID0gb25GcmFtZUNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy50aWNrTG9vcCgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGF1c2UoKSB7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdGlja0xvb3AodGltZVN0YW1wKSB7XHJcbiAgICAgICAgLy8gY2FsbCA8b25GcmFtZUNhbGxiYWNrPiBhdCA8ZnJhbWVSYXRlPiBpbnRlcnZhbHNcclxuICAgICAgICBpZiAodGltZVN0YW1wLXRoaXMubGFzdEZyYW1lVGltZSA+IHRoaXMuZnJhbWVSYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdEZyYW1lVGltZSA9IHRpbWVTdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5vbkZyYW1lQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbG9vcFxyXG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrTG9vcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1J1bm5pbmcgOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBsYXN0RnJhbWVUaW1lIDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBmcmFtZVJhdGUgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIG9uRnJhbWVDYWxsYmFjaztcclxufVxyXG4iLCJcclxuY29uc3QgQ09JTl9NRU1PUllfQUxQSEEgPSAuMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcmVzb3VyY2VzLCBzdGFnZSA6IFBJWEkuQ29udGFpbmVyLFxyXG4gICAgICAgICAgICB0aWxlVHlwZSA6IG51bWJlciwgeCA6IG51bWJlciwgeSA6IG51bWJlcixcclxuICAgICAgICAgICAgb25DbGlja0NhbGxiYWNrLCBkaXJlY3Rpb24gOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgLy8gc3RhdGljXHJcbiAgICAgICAgaWYgKFRpbGUuYXJyb3dUZXh0dXJlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIFRpbGUuYXJyb3dUZXh0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICBUaWxlLmFycm93VGV4dHVyZXNbMF0gPSByZXNvdXJjZXMuYXJyb3dfdXAudGV4dHVyZTtcclxuICAgICAgICAgICAgVGlsZS5hcnJvd1RleHR1cmVzWzFdID0gcmVzb3VyY2VzLmFycm93X3JpZ2h0LnRleHR1cmU7XHJcbiAgICAgICAgICAgIFRpbGUuYXJyb3dUZXh0dXJlc1syXSA9IHJlc291cmNlcy5hcnJvd19kb3duLnRleHR1cmU7XHJcbiAgICAgICAgICAgIFRpbGUuYXJyb3dUZXh0dXJlc1szXSA9IHJlc291cmNlcy5hcnJvd19sZWZ0LnRleHR1cmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpbnN0YW5jZVxyXG4gICAgICAgICAgICAvLyBzdGF0ZVxyXG4gICAgICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvcnMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ29pbk1lbW9yeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2tDYWxsYmFjayA9IG9uQ2xpY2tDYWxsYmFjaztcclxuICAgICAgICAgICAgLy8gdGlsZVxyXG4gICAgICAgICAgICB0aGlzLnRpbGVTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUocmVzb3VyY2VzW1widGlsZV9cIiArIHRpbGVUeXBlXS50ZXh0dXJlKTtcclxuICAgICAgICAgICAgc3RhZ2UuYWRkQ2hpbGRBdCh0aGlzLnRpbGVTcHJpdGUsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVTcHJpdGUucG9zaXRpb24ueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZVNwcml0ZS5wb3NpdGlvbi55ID0geTtcclxuICAgICAgICAgICAgLy8gYXJyb3dcclxuICAgICAgICAgICAgdGhpcy5hcnJvd1Nwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShUaWxlLmFycm93VGV4dHVyZXNbZGlyZWN0aW9uXSk7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZVNwcml0ZS5hZGRDaGlsZCh0aGlzLmFycm93U3ByaXRlKTtcclxuICAgICAgICAgICAgLy8gQ29pbiBtZW1vcnlcclxuICAgICAgICAgICAgdGhpcy5jb2luTWVtb3J5U3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKHJlc291cmNlcy5jb2luLnRleHR1cmUpO1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVTcHJpdGUuYWRkQ2hpbGQodGhpcy5jb2luTWVtb3J5U3ByaXRlKTtcclxuICAgICAgICAgICAgdGhpcy5jb2luTWVtb3J5U3ByaXRlLmFscGhhID0gQ09JTl9NRU1PUllfQUxQSEE7XHJcbiAgICAgICAgICAgIHRoaXMuY29pbk1lbW9yeVNwcml0ZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIG1vdXNlXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVNwcml0ZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZVNwcml0ZS5idXR0b25Nb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy50aWxlU3ByaXRlW1widGlsZVwiXSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZVNwcml0ZS5vbignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMudGlsZVNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5hcnJvd1Nwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jb2luTWVtb3J5U3ByaXRlLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Nb3VzZVVwKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0ID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uQ2xpY2tDYWxsYmFjayhldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFgoKSA6IG51bWJlciB7IHJldHVybiB0aGlzLng7IH1cclxuICAgIHB1YmxpYyBnZXRZKCkgOiBudW1iZXIgeyByZXR1cm4gdGhpcy55OyB9XHJcbiAgICBwdWJsaWMgZ2V0RGlyZWN0aW9uKCkgOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kaXJlY3Rpb247IH1cclxuICAgIHB1YmxpYyBnZXROZWlnaGJvcihpbmRleCA6IG51bWJlcikgOiBUaWxlIHsgcmV0dXJuIHRoaXMubmVpZ2hib3JzW2luZGV4XTsgfVxyXG4gICAgcHVibGljIGdldFBvaW50ZWROZWlnaGJvcigpIDogVGlsZSB7IHJldHVybiB0aGlzLm5laWdoYm9yc1t0aGlzLmRpcmVjdGlvbl07IH1cclxuICAgIHB1YmxpYyBnZXRIYXNDb2luTWVtb3J5KCkgOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQ29pbk1lbW9yeTsgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQb3NpdGlvbih4IDogbnVtYmVyLCB5IDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudGlsZVNwcml0ZS5wb3NpdGlvbi54ID0geDtcclxuICAgICAgICB0aGlzLnRpbGVTcHJpdGUucG9zaXRpb24ueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNodWZmbGVEaXJlY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xyXG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERpcmVjdGlvbih2YWx1ZSA6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiAzKSB7IHJldHVybjsgfSAvLyBUT0RPOiBFcnJvciByZXBvcnRpbmdcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuYXJyb3dTcHJpdGUudGV4dHVyZSA9IFRpbGUuYXJyb3dUZXh0dXJlc1t2YWx1ZV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE5laWdoYm9yKGluZGV4IDogbnVtYmVyLCBuZWlnaGJvciA6IFRpbGUpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gMykgeyByZXR1cm47IH0gLy8gVE9ETzogRXJyb3IgcmVwb3J0aW5nXHJcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNbaW5kZXhdID0gbmVpZ2hib3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEhhc0NvaW5NZW1vcnkodmFsdWUgOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2luTWVtb3J5ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb2luTWVtb3J5U3ByaXRlLnZpc2libGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGF0ZVxyXG4gICAgcHJpdmF0ZSB4IDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB5IDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBkaXJlY3Rpb24gOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIG5laWdoYm9ycyA6IEFycmF5PFRpbGU+O1xyXG4gICAgcHJpdmF0ZSBoYXNDb2luTWVtb3J5IDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgb25DbGlja0NhbGxiYWNrO1xyXG4gICAgLy8gTWVkaWFcclxuICAgIHByaXZhdGUgdGlsZVNwcml0ZSA6IFBJWEkuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBhcnJvd1Nwcml0ZSA6IFBJWEkuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBjb2luTWVtb3J5U3ByaXRlIDogUElYSS5TcHJpdGU7XHJcbiAgICAvLyBTdGF0aWNcclxuICAgIHN0YXRpYyBhcnJvd1RleHR1cmVzIDogQXJyYXk8UElYSS5UZXh0dXJlPjtcclxufVxyXG4iLCJcclxuY29uc3QgSEVMUF9PRkZTRVRfWCA9IDEwO1xyXG5jb25zdCBIRUxQX09GRlNFVF9ZID0gMTA7XHJcbmNvbnN0IEJPQVJEX1BPU0lUSU9OX1ggPSAzMDtcclxuY29uc3QgQk9BUkRfUE9TSVRJT05fWSA9IDkwO1xyXG5jb25zdCBCT0FSRF9JTklUSUFMX1NJWkUgPSAxMDtcclxuY29uc3QgRlJBTUVfUkFURSA9IDEwMDtcclxuY29uc3QgQlVUVE9OX1NUQVJUX1ggPSAzNjA7XHJcbmNvbnN0IEJVVFRPTl9QQURESU5HID0gMTA7XHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuaW1wb3J0IFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJyk7XHJcbi8vaW1wb3J0IGF1ZGlvID0gcmVxdWlyZSgncGl4aS1zb3VuZCcpO1xyXG5pbXBvcnQgeyBCb2FyZCB9IGZyb20gXCIuL2NsYXNzX2JvYXJkXCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi9jbGFzc190aWxlXCI7XHJcbmltcG9ydCB7IFRpY2tlciB9IGZyb20gXCIuL2NsYXNzX3RpY2tlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi9jbGFzc19idXR0b25cIjtcclxuXHJcbi8vIGdsb2JhbCB2YXJzXHJcbiAgICAvLyBzeXN0ZW1cclxuICAgIGNvbnN0IHJlbmRlcmVyOlBJWEkuV2ViR0xSZW5kZXJlciA9IG5ldyBQSVhJLldlYkdMUmVuZGVyZXIoMzAwMCwgMzAwMCk7XHJcbiAgICBjb25zdCBzdGFnZTpQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgXHJcbiAgICAvLyBnYW1lIGNvbnN0YW50c1xyXG4gICAgY29uc3QgY29pbkFuaW1hdGlvbkZyYW1lcyA9IFtbMCwzLDQsMF0sWzAsMSwyLDBdLFswLDQsMywwXSxbMCwyLDEsMF1dO1xyXG4gICAgLy8gZ2FtZSByZXNvdXJjZXNcclxuICAgIGxldCByZXNvdXJjZXM6YW55O1xyXG4gICAgdmFyIGZvbnRTdHlsZTtcclxuICAgIHZhciBleHBsb3Npb25UZXh0dXJlcztcclxuICAgIHZhciBjb2luVGV4dHVyZXM7XHJcbiAgICB2YXIgaGVscFRleHQ7XHJcbiAgICAvLyBnYW1lIHN0YXRlXHJcbiAgICB2YXIgYm9hcmQ7XHJcbiAgICB2YXIgY29pbjtcclxuICAgIHZhciBleHBsb3Npb247XHJcbiAgICB2YXIgdGlja2VyO1xyXG4gICAgdmFyIGJ1dHRvbnM7XHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgLy8gU3lzdGVtXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xyXG4gICAgLy8gVGV4dHVyZXNcclxuICAgIFBJWEkubG9hZGVyXHJcbiAgICAgICAgLmFkZCgndGlsZV8wJywgJ2ltYWdlcy90aWxlX2JsdWUucG5nJylcclxuICAgICAgICAuYWRkKCd0aWxlXzEnLCAnaW1hZ2VzL3RpbGVfZ3JlZW4ucG5nJylcclxuICAgICAgICAuYWRkKCdhcnJvd191cCcsICdpbWFnZXMvYXJyb3dfdXAucG5nJylcclxuICAgICAgICAuYWRkKCdhcnJvd19yaWdodCcsICdpbWFnZXMvYXJyb3dfcmlnaHQucG5nJylcclxuICAgICAgICAuYWRkKCdhcnJvd19kb3duJywgJ2ltYWdlcy9hcnJvd19kb3duLnBuZycpXHJcbiAgICAgICAgLmFkZCgnYXJyb3dfbGVmdCcsICdpbWFnZXMvYXJyb3dfbGVmdC5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2V4cGxvc2lvbl8xJywgJ2ltYWdlcy9leHBsb3Npb25fMS5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2V4cGxvc2lvbl8yJywgJ2ltYWdlcy9leHBsb3Npb25fMi5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2V4cGxvc2lvbl8zJywgJ2ltYWdlcy9leHBsb3Npb25fMy5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2V4cGxvc2lvbl80JywgJ2ltYWdlcy9leHBsb3Npb25fNC5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2V4cGxvc2lvbl81JywgJ2ltYWdlcy9leHBsb3Npb25fNS5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2NvaW4nLCAnaW1hZ2VzL2NvaW4ucG5nJylcclxuICAgICAgICAuYWRkKCdjb2luX2hvcml6b250YWwxJywgJ2ltYWdlcy9jb2luX2hvcml6b250YWwxLnBuZycpXHJcbiAgICAgICAgLmFkZCgnY29pbl9ob3Jpem9udGFsMicsICdpbWFnZXMvY29pbl9ob3Jpem9udGFsMi5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2NvaW5fdmVydGljYWwxJywgJ2ltYWdlcy9jb2luX3ZlcnRpY2FsMS5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2NvaW5fdmVydGljYWwyJywgJ2ltYWdlcy9jb2luX3ZlcnRpY2FsMi5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2J1dHRvbl9wbGF5JywgJ2ltYWdlcy9idXR0b25fcGxheS5wbmcnKVxyXG4gICAgICAgIC5hZGQoJ2J1dHRvbl9wYXVzZScsICdpbWFnZXMvYnV0dG9uX3BhdXNlLnBuZycpXHJcbiAgICAgICAgLmFkZCgnYnV0dG9uX3NodWZmbGUnLCAnaW1hZ2VzL2J1dHRvbl9zaHVmZmxlLnBuZycpXHJcbiAgICAgICAgLmFkZCgnYnV0dG9uX2luY3JlYXNlJywgJ2ltYWdlcy9idXR0b25faW5jcmVhc2UucG5nJylcclxuICAgICAgICAuYWRkKCdidXR0b25fZGVjcmVhc2UnLCAnaW1hZ2VzL2J1dHRvbl9kZWNyZWFzZS5wbmcnKVxyXG4gICAgICAgIC5sb2FkKGZ1bmN0aW9uIChsb2FkZXI6UElYSS5sb2FkZXJzLkxvYWRlciwgbmV3UmVzb3VyY2VzOmFueSkge1xyXG4gICAgICAgICAgICByZXNvdXJjZXMgPSBuZXdSZXNvdXJjZXM7XHJcbiAgICAgICAgICAgIHNldHVwVWkoKTtcclxuICAgICAgICAgICAgc2V0dXBCb2FyZCgpO1xyXG4gICAgICAgICAgICBzZXR1cENvaW5BbmRFeHBsb3Npb24oKTtcclxuICAgICAgICAgICAgc2V0dXBUaWNrZXIoKTtcclxuICAgICAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBVaSgpIHtcclxuICAgIC8vIFNldHVwIHN0eWxlXHJcbiAgICBmb250U3R5bGUgPSBuZXcgUElYSS5UZXh0U3R5bGUoe1xyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdBcmlhbCcsXHJcbiAgICAgICAgZm9udFNpemU6IDIwLFxyXG4gICAgICAgIGZpbGw6ICd3aGl0ZScsXHJcbiAgICB9KTtcclxuICAgIC8vIFNldHVwIGhlbHAgdGV4dFxyXG4gICAgaGVscFRleHQgPSBuZXcgUElYSS5UZXh0KFxyXG4gICAgICAgICAgICBcIkNsaWNrIG9uIGEgdGlsZSB0byBkcm9wIGEgY29pbi5cXG5cIiArXHJcbiAgICAgICAgICAgIFwiQSBsb29waW5nIHBhdGggd2lsbCBleHBsb2RlIHRoZSBjb2luLlxcblwiICtcclxuICAgICAgICAgICAgXCJUcnkgdG8gZmluZCBhIGxvbmcgcGF0aCBvZmYgb2YgdGhlIGJvYXJkLlwiLCBmb250U3R5bGUpO1xyXG4gICAgaGVscFRleHQueCA9IEhFTFBfT0ZGU0VUX1g7XHJcbiAgICBoZWxwVGV4dC55ID0gSEVMUF9PRkZTRVRfWTtcclxuICAgIHN0YWdlLmFkZENoaWxkKGhlbHBUZXh0KTtcclxuICAgIGJ1dHRvbnMgPSB7fTtcclxuICAgIHZhciBwb3NpdGlvblggPSBCVVRUT05fU1RBUlRfWDtcclxuICAgIGJ1dHRvbnMucGxheSA9IG5ldyBCdXR0b24oXHJcbiAgICAgICAgICAgIHN0YWdlLCByZXNvdXJjZXMuYnV0dG9uX3BsYXkudGV4dHVyZSxcclxuICAgICAgICAgICAgb25CdXR0b25DbGljaywgcG9zaXRpb25YLCAxNSk7XHJcbiAgICBwb3NpdGlvblggKz0gNjQgKyBCVVRUT05fUEFERElORztcclxuICAgIGJ1dHRvbnMucGF1c2UgPSBuZXcgQnV0dG9uKFxyXG4gICAgICAgICAgICBzdGFnZSwgcmVzb3VyY2VzLmJ1dHRvbl9wYXVzZS50ZXh0dXJlLFxyXG4gICAgICAgICAgICBvbkJ1dHRvbkNsaWNrLCBwb3NpdGlvblgsIDE1KTtcclxuICAgIHBvc2l0aW9uWCArPSA2NCArIEJVVFRPTl9QQURESU5HO1xyXG4gICAgYnV0dG9ucy5zaHVmZmxlID0gbmV3IEJ1dHRvbihcclxuICAgICAgICAgICAgc3RhZ2UsIHJlc291cmNlcy5idXR0b25fc2h1ZmZsZS50ZXh0dXJlLFxyXG4gICAgICAgICAgICBvbkJ1dHRvbkNsaWNrLCBwb3NpdGlvblgsIDE1KTtcclxuICAgIHBvc2l0aW9uWCArPSA2NCArIEJVVFRPTl9QQURESU5HO1xyXG4gICAgYnV0dG9ucy5pbmNyZWFzZSA9IG5ldyBCdXR0b24oXHJcbiAgICAgICAgICAgIHN0YWdlLCByZXNvdXJjZXMuYnV0dG9uX2luY3JlYXNlLnRleHR1cmUsXHJcbiAgICAgICAgICAgIG9uQnV0dG9uQ2xpY2ssIHBvc2l0aW9uWCwgMTUpO1xyXG4gICAgcG9zaXRpb25YICs9IDY0ICsgQlVUVE9OX1BBRERJTkc7XHJcbiAgICBidXR0b25zLmRlY3JlYXNlID0gbmV3IEJ1dHRvbihcclxuICAgICAgICAgICAgc3RhZ2UsIHJlc291cmNlcy5idXR0b25fZGVjcmVhc2UudGV4dHVyZSxcclxuICAgICAgICAgICAgb25CdXR0b25DbGljaywgcG9zaXRpb25YLCAxNSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwQm9hcmQoKSB7XHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZChcclxuICAgICAgICAgICAgcmVzb3VyY2VzLCBzdGFnZSwgb25Cb2FyZENsaWNrLFxyXG4gICAgICAgICAgICBCT0FSRF9JTklUSUFMX1NJWkUsIEJPQVJEX1BPU0lUSU9OX1gsIEJPQVJEX1BPU0lUSU9OX1kpO1xyXG4gICAgYm9hcmQuc2h1ZmZsZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cENvaW5BbmRFeHBsb3Npb24oKSB7XHJcbiAgICBjb2luVGV4dHVyZXMgPSBbXTtcclxuICAgIGNvaW5UZXh0dXJlc1swXSA9IHJlc291cmNlcy5jb2luLnRleHR1cmU7XHJcbiAgICBjb2luVGV4dHVyZXNbMV0gPSByZXNvdXJjZXMuY29pbl9ob3Jpem9udGFsMS50ZXh0dXJlO1xyXG4gICAgY29pblRleHR1cmVzWzJdID0gcmVzb3VyY2VzLmNvaW5faG9yaXpvbnRhbDIudGV4dHVyZTtcclxuICAgIGNvaW5UZXh0dXJlc1szXSA9IHJlc291cmNlcy5jb2luX3ZlcnRpY2FsMS50ZXh0dXJlO1xyXG4gICAgY29pblRleHR1cmVzWzRdID0gcmVzb3VyY2VzLmNvaW5fdmVydGljYWwyLnRleHR1cmU7XHJcblxyXG4gICAgY29pbiA9IG5ldyBQSVhJLlNwcml0ZShyZXNvdXJjZXMuY29pbi50ZXh0dXJlKTtcclxuICAgIGNvaW4uZnJhbWUgPSAtMTtcclxuICAgIGNvaW4udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgc3RhZ2UuYWRkQ2hpbGQoY29pbik7XHJcblxyXG4gICAgZXhwbG9zaW9uVGV4dHVyZXMgPSBbXTtcclxuICAgIGV4cGxvc2lvblRleHR1cmVzWzBdID0gcmVzb3VyY2VzLmV4cGxvc2lvbl8xLnRleHR1cmU7XHJcbiAgICBleHBsb3Npb25UZXh0dXJlc1sxXSA9IHJlc291cmNlcy5leHBsb3Npb25fMi50ZXh0dXJlO1xyXG4gICAgZXhwbG9zaW9uVGV4dHVyZXNbMl0gPSByZXNvdXJjZXMuZXhwbG9zaW9uXzMudGV4dHVyZTtcclxuICAgIGV4cGxvc2lvblRleHR1cmVzWzNdID0gcmVzb3VyY2VzLmV4cGxvc2lvbl80LnRleHR1cmU7XHJcbiAgICBleHBsb3Npb25UZXh0dXJlc1s0XSA9IHJlc291cmNlcy5leHBsb3Npb25fNS50ZXh0dXJlO1xyXG5cclxuICAgIGV4cGxvc2lvbiA9IG5ldyBQSVhJLlNwcml0ZShleHBsb3Npb25UZXh0dXJlc1swXSk7XHJcbiAgICBleHBsb3Npb24uZnJhbWUgPSAtMTtcclxuICAgIGV4cGxvc2lvbi52aXNpYmxlID0gZmFsc2U7XHJcbiAgICBzdGFnZS5hZGRDaGlsZChleHBsb3Npb24pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cFRpY2tlcigpIHtcclxuICAgIHRpY2tlciA9IG5ldyBUaWNrZXIoRlJBTUVfUkFURSwgb25GcmFtZSk7XHJcbiAgICB0aWNrZXIucGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkJvYXJkQ2xpY2soZXZlbnQpIHtcclxuICAgIHZhciB0aWxlID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgLy8gcmVtb3ZlIHJlbWFpbmluZyBleHBsb3Npb24gYW5kIGNvaW4gbWVtb3J5XHJcbiAgICBleHBsb3Npb24udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgYm9hcmQuY2xlYXJDb2luTWVtb3J5KCk7XHJcbiAgICAvLyBwbGFjZSB0aGUgY29pblxyXG4gICAgY29pbi50aWxlID0gdGlsZTsgXHJcbiAgICBjb2luLnBvc2l0aW9uLnggPSB0aWxlLmdldFgoKTtcclxuICAgIGNvaW4ucG9zaXRpb24ueSA9IHRpbGUuZ2V0WSgpO1xyXG4gICAgY29pbi5kaXJlY3Rpb24gPSB0aWxlLmdldERpcmVjdGlvbigpO1xyXG4gICAgY29pbi52aXNpYmxlID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25CdXR0b25DbGljayhldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PSBidXR0b25zLnBsYXkpIHtcclxuICAgICAgICB0aWNrZXIucGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT0gYnV0dG9ucy5wYXVzZSkge1xyXG4gICAgICAgIHRpY2tlci5wYXVzZSgpO1xyXG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT0gYnV0dG9ucy5zaHVmZmxlKSB7XHJcbiAgICAgICAgYm9hcmQuc2h1ZmZsZSgpO1xyXG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT0gYnV0dG9ucy5pbmNyZWFzZSkge1xyXG4gICAgICAgIHZhciBzaXplID0gYm9hcmQuZ2V0U2l6ZSgpO1xyXG4gICAgICAgIGlmIChzaXplIDwgMTUpIHtcclxuICAgICAgICAgICAgKytzaXplO1xyXG4gICAgICAgICAgICBib2FyZC5zZXRTaXplKHNpemUpO1xyXG4gICAgICAgICAgICBib2FyZC5zaHVmZmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT0gYnV0dG9ucy5kZWNyZWFzZSkge1xyXG4gICAgICAgIHZhciBzaXplID0gYm9hcmQuZ2V0U2l6ZSgpO1xyXG4gICAgICAgIGlmIChzaXplID4gMSkge1xyXG4gICAgICAgICAgICAtLXNpemU7XHJcbiAgICAgICAgICAgIGJvYXJkLnNldFNpemUoc2l6ZSk7XHJcbiAgICAgICAgICAgIGJvYXJkLnNodWZmbGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRnJhbWUoKSB7XHJcbiAgICAvLyBhbmltYXRlIGNvaW5cclxuICAgIGlmIChjb2luLnZpc2libGUpIHtcclxuICAgICAgY29pbi5mcmFtZSArPSAxO1xyXG4gICAgICBpZiAoY29pbi5mcmFtZSA+IDMpIHsgY29pbi5mcmFtZSA9IDA7IH1cclxuICAgICAgY29pbi50ZXh0dXJlID0gY29pblRleHR1cmVzW2NvaW5BbmltYXRpb25GcmFtZXNbY29pbi5kaXJlY3Rpb25dW2NvaW4uZnJhbWVdXTtcclxuICAgIH1cclxuICAgIC8vIGhhbmRsZSBjb2luIG1vdmVtZW50XHJcbiAgICBpZiAoY29pbi52aXNpYmxlICYmIGNvaW4uZnJhbWUgPT0gMiAmJiAhZXhwbG9zaW9uLnZpc2libGUpIHtcclxuICAgICAgICB2YXIgdGlsZSA9IGNvaW4udGlsZTtcclxuICAgICAgICAvLyBhZGQgdG8gY29pbiB0cmFpbFxyXG4gICAgICAgICAgY29pbi50aWxlLnNldEhhc0NvaW5NZW1vcnkodHJ1ZSk7XHJcbiAgICAgICAgLy8gR2V0IG5ldyBwb3NpdGlvblxyXG4gICAgICAgIHZhciBuZXdUaWxlID0gdGlsZS5nZXRQb2ludGVkTmVpZ2hib3IoKTtcclxuICAgICAgICAvLyBDaGVjayBmb3IgdHJhaWwgbG9vcFxyXG4gICAgICAgIGlmIChuZXdUaWxlICE9IG51bGwgJiYgbmV3VGlsZS5nZXRIYXNDb2luTWVtb3J5KCkpIHtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZW1vdmUgY29pbiAoaWYgYXBwbGljYWJsZSlcclxuICAgICAgICBpZiAoIW5ld1RpbGUgfHwgZXhwbG9zaW9uLnZpc2libGUpIHtcclxuICAgICAgICAgICAgYm9hcmQuY2xlYXJDb2luTWVtb3J5KCk7XHJcbiAgICAgICAgICAgIGlmICghZXhwbG9zaW9uLnZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgIGNvaW4udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY29pbi5mcmFtZSA9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gbW92ZSBjb2luXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29pbi50aWxlID0gbmV3VGlsZTtcclxuICAgICAgICAgICAgY29pbi5wb3NpdGlvbi54ID0gbmV3VGlsZS5nZXRYKCk7XHJcbiAgICAgICAgICAgIGNvaW4ucG9zaXRpb24ueSA9IG5ld1RpbGUuZ2V0WSgpO1xyXG4gICAgICAgICAgICBjb2luLmRpcmVjdGlvbiA9IG5ld1RpbGUuZ2V0RGlyZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gYW5pbWF0ZSBleHBsb3Npb25cclxuICAgIGlmIChleHBsb3Npb24udmlzaWJsZSkge1xyXG4gICAgICAgICsrZXhwbG9zaW9uLmZyYW1lO1xyXG4gICAgICAgIC8vIHNwZWNpYWwgZnJhbWVzXHJcbiAgICAgICAgaWYgKGV4cGxvc2lvbi5mcmFtZSA9PSAwKSB7XHJcbiAgICAgICAgICBleHBsb3Npb24ucG9zaXRpb24gPSBjb2luLnBvc2l0aW9uO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwbG9zaW9uLmZyYW1lID09IDEpIHtcclxuICAgICAgICAgIGNvaW4udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgY29pbi5mcmFtZSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEcmF3IG9yIHJlbW92ZVxyXG4gICAgICAgIGlmIChleHBsb3Npb24uZnJhbWUgPT0gNSkge1xyXG4gICAgICAgICAgICBleHBsb3Npb24udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBleHBsb3Npb24uZnJhbWUgPSAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBleHBsb3Npb24udGV4dHVyZSA9IGV4cGxvc2lvblRleHR1cmVzW2V4cGxvc2lvbi5mcmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcclxufVxyXG5cclxuaW5pdGlhbGl6ZSgpO1xyXG4iXX0=
