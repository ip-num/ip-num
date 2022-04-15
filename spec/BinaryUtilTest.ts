import * as BinaryUtils from "../src/BinaryUtils";
import {IPNumType} from "../src";
import {intLog2, matchingBitCount} from "../src";

describe('Binary Utils', () => {
    it('Should correctly convert decimal to binary', () => {
        expect(BinaryUtils.numberToBinaryString(1234) === '10011010010').toEqual(true);
    });
    it('Should correctly parse binary string to a number in BigInt', () => {
        expect(BinaryUtils.parseBinaryStringToBigInt('10011010010')).toEqual(1234n);
    });
    it('Should correctly convert binary to decimal', () => {
        expect(BinaryUtils.parseBinaryStringToBigInt('10011010010').valueOf() === 1234n).toEqual(true);
    });
    it('Should correctly convert a big int number to binary string', () => {
        expect(BinaryUtils.numberToBinaryString(1234n)).toBe('10011010010');
        expect(BinaryUtils.numberToBinaryString(4294967295n)).toBe('11111111111111111111111111111111')
    });
    it('Should correctly convert binary to decimal and back to binary', () => {
        let originalBinary = '10011010010';
        let decimal = BinaryUtils.parseBinaryStringToBigInt(originalBinary).valueOf();
        let finalBinary = BinaryUtils.numberToBinaryString(Number(decimal));
        expect(originalBinary.toString() === finalBinary).toEqual(true);
    });
    it('Should correctly convert decimal number to octets', () => {
        let decimalValue = 10;
        let octet = BinaryUtils.decimalNumberToOctetString(decimalValue);
        expect(octet).toEqual('00001010')
    });
    it('Should throw an exception when converting to octet and value is larger than an octet', () => {
        expect(() => {
            BinaryUtils.decimalNumberToOctetString(122222222222);
        }).toThrowError(Error, 'Given decimal in binary contains digits greater than an octet');
    });
    it('Should correctly convert IP number in dotted decimal notation to binary string', () => {
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('2.16.217.69')).toEqual('00000010000100001101100101000101');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('0.0.0.0')).toEqual('00000000000000000000000000000000');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('255.255.255.255')).toEqual('11111111111111111111111111111111');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('254.198.20.255')).toEqual('11111110110001100001010011111111');
    });
    it('Should pad given string with zeros to become given length', () => {
        expect(BinaryUtils.leftPadWithZeroBit('10', 5)).toEqual('00010');
        expect(BinaryUtils.leftPadWithZeroBit('00010', 5)).toEqual('00010');
    });
    it('Should throw an exception if given string is already greater than required final length after padding', () => {
        expect(()=> {
            BinaryUtils.leftPadWithZeroBit('111111110', 5)
        }).toThrowError(Error, 'Given string is already longer than given final length after padding: 5');
    });
    describe('IPv4 cidr prefix to binary string', () => {
      it('should convert a 24 prefix', () => {
        expect(BinaryUtils.cidrPrefixToMaskBinaryString(24, IPNumType.IPv4)).toBe(`${"1".repeat(24)}${"0".repeat(8)}`)
      });
      it('should convert a 32 prefix', () => {
        expect(BinaryUtils.cidrPrefixToMaskBinaryString(32, IPNumType.IPv4)).toBe(`${"1".repeat(32)}`)
      });
      it('should throw an exception when converting 33 prefix', () => {
        expect(() => {
          BinaryUtils.cidrPrefixToMaskBinaryString(33, IPNumType.IPv4);
        }).toThrowError(Error, 'Value is greater than 32');
      });
    });
    describe('IPv6 cidr prefix to binary string', () => {
      it('should convert a 64 prefix', () => {
      expect(BinaryUtils.cidrPrefixToMaskBinaryString(64, IPNumType.IPv6)).toBe(`${"1".repeat(64)}${"0".repeat(64)}`)
      });
      it('should convert a 128 prefix', () => {
        expect(BinaryUtils.cidrPrefixToMaskBinaryString(128, IPNumType.IPv6)).toBe(`${"1".repeat(128)}`)
      });
      it('should throw an exception when converting 130 prefix', () => {
        expect(() => {
        BinaryUtils.cidrPrefixToMaskBinaryString(130, IPNumType.IPv6);
        }).toThrowError(Error, 'Value is greater than 128');
      });
    });

    describe('log2', () => {
        it('should calculate the log2 of a number', () => {
            expect(intLog2(8n)).toBe(3);
            expect(intLog2(256n)).toBe(8);
        });

        it('should throw an exception when no int log2', () => {
            expect(() => {
                intLog2(12n)
            }).toThrowError(Error)
        })
    })

    describe('matchingBitCount', () => {
        it('should return matching bit count same string', () => {
            expect(matchingBitCount("1010111", "1010111")).toEqual(7)
        });
        it('should return matching bit count different string same length', () => {
            expect(matchingBitCount("10101110100111010", "10101111101101110")).toEqual(7)
        });
        it('should return matching bit count different string, first string longer', () => {
            expect(matchingBitCount("10101110100111010001111", "10101111101101110")).toEqual(7)
        });
        it('should return matching bit count different string, second string longer', () => {
            expect(matchingBitCount("10101110100111010", "101011111011011100001111")).toEqual(7)
        });
    });
});