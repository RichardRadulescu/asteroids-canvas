export class Score {
    private fontSize: number = 24;
    private fontFamily: string = "Arial, sans-serif";
    private padding: number = 20;

    constructor() {}

    draw(ctx: CanvasRenderingContext2D, health: number, score: number, bullet: number): void {
        ctx.save();

        // Style the text
        ctx.fillStyle = "white";
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        // Add a slight shadow for readability
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw Health
        ctx.fillText(`Health: ${health}`, this.padding, this.padding);

        // Draw Score (placed below health)
        ctx.fillText(`Asteroids: ${score}`, this.padding, this.padding + this.fontSize + 5);

        ctx.fillText(`Bullets: ${bullet}`, this.padding, this.padding + (this.fontSize + 5) * 2);

        ctx.restore();
    }
}