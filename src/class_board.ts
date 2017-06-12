
const BOARD_PADDING_X = 2;
const BOARD_PADDING_Y = 2;

import { Tile } from "./class_tile";

export class Board {
    public constructor(
            resources, stage : PIXI.Container,
            onClickCallback,
            size : number, x : number, y : number) {
        this.x = x;
        this.y = y;
        this.onClickCallback = onClickCallback;
        this.resources = resources;
        this.stage = stage;
        this.setSize(size);
    }

    public shuffle() {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                this.tiles[y][x].shuffleDirection();
            }
        }
    }

    public clearCoinMemory() {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                this.tiles[y][x].setHasCoinMemory(false);
            }
        }
    }

    public getX() : number { return this.x; }
    public getY() : number { return this.y; }
    public getSize() : number { return this.size; }

    public setPosition(x : number, y : number) {
        this.x = x;
        this.y = y;
        this.updateTilePositions();
    }

    public setSize(value : number) {
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
                this.tiles[y][x] = new Tile(
                        this.resources, this.stage,
                        tileType, 0, 0, this.onClickCallback);
            }
        }
        // Setup neighbors
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                if (y > 0) { this.tiles[y-1][x].setNeighbor(2, this.tiles[y][x]); }
                if (x > 0) { this.tiles[y][x-1].setNeighbor(1, this.tiles[y][x]); }
                if (y < this.size-1) { this.tiles[y+1][x].setNeighbor(0, this.tiles[y][x]); }
                if (x < this.size-1) { this.tiles[y][x+1].setNeighbor(3, this.tiles[y][x]); }
            }
        }
        this.updateTilePositions();
    }

    private updateTilePositions() {
        for (var y = 0; y < this.size; ++y) {
            for (var x = 0; x < this.size; ++x) {
                var px = x * (64 + BOARD_PADDING_X) + this.x;
                var py = y * (64 + BOARD_PADDING_Y) + this.y;
                this.tiles[y][x].setPosition(px,py);                
            }
        }        
    }

    // state
    private x : number;
    private y : number;
    private size : number;
    private onClickCallback;
    private tiles : Array<Array<Tile>>;
    // system
    private resources;
    private stage : PIXI.Container;
}