import {InetNumber} from "./interface/InetNumber";

/**
 * reference https://www.rfc-editor.org/rfc/rfc4291.txt
 * https://tools.ietf.org/html/rfc5952
 */
export class IPv6 implements InetNumber {
    value: bigInt.BigInteger;
    readonly octets: Array<Octet> = [];

    getValue(): bigInt.BigInteger {
        throw new Error("Method not implemented.");
    }

}