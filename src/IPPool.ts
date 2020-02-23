import {Range} from "./IPRange";
import {IPv4, IPv6} from "./IPNumber";


class Pool<T extends Range<IPv4> | Range<IPv6>> {
    public static fromIPNumbers(...ipnumbers: IPv4[] | IPv6[]) {
        ipnumbers.forEach((ip:IPv4 | IPv6) => {
            new Range(ip, ip);
        })

    }
}