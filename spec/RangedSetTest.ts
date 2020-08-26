import {IPv4, IPv4CidrRange, IPv4Prefix, IPv6, IPv6CidrRange, IPv6Prefix, RangedSet} from "../src";
import bigInt = require("big-integer");


describe('RangedSet: ', () => {

    it("create from single IPv4", () => {
        let singleton = RangedSet.fromSingleIP(new IPv4("0.0.0.254"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("0.0.0.254");
        expect(singleton.getLast().toString()).toBe("0.0.0.254");
    });

    it("create from range string", () => {
        let rangedSet= RangedSet.fromRangeString("127.0.0.0-127.0.0.255");
        expect(rangedSet.getFirst().toString()).toEqual("127.0.0.0");
        expect(rangedSet.getLast().toString()).toEqual("127.0.0.255");
    });

    it("create from range string with spaces", () => {
        let rangedSet= RangedSet.fromRangeString("127.0.0.0 - 127.0.0.255");
        expect(rangedSet.getFirst().toString()).toEqual("127.0.0.0");
        expect(rangedSet.getLast().toString()).toEqual("127.0.0.255");
    });

    it("throw if create string is not well formed I", () => {
        expect(() => {
            let rangedSet= RangedSet.fromRangeString("127.0.0.0127.0.0.255");
        }).toThrowError(Error, "Argument should be in the format firstip-lastip");
    });

    it("throw if create string is not well formed II", () => {
        expect(() => {
            let rangedSet= RangedSet.fromRangeString("127.0.0.0--127.0.0.255");
        }).toThrowError(Error, "Argument should be in the format firstip-lastip");
    });

    it("throw if create string is not well formed III", () => {
        expect(() => {
            let rangedSet= RangedSet.fromRangeString("127.0.0-127.0.0");
        }).toThrowError(Error, "First IP and Last IP should be valid and same type");
    });

    it("throw if create string is not well formed IV", () => {
        expect(() => {
            let rangedSet= RangedSet.fromRangeString("127.0.0.0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
        }).toThrowError(Error, "First IP and Last IP should be valid and same type");
    });

    it("create from single IPv6", () => {
        let singleton = RangedSet.fromSingleIP(new IPv6("2001:db8:0:ffff:ffff:ffff:ffff:ffff"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
        expect(singleton.getLast().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });

    it("test for of", () => {
        let range = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take without count', () => {
        let range = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range.take()) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take with count', () => {
        let range = new RangedSet(new IPv4("0.0.0.0"), new IPv4("255.255.255.255"));
        let index = 0;
        let expected = ["0.0.0.0","0.0.0.1", "0.0.0.2", "0.0.0.3", "0.0.0.4"];
        for (let ip of range.take(5)) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it("fromCidr static constructor for IPv4", () => {
        let range = RangedSet
            .fromCidrRange(
                new IPv4CidrRange(IPv4.fromDecimalDottedString("127.0.0.0"), IPv4Prefix.fromNumber(24))
            );
        expect(range.getFirst().toString()).toBe("127.0.0.0");
        expect(range.getLast().toString()).toBe("127.0.0.255");
    });

    it("fromCidr static constructor for IPv6", () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let range = RangedSet
            .fromCidrRange(ipv6CidrRange);

        expect(range.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
        expect(range.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it("should perform equality check, true", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let secondRange = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(true);
    });
    it("should perform equality check, false", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.253"), new IPv4("0.0.1.2"));
        let secondRange = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(false);
    });
    it("should perform union of ranges: equal ranges", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let secondRange = new RangedSet(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(firstRange)).toBe(true);
    });
    it("should perform union of ranges: overlap range left", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.0"), new IPv4("0.0.0.2"));
        let secondRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.3"));

        let expected = new RangedSet(new IPv4("0.0.0.0"), new IPv4("0.0.0.3"));

        let union = firstRange.union(secondRange);

        expect(union.isEquals(expected)).toBe(true);
    });
    it("should perform union of ranges: overlap range right", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.3"));
        let secondRange = new RangedSet(new IPv4("0.0.0.0"), new IPv4("0.0.0.2"));

        let expected = new RangedSet(new IPv4("0.0.0.0"), new IPv4("0.0.0.3"));

        let union = firstRange.union(secondRange);

        expect(union.isEquals(expected)).toBe(true);
    });

    it("should perform union of ranges: contains the other", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let secondRange = new RangedSet(new IPv4("0.0.0.2"), new IPv4("0.0.0.4"));
        let expected = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });

    it("should perform union of ranges: contains by the other", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.2"), new IPv4("0.0.0.4"));
        let secondRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let expected = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });


    it("should preprend", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.5"), new IPv4("0.0.0.10"));
        let secondRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.4"));
        let extendedRange = firstRange.prepend(secondRange);

        expect(extendedRange.toRangeString()).toEqual("0.0.0.1-0.0.0.10")
    });

    it("should throw if ranges not adjacent when preprending", () => {
        var firstRange = new RangedSet(new IPv4("0.0.0.5"), new IPv4("0.0.0.10"));
        var secondRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));

        expect(() => {
            let extendedRange = firstRange.prepend(secondRange);
        }).toThrowError(Error);

        var firstRange = new RangedSet(new IPv4("0.0.0.7"), new IPv4("0.0.0.10"));
        var secondRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));

        expect(() => {
            let extendedRange = firstRange.prepend(secondRange);
        }).toThrowError(Error);
    });


    it("should append", () => {
        let firstRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.4"));
        let secondRange = new RangedSet(new IPv4("0.0.0.5"), new IPv4("0.0.0.10"));
        let extendedRange = firstRange.append(secondRange);

        expect(extendedRange.toRangeString()).toEqual("0.0.0.1-0.0.0.10")
    });

    it("should throw if ranges not adjacent when appending", () => {
        var firstRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        var secondRange = new RangedSet(new IPv4("0.0.0.5"), new IPv4("0.0.0.10"));

        expect(() => {
            let extendedRange = firstRange.append(secondRange);
        }).toThrowError(Error);

        var firstRange = new RangedSet(new IPv4("0.0.0.1"), new IPv4("0.0.0.3"));
        var secondRange = new RangedSet(new IPv4("0.0.0.9"), new IPv4("0.0.0.10"));

        expect(() => {
            let extendedRange = firstRange.append(secondRange);
        }).toThrowError(Error);

    });

    it('should convert range to Cidr range IPv4', () => {
        let convertedRange = new RangedSet(
            IPv4.fromDecimalDottedString("127.0.0.0"),
            IPv4.fromDecimalDottedString("127.0.0.255")
            ).toCidrRange();

        expect(convertedRange.toCidrString()).toEqual("127.0.0.0/24")
    });

    it('should convert range to Cidr range IPv6', () => {
        let convertedRange = new RangedSet(
            IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
            IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
        ).toCidrRange();

        expect(convertedRange.toCidrString()).toEqual("2620:0:0:0:0:0:0:0/32")
    });

    it('should not convert range to IPv4 Cidr range', () => {
        expect(() => {
            new RangedSet(
                IPv4.fromDecimalDottedString("127.0.0.1"),
                IPv4.fromDecimalDottedString("127.0.1.0")
            ).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });

    it('should not convert range to IPv6 Cidr range', () => {
        expect(() => {
            new RangedSet(
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"),
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:1:0"),
            ).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });

    it('should not convert range to IPv4 Cidr range', () => {
        expect(() => {
            new RangedSet(
                IPv4.fromDecimalDottedString("127.0.0.1"),
                IPv4.fromDecimalDottedString("127.0.0.255")
            ).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });

    it('should not convert range to IPv6 Cidr range', () => {
        expect(() => {
            new RangedSet(
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"),
                IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee")
            ).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });

    it("should throw error when constructing with first grater than last", () => {
        expect(() => {
            new RangedSet(
                IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee"),
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1")
            )
        }).toThrowError(Error);
    });

    describe("Make Range", () => {
        describe("IPv4", () => {

            it("should pick whole range as sub range", () => {
                let originalRange = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt.zero, bigInt(0));
                }).toThrowError(Error, "Sub range cannot be zero");
            });

            it("should pick whole range as sub range", () => {
                let originalRange = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let subRange = originalRange.takeSubRange(bigInt.zero, bigInt(256));
                expect(subRange.toRangeString()).toEqual("127.0.0.0-127.0.0.255");
            });
            it("should pick whole range with offset 1", () => {
                let originalRange = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let subRange = originalRange.takeSubRange(bigInt.one, bigInt(255));
                expect(subRange.toRangeString()).toEqual("127.0.0.1-127.0.0.255");
            });
            it("should throw an exception if size is larger than range", () => {
                let originalRange = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt.zero, bigInt(257));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });

            it("should throw an exception if size is larger than range due to offset", () => {
                let originalRange = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt(4), bigInt(256));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });

        });

        describe("IPv6", () => {

            it("should pick whole range as sub range", () => {
                let originalRange = new RangedSet(
                    IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt.zero, bigInt(0));
                }).toThrowError(Error, "Sub range cannot be zero");
            });

            it("should pick whole range as sub range", () => {
                let originalRange = new RangedSet(
                    IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let subRange = originalRange.takeSubRange(bigInt.zero, bigInt("20282409603651670423947251286016"));
                expect(subRange.toRangeString()).toEqual("2001:d00:0:0:0:0:0:0-2001:dff:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("should pick whole range with offset 1", () => {
                let originalRange = new RangedSet(
                    IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let subRange = originalRange.takeSubRange(bigInt.one, bigInt("20282409603651670423947251286015"));
                expect(subRange.toRangeString()).toEqual("2001:d00:0:0:0:0:0:1-2001:dff:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("should throw an exception if size is larger than range", () => {
                let originalRange = new RangedSet(
                    IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt.zero, bigInt("20282409603651670423947251286018"));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });

            it("should throw an exception if size is larger than range due to offset", () => {
                let originalRange = new RangedSet(
                    IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                expect(()=>{
                    let subRange = originalRange.takeSubRange(bigInt("20282409603651670423947251286018"), bigInt("20282409603651670423947251286018"));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });
        });
    });

    describe("Subtract Range", () => {
        describe("IPv4", () => {
            it("it should subtract all", () => {
                let original = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let toSubtract = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(0);
            });

            it("it should subtract from beginning", () => {
                let original = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let toSubtract = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.3")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("127.0.0.4-127.0.0.255");
            });

            it("it should subtract up to end", () => {
                let original = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let toSubtract = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.253"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("127.0.0.0-127.0.0.252");
            });

            it("it should subtract from middle", () => {
                let original = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.0"),
                    IPv4.fromDecimalDottedString("127.0.0.255")
                );

                let toSubtract = new RangedSet(
                    IPv4.fromDecimalDottedString("127.0.0.240"),
                    IPv4.fromDecimalDottedString("127.0.0.250")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(2);
                expect(result[0].toRangeString()).toEqual("127.0.0.0-127.0.0.239");
                expect(result[1].toRangeString()).toEqual("127.0.0.251-127.0.0.255");
            });

            describe("Less than test", () => {
                it('should tell if less than if first ip is less', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.16"),
                        IPv4.fromDecimalDottedString("192.168.0.63")
                    );

                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(true);
                });
                it('should tell if less than based on size if first ip is same', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.255")
                    );

                    expect(first.isLessThan(second)).toBe(true);
                    expect(second.isLessThan(first)).toBe(false);
                });
                it('should tell if less than when equals', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(false);
                });
            });
            describe("Greater than test", () => {
                it('should tell if less than if first ip is less', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.16"),
                        IPv4.fromDecimalDottedString("192.168.0.63")
                    );

                    expect(first.isGreaterThan(second)).toBe(true);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
                it('should tell if less than based on size if first ip is same', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.255")
                    );

                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(true);
                });
                it('should tell if less than when equals', () => {
                    let first = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    let second = new RangedSet(
                        IPv4.fromDecimalDottedString("192.168.0.128"),
                        IPv4.fromDecimalDottedString("192.168.0.159")
                    );

                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
            });

        });

        describe("IPv6", () => {

            it("create from range string", () => {
                let rangedSet= RangedSet.fromRangeString("2620:0:0:0:0:0:0:0-2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                expect(rangedSet.getFirst().toString()).toEqual("2620:0:0:0:0:0:0:0");
                expect(rangedSet.getLast().toString()).toEqual("2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });

            it("create from range string with spaces", () => {
                let rangedSet= RangedSet.fromRangeString("2620:0:0:0:0:0:0:0 - 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                expect(rangedSet.getFirst().toString()).toEqual("2620:0:0:0:0:0:0:0");
                expect(rangedSet.getLast().toString()).toEqual("2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });

            it("throw if create string is not well formed I", () => {
                expect(() => {
                    let rangedSet= RangedSet.fromRangeString("2620:0:0:0:0:0:0:02620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "Argument should be in the format firstip-lastip");
            });

            it("throw if create string is not well formed II", () => {
                expect(() => {
                    let rangedSet= RangedSet.fromRangeString("2620:0:0:0:0:0:0:0 -- 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "Argument should be in the format firstip-lastip");
            });

            it("throw if create string is not well formed II", () => {
                expect(() => {
                    let rangedSet= RangedSet.fromRangeString("2620::::0:0 - 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "First IP and Last IP should be valid and same type");
            });

            it("it should subtract all", () => {
                let original = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let toSubtract = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(0);
            });

            it("it should subtract from beginning", () => {
                let original = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let toSubtract = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:3"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:2");
            });

            it("it should subtract up to end", () => {
                let original = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let toSubtract = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:bbbb"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:bbba");
            });

            it("it should subtract from middle", () => {
                let original = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                );

                let toSubtract = new RangedSet(
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:200"),
                    IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:400")
                );

                let result = original.difference(toSubtract);
                expect(result.length).toEqual(2);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:1ff");
                expect(result[1].toRangeString()).toEqual("2620:0:0:0:0:0:0:401-2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });

            describe("Less than test", () => {
                it('should tell if less than if first ip is less', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(true);
                });
                it('should tell if less than based on size if first ip is same', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isLessThan(second)).toBe(true);
                    expect(second.isLessThan(first)).toBe(false);
                });
                it('should tell if less than when equals', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(false);
                });
            });
            describe("Greater than test", () => {
                it('should tell if less than if first ip is less', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isGreaterThan(second)).toBe(true);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
                it('should tell if less than based on size if first ip is same', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(true);
                });
                it('should tell if less than when equals', () => {
                    let first = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    let second = new RangedSet(
                        IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"),
                        IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff")
                    );

                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
            });
        });
    });
});