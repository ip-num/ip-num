import {IPv6} from '../src/IPNumber';

describe('IPv6 with Zone ID', () => {
    it('should correctly parse an IPv6 address with a zone ID', () => {
        const ipv6 = new IPv6('fe80::a505:4c3:dc6f:409c%tailscale0');
        expect(ipv6.toCollapsedString()).toEqual('fe80::a505:4c3:dc6f:409c%tailscale0');
        expect(ipv6.zoneId).toEqual('tailscale0');
    });

    it('should correctly parse an IPv6 address without a zone ID', () => {
        const ipv6 = new IPv6('fe80::a505:4c3:dc6f:409c');
        expect(ipv6.toCollapsedString()).toEqual('fe80::a505:4c3:dc6f:409c');
        expect(ipv6.zoneId).toBeUndefined();
    });

    it('should throw an error for an invalid IPv6 address with a zone ID', () => {
        expect(() => {
            new IPv6('fe80::a505:4c3:dc6f:409c%invalid-zone-id!');
        }).toThrowError('Given IPv6 is not confirm to a valid IPv6 address');
    });
});
