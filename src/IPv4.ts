'use strict';

import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {InetNumber} from "./interface/InetNumber";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {leftPadWithZeroBit} from "./BinaryUtils";

/**
 * Represents the 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * For more see https://en.wikipedia.org/wiki/IPv4
 */
export class IPv4 implements InetNumber {
    readonly value: bigInt.BigInteger;
    readonly octets: Array<Octet> = [];


    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv4 {
        return new IPv4(bigIntValue);
    }

    static fromNumber(numValue: number): IPv4 {
        return new IPv4(bigInt(numValue));
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

    public getValue():bigInt.BigInteger {
        return this.value;
    }

    public toString(): string {
        return this.octets.map((value) => { return value.toString()}).join(".");
    }

    public toBinaryString(): string {
        return leftPadWithZeroBit(this.value.toString(2), 32);
    }

    public getOctets(): Array<Octet> {
        return this.octets;
    }

    public nextIPv4(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().add(1))
    }

    public previousIPv4(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().minus(1))
    }

    hasNext():boolean {
        return this.value < Validator.THIRTY_TWO_BIT_SIZE;
    }

    hasPrevious():boolean {
        return this.value.valueOf() > 0;
    }

    public isEquals(anotherIPv4: IPv4): boolean {
        return this.value.equals(anotherIPv4.value);
    }

    public isLessThan(anotherIPv4: IPv4): boolean {
        return this.value.lt(anotherIPv4.value);
    }

    public isGreaterThan(anotherIPv4: IPv4): boolean {
        return this.value.gt(anotherIPv4.value);
    }

    public isLessThanOrEquals(anotherIPv4: IPv4): boolean {
        return this.value.lesserOrEquals(anotherIPv4.value);
    }

    public isGreaterThanOrEquals(anotherIPv4: IPv4): boolean {
        return this.value.greaterOrEquals(anotherIPv4.value);
    }

    private constructFromDecimalDottedString(ipString: string): [bigInt.BigInteger, Array<Octet>] {
        let octets;
        let value;
        let [isValid, message] = Validator.isValidIPv4DecimalNotationString(ipString);
        if (!isValid) {
            throw new Error(message);
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
            throw new Error(message);
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