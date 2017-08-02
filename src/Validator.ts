'use strict';
import {dottedDecimalNotationToBinary} from "./BinaryUtils";
import * as bigInt from "big-integer";
import {BigInteger} from "big-integer";

export class Validator {
    static IPV4_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])$/);
    static IPV4_RANGE_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    static SUBNET_BIT_PATTERN: RegExp = new RegExp(/^(1){0,32}(0){0,32}$/);

    static EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(8), 2);
    static SIXTEEN_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(16), 2);
    static THIRTY_TWO_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(32), 2);
    static ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(128), 2);

    static invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    static invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    static invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
    static invalidOctetRangeMessage = "The value given is less than zero or is greater than 8bit";
    static invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
    static invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    static invalidHexadecatetCountMessage = "An IP6 number cannot have less or greater than 8 octets";
    static invalidSubnetMessage = "The Subnet is invalid";
    static invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32 octets";
    static invalidCidrNotationString = "A Cidr notation string should contain an IP address and prefix eg 9.9.9.9/24";
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {boolean} true if is valid value, false otherwise
     */
    static isValidAsnNumber(asnNumber: bigInt.BigInteger): boolean {
        return this.isWithinRange(asnNumber, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
    }

    static isValid16BitAsnNumber(asnNumber: bigInt.BigInteger): boolean {
        return Validator.isWithinRange(asnNumber, bigInt.zero, Validator.SIXTEEN_BIT_SIZE);
    }

    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {boolean} true if is valid value, false otherwise
     */
    static isValidIPv4Number(ipv4Number: bigInt.BigInteger): [boolean, string]  {
        let isValid = this.isWithinRange(ipv4Number, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidIPv4NumberMessage];
    }

    static isValidIPv6Number(ipv6Number: bigInt.BigInteger): [boolean, string] {
        let isValid = this.isWithinRange(ipv6Number, bigInt.zero, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidIPv6NumberMessage];
    }

    /**
     * Checks if the number given is valid for an IPv4 octet
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    // TODO change this to return a tuple of is error and error message
    static isValidIPv4Octet(octetNumber: bigInt.BigInteger): boolean {
        return this.isWithinRange(octetNumber, bigInt.zero, this.EIGHT_BIT_SIZE);
    }

    static isValidIPv6Hexadecatet(hexadecatetNum: bigInt.BigInteger): [boolean, string] {
        let isValid = this.isWithinRange(hexadecatetNum, bigInt.zero, this.SIXTEEN_BIT_SIZE);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidHexadecatetMessage];
    }

    static isValidIPv4DecimalNotationString(ipv4String: string): [boolean, string] {
        let rawOctets = ipv4String.split(".");

        if (rawOctets.length != 4) {
            return [false, Validator.invalidOctetCountMessage];
        }

        let isValid = rawOctets.every(octet => Validator.isValidIPv4Octet(bigInt(parseInt(octet))));

        return [isValid, isValid ? "valid": Validator.invalidOctetRangeMessage];
    }

    static isValidIPv6NotationString(ipv6String: string): [boolean, string] {
        let hexadecimals = ipv6String.split(":");
        if (hexadecimals.length != 8) {
            return [false, Validator.invalidHexadecatetCountMessage]
        }

        let isValid = hexadecimals.every(hexadecimal => {
            let numberValue = parseInt(hexadecimal, 16);
            return Validator.isValidIPv6Hexadecatet(bigInt(numberValue))[0];
        });

        return [isValid, isValid? "valid": Validator.invalidHexadecatetMessage];
    }

    /**
     * Checks if given value is a valid prefix value
     * @param prefix value to check
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue: number): [boolean, string] {
        // TODO this will need to be revisited when working with ipv6
        let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(32));
        return [withinRange, withinRange ? "valid": Validator.invalidPrefixValueMessage];
    }

    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    static isWithinRange(ipNumber: bigInt.BigInteger, lowerBound: bigInt.BigInteger, upperBound: bigInt.BigInteger) : boolean {
        return ipNumber.greaterOrEquals(lowerBound) && ipNumber.lesserOrEquals(upperBound);
    }

    static isValidIPv4Subnet(ipv4Number: string) : [boolean, string] {
        let ipv4InBinary = dottedDecimalNotationToBinary(ipv4Number);
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

