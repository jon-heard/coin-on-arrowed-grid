
export class Ticker {
    public constructor(frameRate : number, onFrameCallback) {
        this.lastFrameTime = 0;
        this.isRunning = false;
        this.frameRate = frameRate;
        this.onFrameCallback = onFrameCallback;
    }

    public play() {
        if (this.isRunning) { return; }
        this.isRunning = true;
        this.tickLoop(0);
    }

    public pause() {
        this.isRunning = false;
    }

    public tickLoop(timeStamp) {
        // call <onFrameCallback> at <frameRate> intervals
        if (timeStamp-this.lastFrameTime > this.frameRate) {
            this.lastFrameTime = timeStamp;
            this.onFrameCallback();
        }
        // loop
        if (this.isRunning) {
            requestAnimationFrame(this.tickLoop.bind(this));
        }
    }

    private isRunning : boolean;
    private lastFrameTime : number;
    private frameRate : number;
    private onFrameCallback;
}
