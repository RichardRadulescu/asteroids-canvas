export class Game{
    
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private lastTime: number=0

    constructor(canvasId: string){
        this.canvas= document.getElementById(canvasId) as HTMLCanvasElement
        const context= this.canvas.getContext("2d")

        if(!context) throw new Error("Context could not be found")

        this.ctx= context

        this.initEventListeners()
        this.resize()
    }
    private initEventListeners(){

    }

    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public start(){
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(timestamp: number){
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    private update(){
        //update enities
    }
    private draw(){
        //draw scene then entities
    }

    
}