import type { IPoint } from "./interfaces/IPoint";
import type { IRenderable } from "./interfaces/IRenderable";
import type { IShape } from "./interfaces/IShape";

export class Asteroid implements IRenderable{

    public active: boolean= false
    private shape: IShape
    private rotation: number = 0;
    private rotationSpeed: number = (Math.random() - 0.5) * 2;

    constructor(private x: number, private  y: number,
         private size:number, 
         private sprite: HTMLImageElement ){
        
        this.shape= this.generateRandomAsteroidShape(size)
    }

    private generateRandomAsteroidShape(radius: number): IShape {
        const vertices: IPoint[] = [];
        const sides = 3 + Math.floor(Math.random() * 7); // 8 to 15 sides
        
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const jitter = 0.5 + Math.random() * 0.5; 
            vertices.push({
                x: Math.cos(angle) * radius * jitter,
                y: Math.sin(angle) * radius * jitter
            });
        }
        return { vertices, color: '#ad4242' };
    }

    update(dt: number, width: number, height: number): void {
        console.log("update")
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 1. Draw the Sprite
        // We use size * 2 because radius is half the width
        ctx.drawImage(
            this.sprite, 
            -this.size, 
            -this.size, 
            this.size * 2, 
            this.size * 2
        );   
    }

    
}