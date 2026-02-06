import type { ICollider } from "../interfaces/ICollider";
import type { IEntity } from "../interfaces/IEntity";

export function isCollidableEntity(obj: unknown): obj is ICollider & IEntity {
    if (typeof obj !== 'object' || obj === null)
         { return false; } 
    const o = obj as Record<string, unknown>; 
    return (typeof o.onCollision === 'function' && 
        typeof o.isColliderActive === 'boolean' && 
        typeof o.tag === 'string' && 
        typeof o.active === 'boolean');
}