const os = require('os');
const ping = require('ping');
const ipcidr = require("ip-cidr");
const dns = require("dns");

const lan = process.argv[2];
let local = os.networkInterfaces()
if (lan) {
    // if arg filter to lan, else 'all'
    local = local[lan]
}

for (var net in local) {
    if (local[net]['family'] === 'IPv4') {
        // filter to IPv4
        const cidr = new ipcidr(local[net].cidr);
        cidr.loop((ip) => {
            // loop over ip address in cidr block
            ping.sys.probe(ip, (alive) => {
                if (alive) {
                    // responsive ping
                    dns.reverse(ip, (err, domains) => {
                        if (err != null) { return; }
                        console.log(ip, domains)
                    });

                }
            });
        });

        break
    }
}
