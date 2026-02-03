import type { Circle } from "../types/circle"
import type { Rectangle } from "../types/rectangle"
import type { IShape } from "./IShape"

export interface ICollider{

    readonly bounds: Circle
    isColliderActive: boolean
    onCollision(other: ICollider): void
}