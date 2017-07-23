'use strict';

import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {InetNumber} from "./interface/InetNumber";
import * as bigInt from "big-integer"
import {dottedDecimalToBinary} from "./BinaryUtils";

export class Subnet implements InetNumber {
    readonly octets: Array<Octet> = [];
    readonly value: bigInt.BigInteger;

    static of(rawValue:string):Subnet {
        return new Subnet(rawValue);
    };

    // TODO similar code as in constructor of Ipv4, reuse?
    constructor(ipString: string) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = Validator.isValidIpv4Subnet(ipString);

        if (!isValid) {
            throw new Error(message);
        }

        let stringOctets = ipString.split(".");

        this.octets = stringOctets.map((rawOctet) => {
            return Octet.of(rawOctet)
        });

        this.value = bigInt(dottedDecimalToBinary(ipString), 2);
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