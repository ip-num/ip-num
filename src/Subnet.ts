'use strict';

import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {InetNumber} from "./interface/InetNumber";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {Hexadecatet} from "./Hexadecatet";
import {hexadectetNotationToBinaryString} from "./HexadecimalUtils";

export class IPv4Subnet implements InetNumber {
    readonly octets: Array<Octet> = [];
    readonly value: bigInt.BigInteger;

    static of(rawValue:string):IPv4Subnet {
        return new IPv4Subnet(rawValue);
    };

    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString: string) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = Validator.isValidIPv4Subnet(ipString);

        if (!isValid) {
            throw new Error(message);
        }

        let stringOctets = ipString.split(".");

        this.octets = stringOctets.map((rawOctet) => {
            return Octet.of(rawOctet)
        });

        this.value = bigInt(dottedDecimalNotationToBinaryString(ipString), 2);
    }

    public getValue():bigInt.BigInteger {
        return this.value;
    }

    public toString(): string {
        return this.octets.map(function(value){ return value.toString()}).join(".");
    }

    public getOctets(): Array<Octet> {
        return this.octets;
    }
}


export class IPv6Subnet implements InetNumber {
    readonly hexadecatet: Array<Hexadecatet> = [];
    readonly value: bigInt.BigInteger;

    static of(rawValue:string):IPv6Subnet {
        return new IPv6Subnet(rawValue);
    };

    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString: string) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = Validator.isValidIPv6Subnet(ipString);


        if (!isValid) {
            throw new Error(message);
        }

        let stringHexadecimals = ipString.split(":");

        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.of(stringHexadecatet)
        });

        this.value = bigInt(hexadectetNotationToBinaryString(ipString), 2);
    }

    public getValue():bigInt.BigInteger {
        return this.value;
    }

    public toString(): string {
        return this.hexadecatet.map(function(value){ return value.toString()}).join(":");
    }

    public getHexadecatet(): Array<Hexadecatet> {
        return this.hexadecatet;
    }
}