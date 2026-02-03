import type { ICollider } from "../interfaces/ICollider";
import type { IEntity } from "../interfaces/IEntity";

export function isCollidableEntity(obj: any): obj is ICollider & IEntity {
    return (
        obj &&
        // ICollider check
        typeof obj.onCollision === 'function' &&
        'isColliderActive' in obj &&
        // IEntity check
        'tag' in obj &&
        'active' in obj
    );
}