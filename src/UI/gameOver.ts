export class GameOver {
    private titleFontSize: number = 60;
    private subFontSize: number = 24;
    private fontFamily: string = "Arial, sans-serif";

    constructor() {}

    draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, finalScore: number): void {
        ctx.save();

        // 1. Draw a semi-transparent dark overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Style the text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;

        // 3. Draw "GAME OVER" Title
        ctx.fillStyle = "#ff4444"; // Aggressive red
        ctx.font = `bold ${this.titleFontSize}px ${this.fontFamily}`;
        ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 40);

        // 4. Draw Final Score
        ctx.fillStyle = "white";
        ctx.font = `${this.subFontSize}px ${this.fontFamily}`;
        ctx.fillText(`Final Score: ${finalScore}`, canvasWidth / 2, canvasHeight / 2 + 20);

        // 5. Draw Restart Instruction
        ctx.font = `italic ${this.subFontSize - 4}px ${this.fontFamily}`;
        ctx.fillText("Press 'R' to Restart", canvasWidth / 2, canvasHeight / 2 + 70);

        ctx.restore();
    }
}