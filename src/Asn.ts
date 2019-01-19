import {Validator} from "./Validator"
import {IPNumber} from "./interface/IPNumber"
import {decimalNumberToBinaryString} from "./BinaryUtils";
import * as bigInt from "big-integer"
import {IPNumType} from "./IPNumType";
import {AbstractIPNum} from "./AbstractIPNum";

/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://www.rfc-editor.org/info/rfc4271
 */
export class Asn extends AbstractIPNum implements IPNumber {
    /**
     * The decimal value represented by the ASN number in BigInteger
     */
    readonly value:bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the ASN number
     */
    bitSize: number = 32;
    /**
     * The maximum bit size (i.e. binary value) of the ASN number in BigInteger
     */
    maximumBitSize: bigInt.BigInteger = Validator.THIRTY_TWO_BIT_SIZE;

    type: IPNumType = IPNumType.ASN;
    private static AS_PREFIX = "AS";

    /**
     * A convenience method for creating an instance of {@link Asn} from a string
     *
     * The given string can be in asplain, asdot or asdot+ representation format.
     * {@see https://tools.ietf.org/html/rfc5396} for more information on
     * the different ASN string representation
     *
     * @param {string} rawValue the asn string. In either asplain, asdot or asdot+ format
     * @returns {Asn} the constructed ASN instance
     */
    static fromString(rawValue:string):Asn {
        return new Asn(rawValue);
    };

    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} the constructed ASN instance
     */
    static fromNumber(rawValue:number):Asn {
        return new Asn(rawValue);
    };

    /**
     * A convenience method for creating an instance of {@link Asn} from a binary string
     *
     * @param {string} binaryString to create an ASN instance from
     * @returns {Asn} the constructed ASN instance
     */
    static fromBinaryString(binaryString: string): Asn {
        let validationResult = Validator.isValidBinaryString(binaryString);
        if (validationResult[0]) {
            return new Asn(parseInt(binaryString, 2))
        } else {
            throw Error(validationResult[1].join(','))
        }
    }

    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    constructor(rawValue:string | number) {
        super();
        if (typeof rawValue === 'string') {
            if (Asn.startWithASprefix(rawValue)) {
                this.value = bigInt(parseInt(rawValue.substring(2)));
            } else if(rawValue.indexOf(".") != -1) {
                this.value = bigInt(this.parseFromDotNotation(rawValue));
            } else {
                this.value = bigInt(parseInt(rawValue));
            }
        } else {
            let valueAsBigInt = bigInt(rawValue);
            let [isValid, message] = Validator.isValidAsnNumber(valueAsBigInt);
            if (!isValid) {
                throw Error(message.filter(msg => {return msg !== '';}).toString());
            }
            this.value = valueAsBigInt;
        }
    }

    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    toString():string {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }

    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    toASPlain():string {
        return this.value.toString();
    }

    /**
     * A string representation where the ASN value is represented using the asplain notation if the ASN value is
     * less than 65536 and uses asdot+ notation when the value is greater than 65536.
     *
     * For example 65526 will be represented as "65526" while 65546 will be represented as "1.10"
     *
     *
     * @returns {string} A string representation of the ASN in either asplain or asdot+ notation depending on
     * whether the numeric value of the ASN number is greater than 65526 or not.
     */
    toASDot():string {
        if (this.value.valueOf() >= 65536) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    }

    /**
     * A string representation where the ASN value is represented using the asdot+ notation
     *
     * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
     *
     */
    toASDotPlus():string {
        let high = Math.floor(this.value.valueOf() / 65535);
        let low = (this.value.valueOf() % 65535) - high;
        return `${high}.${low}`;
    }

    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    toBinaryString():string {
        return decimalNumberToBinaryString(this.value.valueOf());
    }

    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    is16Bit():boolean {
        let [valid16BitAsnNumber,] = Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
    }

    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    is32Bit():boolean {
        return !this.is16Bit();
    }

    /**
     * Returns the next ASN number
     *
     * @returns {IPNumber} the next ASN number
     */
    nextIPNumber(): IPNumber {
        return new Asn(this.value.valueOf() + 1);
    }

    /**
     * Returns the previous ASN number
     *
     * @returns {IPNumber} the previous ASN number
     */
    previousIPNumber(): IPNumber {
        return new Asn(this.value.valueOf() - 1)
    }

    private static startWithASprefix(word:string):boolean {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    }

    private parseFromDotNotation(rawValue: string): number {
        let values: string[] = rawValue.split(".");
        let high = parseInt(values[0]);
        let low = parseInt(values[1]);
        return (high * 65535) + (low + high);
    }
}