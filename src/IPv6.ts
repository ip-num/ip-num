import {IPNumber} from "./interface/IPNumber";
import {Hexadecatet} from "./Hexadecatet";
import {Validator} from "./Validator";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {expandIPv6Address} from "./IPv6Utils";
import {hexadectetNotationToBinaryString} from "./IPv6Utils";
import * as bigInt from "big-integer/BigInteger";
import {AbstractIPNum} from "./AbstractIPNum";
import {IPNumType} from "./IPNumType";


/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
export class IPv6 extends AbstractIPNum implements IPNumber {
    readonly value: bigInt.BigInteger;
    readonly type: IPNumType = IPNumType.IPv6;
    readonly hexadecatet: Array<Hexadecatet> = [];
    readonly separator: string = ":";
    readonly bitSize: number = 128;
    readonly validatorBitSize: bigInt.BigInteger = Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;

    static parseFromBigInteger(bigIntValue: bigInt.BigInteger): IPv6 {
        return new IPv6(bigIntValue);
    }

    static parseFromHexadecimalString(ipString: string) : IPv6 {
        return new IPv6(ipString);
    }

    constructor(ipValue: string | bigInt.BigInteger) {
        super();
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

    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    public getHexadecatet():Array<Hexadecatet> {
        return this.hexadecatet;
    }

    public toString(): string {
        return this.hexadecatet.map((value) => { return value.toString()}).join(":");
    }

    public nextIPNumber(): IPv6 {
        return IPv6.parseFromBigInteger(this.getValue().add(1))
    }

    public previousIPNumber(): IPv6 {
        return IPv6.parseFromBigInteger(this.getValue().minus(1))
    }

    private constructFromBigIntegerValue(ipv6Number: bigInt.BigInteger): [bigInt.BigInteger, Array<Hexadecatet>]  {
        let [isValid, message] = Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let binaryString = bigIntegerNumberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)]
    }

    private constructFromHexadecimalDottedString(expandedIPv6: string): [bigInt.BigInteger, Array<Hexadecatet>] {
        let [isValid, message] = Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals: string[] = expandedIPv6.split(":");
        let hexadecatet: Hexadecatet[]  = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet);
        });
        let value = bigInt(hexadectetNotationToBinaryString(expandedIPv6), 2);
        return [value, hexadecatet];
    }

    private binaryStringToHexadecatets(binaryString: string): Hexadecatet[] {
        let hexadecimalString = binaryStringToHexadecimalString(binaryString);
        let hexadecimalStrings: string[] = hexadecimalString.match(/.{1,4}/g)!;
        return hexadecimalStrings.map((stringHexadecatet)=> {
            return Hexadecatet.fromString(stringHexadecatet);
        });
    }
}