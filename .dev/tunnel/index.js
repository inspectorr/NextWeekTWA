const localtunnel = require('localtunnel');
const { createHash } = require('crypto');

const PORT = 8765;

function getSubdomain() {
    if (process.env.DEV_TUNNEL_SUBDOMAIN) {
        return process.env.DEV_TUNNEL_SUBDOMAIN;
    }
    const hash = createHash('sha256').update(
        process.env.TELEGRAM_BOT_TOKEN + process.env.DEV_TUNNEL_SALT
    ).digest('hex');
    return hash.slice(0, 10);
}

(async () => {
    console.info(`Starting tunnel...`);
    const tunnel = await localtunnel({
        port: PORT,
        subdomain: getSubdomain(),
    });
    console.info(`${tunnel.url} tunnel started on port ${PORT}`);
})();
