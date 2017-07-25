import {InetNumber} from "./interface/InetNumber";
export class IPv6 implements InetNumber {
    value: bigInt.BigInteger;

    getValue(): bigInt.BigInteger {
        throw new Error("Method not implemented.");
    }

}