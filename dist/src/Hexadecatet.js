"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hexadecatet = void 0;
const Validator_1 = require("./Validator");
/**
 * A representation of a 4-digit hexadecimal number.
 *
 * It consists of four (base 16) number. ie FFFF
 *
 * It is used to represents the components of an IPv6 address
 */
class Hexadecatet {
    /**
     * Constructor for creating an instance of {@link Hexadecatet}
     *
     * @param {string | number} givenValue a string or numeric value. If given value is a string then it should be a
     * four (base 16) number representation of a 16bit value. If it is a number, then it should be a decimal number
     * representation of a 16 bit value
     */
    constructor(givenValue) {
        let hexadecatetValue;
        if (typeof givenValue === 'string') {
            hexadecatetValue = parseInt(givenValue, 16);
        }
        else {
            hexadecatetValue = parseInt(String(givenValue), 16);
        }
        let [isValid, message] = Validator_1.Validator.isValidIPv6Hexadecatet(BigInt(hexadecatetValue));
        if (!isValid) {
            throw Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = hexadecatetValue;
    }
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
     * representation of a 16bit value.
     *
     * @param {string} rawValue the four (base 16) number
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromString(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
     * of a 16 bit value
     *
     * @param {number} rawValue decimal number representation of a 16 bit value
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromNumber(rawValue) {
        return new Hexadecatet(rawValue);
    }
    ;
    /**
     * Returns the numeric value in base 10 (ie decimal)
     *
     * @returns {number} the numeric value in base 10 (ie decimal)
     */
    getValue() {
        return this.value;
    }
    /**
     * Returns the string representation of the base 16 representation of the value
     * @returns {string} the string representation of the base 16 representation of the value
     */
    // TODO pad with a zero if digit is less than 4
    toString() {
        return this.value.toString(16);
    }
}
exports.Hexadecatet = Hexadecatet;
//# sourceMappingURL=Hexadecatet.js.map