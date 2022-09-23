import { NumberSymbol } from "@angular/common";

export class LoadFeedsRequest {
    public feeders: Feeders[];
}

export class Feeders {
    public id: number;
    public take: number;
}
