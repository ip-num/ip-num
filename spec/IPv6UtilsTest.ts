

import * as IPv6Utils from "../src/IPv6Utils";

describe('IPv6 Utils', () => {
    fit('Should correctly expand abbreviated ipv6 address', () => {
        expect(IPv6Utils.expandIpv6Address("::")).toBe("0000:0000:0000:0000:0000:0000:0000:0000");
        expect(IPv6Utils.expandIpv6Address("::1")).toBe("0000:0000:0000:0000:0000:0000:0000:0001");

        expect(IPv6Utils.expandIpv6Address("2001:0DB8::CD30:0:0:0:0")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIpv6Address("2001:0DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");
        expect(IPv6Utils.expandIpv6Address("2001:DB8:0:CD30::")).toBe("2001:0DB8:0000:CD30:0000:0000:0000:0000");

        expect(IPv6Utils.expandIpv6Address("2001:db8:85a3:0:0:8a2e:370:7334")).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(IPv6Utils.expandIpv6Address("2001:db8::2:1")).toBe("2001:0db8:0000:0000:0000:0000:0002:0001");
    });
});