'use strict';
import {dottedDecimalToBinary} from "./BinaryUtils";
import * as bigInt from "big-integer";

export class Validator {
    static IPV4_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])$/);
    static IPV4_RANGE_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    static SUBNET_BIT_PATTERN: RegExp = new RegExp(/^(1){0,32}(0){0,32}$/);

    // NOTE it is safe to use native javascript number here since they are less than Number.MAX_SAFE_INTEGER
    static THIRTY_TWO_BIT_SIZE: number = Math.pow(2, 32) - 1;
    static SIXTEEN_BIT_SIZE: number = Math.pow(2, 16) - 1;
    static EIGHT_BIT_SIZE: number = Math.pow(2, 8) - 1;

    static invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    static invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    static invalidOctetRangeMessage = "The value given is less than zero or is greater than 8bit";
    static invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    static invalidSubnetMessage = "The Subnet is invalid";
    static invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32 octets";
    static invalidCidrNotationString = "A Cidr notation string should contain an IP address and prefix eg 9.9.9.9/24";
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {boolean} true if is valid value, false otherwise
     */
    static isValidAsnNumber(asnNumber: number): boolean {
        return this.isWithinRange(asnNumber, 0, this.THIRTY_TWO_BIT_SIZE);
    }

    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {boolean} true if is valid value, false otherwise
     */
    static isValidIPv4Number(ipv4Number: bigInt.BigInteger): [boolean, string]  {
        let isValid = this.isWithinRange(ipv4Number.valueOf(), 0, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidIPv4NumberMessage];
    }

    /**
     * Checks if the number given is valid for an IPv4 octet
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    // TODO change this to return a tuple of is error and error message
    static isValidIPv4Octet(octetNumber: number): boolean {
        return this.isWithinRange(octetNumber, 0, this.EIGHT_BIT_SIZE);
    }

    static isValidIPv4DecimalNotationString(ipv4Number: string): [boolean, string] {
        let rawOctets = ipv4Number.split(".");

        if (rawOctets.length != 4) {
            return [false, Validator.invalidOctetCountMessage];
        }

        rawOctets.forEach(function (octet) {
            if(!Validator.isValidIPv4Octet(parseInt(octet))) {
                return [false, Validator.invalidOctetRangeMessage]
            }

        });

        return [true, "valid"]
    }


    /**
     * Checks if given value is a valid prefix value
     * @param prefix value to check
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue: number): [boolean, string] {
        // TODO this will need to be revisited when working with ipv6
        let withinRange = Validator.isWithinRange(prefixValue, 0, 32);
        return [withinRange, withinRange ? "valid": Validator.invalidPrefixValueMessage];
    }

    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    static isWithinRange(ipNumber: number, lowerBound: number, upperBound: number) : boolean {
        return ipNumber >= lowerBound && ipNumber <= upperBound;
    }

    static isValidIPv4Subnet(ipv4Number: string) : [boolean, string] {
        let ipv4InBinary = dottedDecimalToBinary(ipv4Number);
        let isValid = Validator.SUBNET_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidSubnetMessage];
    }

    // TODO maybe switch to a non-regex, manual validation? the benefit of that is it would be possible
    // to actually report why the given string is an invalid cidr notation
    static isValidCidrNotation(ipv4Range: string): [boolean, string] {
        let isValid = Validator.IPV4_RANGE_PATTERN.test(ipv4Range);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidCidrNotationString];
    }
}

