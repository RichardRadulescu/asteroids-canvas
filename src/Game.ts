import { Ship } from "./entities/Ship"
import { AsteroidManager } from "./managers/asteroidManager"
import { BulletManager } from "./managers/bulletManager"
import { ScoreManager } from "./managers/scoreManager"
import { GameOver } from "./UI/gameOver"
import { Score } from "./UI/score"
import { loadImage } from "./utils/assetLoader"
import { isColliding } from "./utils/collisionCheck"

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTime: number = 0;

    // Entities
    private ship!: Ship;
    private scoreDisplay: Score = new Score();
    private gameOverScreen: GameOver = new GameOver(); // Create once, reuse

    // Game State
    private asteroidSpawnTimer: number = 0;
    private SPAWN_INTERVAL: number = 2.0;
    private isRunning = false;
    private loopId: number | null = null;

    constructor(canvasId: string) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
        const context = this.canvas.getContext("2d")

        if (!context) throw new Error("Context could not be found")

        this.ctx = context
        this.resize()

        this.init().then(() => {
            // This only runs if this.ship was successfully assigned
            if (this.ship) {
                this.initEventListeners();
                this.start();
            }
        })
            .catch(err => {
                console.error("Game boot halted:", err);
                // Display a message on the canvas for the user
                this.ctx.fillStyle = "white";
                this.ctx.fillText("Failed to load assets. Check console.", 10, 20);
            });

    }

    private async init() {
        try {
            // 1. Load all sprites in parallel
            const [shipSprite, asteroidSprite] = await Promise.all([
                loadImage('assets/ship.png'),
                loadImage('assets/asteroid.png'),
            ]);

            BulletManager.instance; // Lazy init
            AsteroidManager.instance.init(asteroidSprite);

            // 3. Initialize Ship
            this.ship = new Ship(
                { x: this.canvas.width / 2, y: this.canvas.height / 2 },
                100,
                shipSprite
            );

        } catch (error) {
            console.error("Failed to load game assets:", error);
        }
    }

    private initEventListeners() {

        this.ship.attachEvents()
        window.addEventListener('resize', () => this.resize());
        window.addEventListener("keydown", (e) => {
            if ((e.key === "r" || e.key === "R") && !this.isRunning) {
                this.restart();
            }
        });
    }

    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public start() {
        // 1. KEY FIX: Kill any existing loop before starting a new one
        this.stop();

        this.isRunning = true;
        this.lastTime = performance.now();

        // 2. Start the loop
        this.loopId = requestAnimationFrame((time) => this.loop(time));
    }

    public stop() {
        this.isRunning = false;
        if (this.loopId !== null) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    }

    public restart() {
        // 1. Reset Game State
        ScoreManager.instance.health = 3;
        ScoreManager.instance.asteroidDestroyed = 0;
        this.SPAWN_INTERVAL = 2.0;

        // 2. Reset Entities
        this.ship.reset(this.canvas.width / 2, this.canvas.height / 2); // Ensure Ship class has a reset() method
        AsteroidManager.instance.clearAll(); // Ensure Manager clears array
        BulletManager.instance.clearAll();

        // 3. Start fresh
        this.start();
    }

    private loop(timestamp: number) {
        // Guard clause: If stopped, do not run logic or schedule next frame
        if (!this.isRunning) return;

        const deltaTime = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        // --- STEP 1: UPDATE ---
        this.update(deltaTime);

        // --- STEP 2: CHECK DEATH ---
        // We check AFTER update but BEFORE draw
        if (ScoreManager.instance.health <= 0 || this.ship.health <= 0) {
            this.stop(); // Stops the loop immediately

            // Draw one last time so we see the game board behind the Game Over screen
            this.draw();
            this.gameOverScreen.draw(this.ctx, this.canvas.width, this.canvas.height, ScoreManager.instance.asteroidDestroyed);
            return;
        }

        // --- STEP 3: DRAW ---
        this.draw();

        // --- STEP 4: SCHEDULE NEXT ---
        this.loopId = requestAnimationFrame((time) => this.loop(time));
    }

    private update(deltaTime: number) {
        const w = this.canvas.width
        const h = this.canvas.height
        this.ship.update(deltaTime, w, h)
        BulletManager.instance.update(deltaTime, w, h);
        AsteroidManager.instance.update(deltaTime, w, h);

        this.asteroidSpawnTimer -= deltaTime;
        this.SPAWN_INTERVAL = Math.max(0.5, this.SPAWN_INTERVAL - 0.001 * deltaTime);
        if (this.asteroidSpawnTimer <= 0) {

            AsteroidManager.instance.spawnAsteroid(this.ship.position, w, h);

            // Reset timer
            this.asteroidSpawnTimer = this.SPAWN_INTERVAL;
        }

        // 3. Collision Detection (The next step)
        this.checkCollisions();
        //Game Over


    }
    private draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Draw Background (Optional space color)
        this.ctx.fillStyle = '#000814'; // Deep space blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 3. Draw Entities (BulletManager first so they are under the ship/asteroids)
        BulletManager.instance.draw(this.ctx);
        AsteroidManager.instance.draw(this.ctx);
        this.ship.draw(this.ctx);
        //DRAW HITBOXES TESTING
        /* const allObjects = [...BulletManager.instance.allBullets, ...AsteroidManager.instance.allAsteroids, this.ship];
         allObjects.forEach(obj => {
             this.ctx.beginPath();
             this.ctx.arc(obj.bounds.x, obj.bounds.y, obj.bounds.radius, 0, Math.PI * 2);
             this.ctx.strokeStyle = "red";
             this.ctx.stroke();
         });*/
        this.scoreDisplay.draw(this.ctx, ScoreManager.instance.health,
            ScoreManager.instance.asteroidDestroyed,
            BulletManager.instance.bulletCount()
        )
    }


    private checkCollisions() {
        const bullets = BulletManager.instance.activeBullets
        const asteroids = AsteroidManager.instance.activeAsteroids

        // 1. Check Bullets vs Asteroids
        for (const bullet of bullets) {
            for (const asteroid of asteroids) {
                if (asteroid.isColliderActive && isColliding(bullet, asteroid)) {
                    // Trigger the logic inside the classes
                    bullet.onCollision(asteroid)
                    asteroid.onCollision(bullet)
                }
            }
        }

        // 2. Check Ship vs Asteroids
        for (const asteroid of asteroids) {
            if (asteroid.isColliderActive && isColliding(this.ship, asteroid)) {
                this.ship.onCollision(asteroid);
                asteroid.onCollision(this.ship);
            }
        }
    }

}