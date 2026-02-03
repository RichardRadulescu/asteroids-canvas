

export class ScoreManager{
    private static _instance: ScoreManager
    public health: number= 3;
    public asteroidDestroyed: number= 0;
    

    public static get instance(): ScoreManager {
        return this._instance || (this._instance = new ScoreManager());
    }
}