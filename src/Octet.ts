import {Validator} from "./Validator"

/**
 * A binary representation of a 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Octet_(computing)} for more information on Octets
 *
 * An octet is used in the textual representation of an {@link IPv4} number, where the IP number value is divided
 * into 4 octets
 */
export class Octet {
    private readonly value: number;

    /**
     * Convenience method for creating an Octet out of a string value representing the value of the octet
     *
     * @param {string} rawValue the octet value in string
     * @returns {Octet} the Octet instance
     */
    static fromString(rawValue:string):Octet {
        return new Octet(rawValue);
    };

    /**
     * Convenience method for creating an Octet out of a numeric value representing the value of the octet
     *
     * @param {number} rawValue the octet value in number
     * @returns {Octet} the Octet instance
     */
    static fromNumber(rawValue:number):Octet {
        return new Octet(rawValue);
    };

    /**
     * Constructor for creating an instance of an Octet.
     *
     * The constructor parameter given could either be a string or number.
     *
     * If a string, it is the string representation of the numeric value of the octet
     * If a number, it is the numeric representation of the value of the octet
     *
     * @param {string | number} givenValue value of the octet to be created.
     */
    constructor(givenValue: string | number) {
        let octetValue: number;
        if (typeof givenValue === 'string') {
            octetValue = parseInt(givenValue);
        } else {
            octetValue = givenValue;
        }
        let [isValid, message] = Validator.isValidIPv4Octet(BigInt(octetValue));
        if (!isValid) {
            throw Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = octetValue;
    }

    /**
     * Method to get the numeric value of the octet
     *
     * @returns {number} the numeric value of the octet
     */
    public getValue():number {
        return this.value;
    }

    /**
     * Returns a decimal representation of the value of the octet in string
     *
     * @returns {string} a decimal representation of the value of the octet in string
     */
    public toString(): string {
        return this.value.toString(10);
    }
}