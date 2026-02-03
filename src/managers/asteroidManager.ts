import { Asteroid } from "../entities/Asteroid";
import type { Vector2d } from "../types/vector2d";

export class AsteroidManager {
    private static _instance: AsteroidManager;
    private pool: Asteroid[] = [];
    private readonly POOL_SIZE = 15;

    private constructor() {} // Use init to setup

    public static get instance(): AsteroidManager {
        return this._instance || (this._instance = new this());
    }

    public init(sprite: HTMLImageElement) {
        for (let i = 0; i < this.POOL_SIZE; i++) {
            // Create inactive asteroids with dummy positions
            const a = new Asteroid({ x: 0, y: 0 }, 30, sprite);
            a.active = false;
            this.pool.push(a);
        }
    }

    public spawnAsteroid(playerPos: Vector2d, screenWidth: number, screenHeight: number) {
        const asteroid = this.pool.find(a => !a.active);
        if (!asteroid) return;

        // Choose a random edge to spawn at
        const edge = Math.floor(Math.random() * 4);
        let x = 0, y = 0;

        if (edge === 0) { x = Math.random() * screenWidth; y = -50; } // Top
        else if (edge === 1) { x = screenWidth + 50; y = Math.random() * screenHeight; } // Right
        else if (edge === 2) { x = Math.random() * screenWidth; y = screenHeight + 50; } // Bottom
        else { x = -50; y = Math.random() * screenHeight; } // Left

        asteroid.spawn(x, y, playerPos);
    }

    public update(dt: number, width: number, height: number) {
        this.pool.forEach(a => {
            if (a.active) a.update(dt, width, height);
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.pool.forEach(a => {
            if (a.active) a.draw(ctx);
        });
    }

    public get activeAsteroids(): Asteroid[] {
        return this.pool.filter(a => a.active && a.isColliderActive);
    }

    public get allAsteroids(): Asteroid[] {
        return this.pool
    }

    public clearAll(): void{
        this.pool.forEach(a => a.reset())
    }
}