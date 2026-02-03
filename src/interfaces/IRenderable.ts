export interface IRenderable {
    update(dt: number, width: number, height: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    readonly active: boolean; // Vital for your object pooling!
    
}