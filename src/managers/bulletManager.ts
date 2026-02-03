import { Bullet } from "../entities/Bullet";
import { ScoreManager } from "./scoreManager";

export class BulletManager {
    private static _instance: BulletManager;
    private bulletPool: Bullet[] = [];
    private readonly POOL_SIZE = 30;

    private constructor() {
        // Pre-allocate the pool
        for (let i = 0; i < this.POOL_SIZE; i++) {
            // We pass a dummy vector, spawn() will fix it later
            this.bulletPool.push(new Bullet({ x: 0, y: 0 }));
        }
    }

    public static get instance(): BulletManager {
        return this._instance || (this._instance = new BulletManager());
    }

    public fire(x: number, y: number, angle: number) {
        // Find the first available (inactive) bullet
        const bullet = this.bulletPool.find(b => !b.active);
        
        if (bullet) {
            bullet.spawn(x, y, angle);
            
        } else {
            console.warn("Bullet pool exhausted!");
        }
    }

    public update(dt: number, width: number, height: number) {
        this.bulletPool.forEach(b => b.update(dt, width, height));
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.bulletPool.forEach(b => b.draw(ctx));
    }

    public get activeBullets(): Bullet[] {
        return this.bulletPool.filter(b => b.active);
    }
    public get allBullets(): Bullet[]{
        return this.bulletPool
    }

    public bulletCount(): number{
        return this.POOL_SIZE - this.bulletPool.filter(b=> b.active).length
    }

    public clearAll(): void{
        this.bulletPool.forEach(b => b.reset())
    }
}