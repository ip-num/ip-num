'use strict';

import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {InetNumber} from "./interface/InetNumber";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {AbstractIPNum} from "./AbstractIPNum";

/**
 * Represents the 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * For more see https://en.wikipedia.org/wiki/IPv4
 */
export class IPv4 extends AbstractIPNum implements InetNumber {
    readonly value: bigInt.BigInteger;
    readonly octets: Array<Octet> = [];
    readonly separator: string = ".";
    readonly bitSize: number = 32;
    readonly validatorBitSize: bigInt.BigInteger = Validator.THIRTY_TWO_BIT_SIZE;

    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv4 {
        return new IPv4(bigIntValue);
    }

    static fromDecimalDottedString(ipString: string) : IPv4 {
        return new IPv4(ipString);
    }

    static of(rawValue:string):IPv4
    static of(intValue:bigInt.BigInteger):IPv4
    static of(rawValue:string | bigInt.BigInteger):IPv4 {
        return new IPv4(rawValue);
    };

    constructor(ipValue: string | bigInt.BigInteger) {
        super();
        if (typeof ipValue === "string" ) {
            let [value, octets] = this.constructFromDecimalDottedString(ipValue);
            this.value = value;
            this.octets = octets
        } else {
            let [value, octets] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.octets = octets;
        }
    }

    public toString(): string {
        return this.octets.map((value) => { return value.toString()}).join(this.separator);
    }

    public getOctets(): Array<Octet> {
        return this.octets;
    }

    public nextIPAddress(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().add(1))
    }

    public previousIPAddress(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().minus(1))
    }

    private constructFromDecimalDottedString(ipString: string): [bigInt.BigInteger, Array<Octet>] {
        let octets;
        let value;
        let [isValid, message] = Validator.isValidIPv4String(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let stringOctets = ipString.split(".");
        octets = stringOctets.map((rawOctet) => {
            return Octet.of(rawOctet)
        });
        value = bigInt(dottedDecimalNotationToBinaryString(ipString), 2);
        return [value, octets]
    }

    private constructFromBigIntegerValue(ipv4Number: bigInt.BigInteger): [bigInt.BigInteger, Array<Octet>]  {
        let [isValid, message] = Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let binaryString = bigIntegerNumberToBinaryString(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)]
    }

    private binaryStringToDecimalOctets(ipv4BinaryString: string): Array<Octet> {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        let octets: string[] = ipv4BinaryString.match(/.{1,8}/g)!;
        return octets.map((octet) => {
            return Octet.of(parseBinaryStringToBigInteger(octet).toString())
        });
    }
}