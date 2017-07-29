/**
 * Created by daderemi on 07/11/16.
 */

import {IPv4} from "../src/IPv4";
import {Validator} from "../src/Validator";
import * as bigInt from "big-integer";
import {bigIntegerNumberToHexadecimalString} from "../src/HexadecimalUtils";
import {bigIntegerNumberToBinaryString} from "../src/BinaryUtils";
import {IPv6} from "../src/IPv6";

describe('IPv6: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new IPv6(bigInt("1".repeat(128), 2)).toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });
});