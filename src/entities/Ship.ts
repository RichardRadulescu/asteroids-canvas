import type { ICollider } from "../interfaces/ICollider";
import type { IEntity } from "../interfaces/IEntity";
import type { IRenderable } from "../interfaces/IRenderable";
import { BulletManager } from "../managers/bulletManager";
import { ScoreManager } from "../managers/scoreManager";
import type { Circle } from "../types/circle";
import type { Vector2d } from "../types/vector2d";
import { isCollidableEntity } from "../utils/entityColliderCheck";

export class Ship implements IRenderable, ICollider, IEntity, IDamageable{

    public active: boolean= true
    private rotation: number = 0;
    private rotationSpeed: number = 3;
    private _isColliderActive= true
    public tag: string= "SHIP"
    private _bounds: Circle
    private _health: number = 3
    private _asteroidDestroyed: number= 0

    private keys = {
        left: false,
        right: false
    };

    constructor(private _position: Vector2d,
                private size:number,
                private sprite: HTMLImageElement
    ){
        this._bounds = { 
            x: this._position.x, 
            y: this._position.y, 
            radius: this.size / 2 
        };
        ScoreManager.instance.health=this._health

    }

    public attachEvents(){
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'KeyD') this.keys.right = true;
            
            if (e.code === 'Space') {
                
                BulletManager.instance.fire(this.position.x, this.position.y,
                    this.rotation
                )
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'KeyD') this.keys.right = false;
        });
    }


    update(dt: number, width: number, height: number): void {
        
        if (this.keys.left) {
            this.rotation -= this.rotationSpeed * dt;
        }
        if (this.keys.right) {
            this.rotation += this.rotationSpeed * dt;
        }

        // 2. Keep the bounds following the ship's position
        this._bounds.x = this.position.x;
        this._bounds.y = this.position.y;

        // 3. Screen Wrapping (Classic Asteroids style)
        if (this.position.x < 0) this.position.x = width;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.y > height) this.position.y = 0;
    
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save(); // Save current state (translation/rotation)

        // Move canvas origin to ship center
        ctx.translate(this.position.x, this.position.y);
        
        ctx.rotate(this.rotation + Math.PI / 2);
        // Draw sprite centered (offset by half width/height)
        ctx.drawImage(
            this.sprite,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.restore();
    }

    onCollision(other: ICollider): void {
        if (isCollidableEntity(other) && other.tag === "ASTEROID" && other.isColliderActive) {
            this.takeDamage(1)
            ScoreManager.instance.health= this._health
        }
    }

    public takeDamage(dmg: number): void {
        this._health-= dmg
    }

    public get bounds(): Circle{
        return this._bounds
    }
    public get isColliderActive(): boolean{
        return this._isColliderActive
    }
    public get position(): Vector2d{
        return this._position
    }
    public get health(): number{
        return this._health
    }

    // Inside Ship.ts

    public reset(startX: number, startY: number) {
        // 1. Reset Position
        this._position.x = startX;
        this._position.y = startY;

        // 2. Reset Physics & Input
        this.rotation = 0;
        this.keys = { left: false, right: false }; // Clear any "stuck" keys

        // 3. Reset Stats
        this._health = 3;
        this.active = true;
        this._isColliderActive = true;

        // 4. Sync ScoreManager
        ScoreManager.instance.health = this._health;
    }
}