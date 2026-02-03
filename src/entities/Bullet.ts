import type { ICollider } from "../interfaces/ICollider";
import type { IEntity } from "../interfaces/IEntity";
import type { IRenderable } from "../interfaces/IRenderable";
import { ScoreManager } from "../managers/scoreManager";
import type { Vector2d } from "../types/vector2d";


export class Bullet implements IRenderable, ICollider, IEntity {
    public tag: string = "BULLET"
    private _active: boolean = false;
    private velocity: Vector2d = { x: 0, y: 0 };
    private speed: number = 7;
    private size: number = 5

    // Satisfy ICollider
    public get bounds() {
        return { x: this._position.x, y: this._position.y, radius: this.size };
    }
    public get active() {
        return this._active
    }
    public isColliderActive: boolean = true;

    constructor(private _position: Vector2d) { }

    // Called by the Manager to "re-use" this bullet
    public spawn(x: number, y: number, angle: number) {
        this._position.x = x;
        this._position.y = y;
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this._active = true;
    }

    update(dt: number, width: number, height: number): void {
        if (!this.active) return;

        this._position.x += this.velocity.x * dt * 60;
        this._position.y += this.velocity.y * dt * 60;

        // Bullets usually die when hitting screen edges (instead of wrapping)
        if (this._position.x < 0 || this._position.x > width ||
            this._position.y < 0 || this._position.y > height) {
            this._active = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this._position.x, this._position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    onCollision(other: ICollider): void {
        this._active = false; // Kill bullet on hit

    }

    public get position(): Vector2d {
        return this._position
    }

    // Inside Bullet.ts

    public reset() {
        this._active = false;
        this.isColliderActive = false;

        // Optional: Move off-screen to prevent visual glitches
        this._position.x = -100;
        this._position.y = -100;
    }
}