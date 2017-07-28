import {InetNumber} from "./interface/InetNumber";
import {Hexadecatet} from "./Hexadecatet";
import {Validator} from "./Validator";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {expandIPv6Address} from "./IPv6Utils";
import {hexadecimalNotationToBinary} from "./HexadecimalUtils";
import * as bigInt from "big-integer/BigInteger";


/**
 * reference https://www.rfc-editor.org/rfc/rfc4291.txt
 * https://tools.ietf.org/html/rfc5952
 */
export class IPv6 implements InetNumber {
    value: bigInt.BigInteger;
    readonly hexadecatet: Array<Hexadecatet> = [];

    constructor(ipValue: string | bigInt.BigInteger) {
        if (typeof ipValue === "string" ) {
            let expandedIPv6 = expandIPv6Address(ipValue);
            let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
            this.value = value;
            this.hexadecatet = hexadecatet;

        } else {
            let [value, hexadecatet] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
    }

    getValue(): bigInt.BigInteger {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return this.hexadecatet.map((value) => { return value.toString()}).join(":");
    }

    private constructFromBigIntegerValue(ipv6Number: bigInt.BigInteger): [bigInt.BigInteger, Array<Hexadecatet>]  {
        let [isValid, message] = Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message);
        }
        let binaryString = bigIntegerNumberToBinaryString(ipv6Number);
        return [ipv6Number, this.hexadecimalStringToHexadecatets(binaryString)]
    }

    private constructFromHexadecimalDottedString(expandedIPv6: string): [bigInt.BigInteger, Array<Hexadecatet>] {
        let [isValid, message] = Validator.isValidIPv6NotationString(expandedIPv6);
        if (!isValid) {
            throw new Error(message);
        }

        let stringHexadecimals: string[] = expandedIPv6.split(":");
        let hexadecatet: Hexadecatet[]  = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.of(stringHexadecatet);
        });
        let value = bigInt(hexadecimalNotationToBinary(expandedIPv6), 2);
        return [value, hexadecatet];
    }

    private hexadecimalStringToHexadecatets(binaryString: string) {
        let hexadecatetAsBinary: string[] = binaryString.match(/.{1,16}/g);
        return hexadecatetAsBinary.map((hexadecatetBinary)=> {
            return Hexadecatet.of(binaryStringToHexadecimalString(hexadecatetBinary));
        });
    }


}