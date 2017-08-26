'use strict';
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import * as bigInt from "big-integer";
import {InetNumType} from "./InetNumType";
import {hexadectetNotationToBinaryString} from "./IPv6Utils";

export class Validator {
    static IPV4_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-5][0-5])$/);
    static IPV4_RANGE_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    static IPV6_RANGE_PATTERN: RegExp = new RegExp(/^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
    static IPV4_SUBNET_BIT_PATTERN: RegExp = new RegExp(/^(1){0,32}(0){0,32}$/);
    static IPV6_SUBNET_BIT_PATTERN: RegExp = new RegExp(/^(1){0,128}(0){0,128}$/);

    static EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(8), 2);
    static SIXTEEN_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(16), 2);
    static THIRTY_TWO_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(32), 2);
    static ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(128), 2);

    static invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    static invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    static invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
    static invalidOctetRangeMessage = "Value given contains an invalid Octet; Value is less than zero or is greater than 8bit";
    static invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
    static invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    static invalidHexadecatetCountMessage = "An IP6 number cannot have less or greater than 8 octets";
    static invalidSubnetMessage = "The Subnet is invalid";
    static invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32";
    static invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip address]/[range]";
    static invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 address and prefix";
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
    static isValidPrefixValue(prefixValue: number, type: InetNumType): [boolean, string] {
        if (InetNumType.IPv4 === type) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(32));
            return [withinRange, withinRange ? "valid": Validator.invalidPrefixValueMessage];
        }
        if (InetNumType.IPv6 === type) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(128));
            return [withinRange, withinRange ? "valid": Validator.invalidPrefixValueMessage];
        }
        return [false, "Given type must be either InetNumType.IPv4 or InetNumType.IPv6"]
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
        let ipv4InBinary = dottedDecimalNotationToBinaryString(ipv4Number);
        let isValid = Validator.IPV4_SUBNET_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidSubnetMessage];
    }

    static isValidIPv6Subnet(ipv6Number: string) : [boolean, string] {
        let ipv6InBinary = hexadectetNotationToBinaryString(ipv6Number);
        let isValid = Validator.IPV6_SUBNET_BIT_PATTERN.test(ipv6InBinary);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidSubnetMessage];
    }


    static isValidIPv4CidrNotation(ipv4Range: string): [boolean, string[]] {
        let cidrComponents = ipv4Range.split("/");
        if(cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }

        let ip = cidrComponents[0];
        let range = cidrComponents[1];


        let [validIpv4, invalidIpv4Message] = Validator.isValidIPv4DecimalNotationString(ip);
        let [validPrefix, invalidPrefixMessage] = Validator.isValidPrefixValue(parseInt(range), InetNumType.IPv4);

        let isValid = validIpv4 && validPrefix;
        if (invalidIpv4Message === 'valid') {
            invalidIpv4Message = '';
        }
        if (invalidPrefixMessage === 'valid') {
            invalidPrefixMessage = '';
        }
        let invalidMessage = [invalidIpv4Message, invalidPrefixMessage];

        return isValid ? [isValid, []]: [isValid, invalidMessage];
    }

    static isValidIPv6CidrNotation(ipv6Range: string): [boolean, string] {
        let isValid = Validator.IPV6_RANGE_PATTERN.test(ipv6Range);
        return isValid ? [isValid, "valid"]: [isValid, Validator.invalidIPv6CidrNotationString];
    }

}

