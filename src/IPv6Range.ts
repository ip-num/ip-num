import {IPv6Prefix} from "./Prefix";
import {IPv6} from "./IPv6";

export class IPv6Range implements IterableIterator<IPv6> {
    private readonly bitValue: number = 128;
    private internalCounterValue: IPv6;

    constructor(private readonly ipv6: IPv6, private readonly cidrPrefix: IPv6Prefix) {
        this.internalCounterValue = this.getFirst();
    }

    public getFirst(): IPv6 {
        return IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }

    [Symbol.iterator](): IterableIterator<IPv6> {
        return undefined!;
    }

    next(value?: any): IteratorResult<IPv6> {
        return undefined!;
    }

}