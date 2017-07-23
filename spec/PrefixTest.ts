/**
 * Created by daderemi on 24/04/17.
 */

import {Ipv4Prefix} from "../src/Prefix";
import {Validator} from "../src/Validator";


describe('Ipv4Prefix: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new Ipv4Prefix(24).toString()).toEqual("24");
        expect(new Ipv4Prefix(24).getValue()).toEqual(24);
    });

    it('should instantiate by convenient method', () => {
        expect(Ipv4Prefix.of(23).toString()).toEqual("23");
        expect(Ipv4Prefix.of(23).getValue()).toEqual(23);
    });

    it('should throw exception if prefix is an invalid number', () => {
        expect(() => {
            new Ipv4Prefix(200);
        }).toThrowError(Error, Validator.invalidPrefixValueMessage);
    });

    it('should convert correctly to subnet', () => {
        // TODO add other subnet
        expect(Ipv4Prefix.of(16).toSubnet().toString()).toEqual("255.255.0.0");
        expect(Ipv4Prefix.of(17).toSubnet().toString()).toEqual("255.255.128.0");
        expect(Ipv4Prefix.of(18).toSubnet().toString()).toEqual("255.255.192.0");
        expect(Ipv4Prefix.of(19).toSubnet().toString()).toEqual("255.255.224.0");
        expect(Ipv4Prefix.of(20).toSubnet().toString()).toEqual("255.255.240.0");
        expect(Ipv4Prefix.of(21).toSubnet().toString()).toEqual("255.255.248.0");
        expect(Ipv4Prefix.of(22).toSubnet().toString()).toEqual("255.255.252.0");
        expect(Ipv4Prefix.of(23).toSubnet().toString()).toEqual("255.255.254.0");
        expect(Ipv4Prefix.of(24).toSubnet().toString()).toEqual("255.255.255.0");
        expect(Ipv4Prefix.of(25).toSubnet().toString()).toEqual("255.255.255.128");
        expect(Ipv4Prefix.of(26).toSubnet().toString()).toEqual("255.255.255.192");
        expect(Ipv4Prefix.of(27).toSubnet().toString()).toEqual("255.255.255.224");
        expect(Ipv4Prefix.of(28).toSubnet().toString()).toEqual("255.255.255.240");
        expect(Ipv4Prefix.of(29).toSubnet().toString()).toEqual("255.255.255.248");
        expect(Ipv4Prefix.of(30).toSubnet().toString()).toEqual("255.255.255.252");
        expect(Ipv4Prefix.of(31).toSubnet().toString()).toEqual("255.255.255.254");
        expect(Ipv4Prefix.of(32).toSubnet().toString()).toEqual("255.255.255.255");
    });

});