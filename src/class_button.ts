
const DIM_TINT = 0xbbbbbb;
const HOVER_TINT = 0xffffff;
const CLICK_TINT = 0xffff00;

export class Button {
    public constructor(
            stage : PIXI.Container, texture : PIXI.Texture,
            onClickCallback, x : number, y : number) {
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

    public onMouseOver(event) {
        this.sprite.tint = HOVER_TINT;
    }

    public onMouseOut(event) {
        this.sprite.tint = DIM_TINT;
    }

    public onMouseDown(event) {
        this.sprite.tint = CLICK_TINT;
    }

    public onMouseUp(event) {
        this.sprite.tint = HOVER_TINT;
        event.target = this;
        this.onClickCallback(event);
    }

    public getX() { return this.x; }
    public getY() { return this.y; }

    public setPosition(x : number, y : number) {
        this.x = x;
        this.y = y;
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    }

    private sprite : PIXI.Sprite;
    private onClickCallback;
    private x : number;
    private y : number;
}
