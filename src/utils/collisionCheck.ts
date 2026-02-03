import type { ICollider } from "../interfaces/ICollider";


export function isColliding(objA: ICollider, objB: ICollider): boolean {
    const bA = objA.bounds;
    const bB = objB.bounds;

    const dx = bA.x - bB.x;
    const dy = bA.y - bB.y;
    
    // Optimization: Compare squared distance to avoid Math.sqrt()
    const distanceSq = dx * dx + dy * dy;
    const radiusSum = bA.radius + bB.radius;

    return distanceSq < (radiusSum * radiusSum);
}