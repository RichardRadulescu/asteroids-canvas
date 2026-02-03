import type { ICollider } from "../interfaces/ICollider";
import type { IEntity } from "../interfaces/IEntity";
import type { IPoint } from "../interfaces/IPoint";
import type { IRenderable } from "../interfaces/IRenderable";
import type { IShape } from "../interfaces/IShape";
import { ScoreManager } from "../managers/scoreManager";
import type { Circle } from "../types/circle";
import type { Vector2d } from "../types/vector2d";
import { isCollidableEntity } from "../utils/entityColliderCheck";


export class Asteroid implements IRenderable, ICollider, IEntity {
    public tag: string = "ASTEROID"
    private SPEED: number = 1.0;
    public active: boolean = false; // Starts inactive in the pool
    private shape!: IShape;
    private rotation: number = 0;
    private rotationSpeed: number = (Math.random() - 0.5) * 2;
    private velocity: Vector2d = { x: 0, y: 0 };
    private _bounds!: Circle;
    private _isColliderActive: boolean = true;


    constructor(
        private _position: Vector2d,
        private size: number,
        private sprite: HTMLImageElement
    ) {
        // Generate the shape once; we can reuse it or regenerate in spawn
        this.shape = this.generateRandomAsteroidShape(size);
        this._bounds = { x: this._position.x, y: this._position.y, radius: size };
    }

    public spawn(x: number, y: number, playerPos: Vector2d) {
        this._position.x = x;
        this._position.y = y;
        this.active = true;
        this._isColliderActive = true

        // Recalculate trajectory towards player
        const dx = playerPos.x - this._position.x;
        const dy = playerPos.y - this._position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.velocity.x = (dx / distance) * this.SPEED;
        this.velocity.y = (dy / distance) * this.SPEED;

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
        return { vertices };
    }

    update(dt: number, width: number, height: number): void {
        this._position.x += this.velocity.x * dt * 60;
        this._position.y += this.velocity.y * dt * 60;

        // 2. Visual Rotation
        this.rotation += this.rotationSpeed * dt;

        const margin = 100;

        if (
            this._position.x < -margin ||
            this._position.x > width + margin ||
            this._position.y < -margin ||
            this._position.y > height + margin
        ) {
            this.active = false; // Mark for removal
        }

        this._bounds.x = this._position.x;
        this._bounds.y = this._position.y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this._position.x, this._position.y);
        ctx.rotate(this.rotation);

        // 1. Draw the Sprite
        // We use size * 2 because radius is half the width
        if (this.sprite && this.sprite.complete) {
            ctx.drawImage(
                this.sprite,
                -this.size,
                -this.size,
                this.size * 2,
                this.size * 2
            );
        } else {
            // FALLBACK: Draw a placeholder if the sprite is missing/loading
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore()
    }
    
    onCollision(other: ICollider): void {
        if (!this._isColliderActive) return;

        if (isCollidableEntity(other)) {
            if (other.tag === "BULLET") {
                this.active = false;
                this._isColliderActive = false; // Turn off immediately
                ScoreManager.instance.asteroidDestroyed += 1;
            }

            if (other.tag === "SHIP") {
                this.active = false; // Ship crashes into asteroid -> asteroid breaks
                this._isColliderActive = false; // Turn off immediately
                // Note: We don't touch health here, the Ship handles its own damage
            }

        }
    }

    public get bounds(): Circle {
        return this._bounds
    }
    public get isColliderActive(): boolean {
        return this._isColliderActive
    }
    public get position(): Vector2d {
        return this._position
    }

    // Inside Asteroid.ts

    public reset() {
        this.active = false;
        this._isColliderActive = false;

        // Optional: Move off-screen
        this._position.x = -100;
        this._position.y = -100;
    }
}