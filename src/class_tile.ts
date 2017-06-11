
const COIN_MEMORY_ALPHA = .35;

export class Tile {
    constructor(
            resources, stage,
            tileType:number, x:number, y:number,
            onClickCallback, arrowType:number = 0) {
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
            this.arrowType = arrowType;
            this.neighbors = [null, null, null, null];
            this.hasCoinMemory = false;
            // tile
            this.tileSprite = new PIXI.Sprite(resources["tile_" + tileType].texture);
            stage.addChild(this.tileSprite);
            this.tileSprite.position.x = x;
            this.tileSprite.position.y = y;
            // arrow
            this.arrowSprite = new PIXI.Sprite(Tile.arrowTextures[arrowType]);
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
            this.tileSprite.on('mouseup', onClickCallback);
    }

    public getArrowType() : number { return this.arrowType; }
    public getX() : number { return this.x; }
    public getY() : number { return this.y; }
    public getNeighbor(index : number) : Tile { return this.neighbors[index]; }
    public getPointedNeighbor() : Tile { return this.neighbors[this.arrowType]; }
    public getHasCoinMemory() : boolean { return this.hasCoinMemory; }

    public setArrowType(value : number) {
        if (value < 0 || value > 3) { return; } // TODO: Error reporting
        this.arrowType = value;
        this.arrowSprite.texture = Tile.arrowTextures[value];
    }

    public setPosition(x : number, y : number) {
        this.x = x;
        this.y = y;
        this.tileSprite.position.x = x;
        this.tileSprite.position.y = y;
    }

    public setNeighbor(index : number, neighbor : Tile) {
        if (index < 0 || index > 3) { return; } // TODO: Error reporting
        this.neighbors[index] = neighbor;
    }

    public setHasCoinMemory(value : boolean) {
        this.hasCoinMemory = value;
        this.coinMemorySprite.visible = value;
    }

    // State
    private x : number;
    private y : number;
    private arrowType : number;
    private neighbors : Array<Tile>;
    private hasCoinMemory : boolean;
    // Media
    private tileSprite : PIXI.Sprite;
    private arrowSprite : PIXI.Sprite;
    private coinMemorySprite : PIXI.Sprite;
    // Static
    static arrowTextures : Array<PIXI.Texture>;
}
