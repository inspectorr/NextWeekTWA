const localtunnel = require('localtunnel');
const { createHash } = require('crypto');

const PORT = 8765;

function getSubdomain() {
    const hash = createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN + process.env.APP_SALT).digest('hex');
    return hash.slice(0, 10);
}

(async () => {
    const tunnel = await localtunnel({
        port: PORT,
        subdomain: getSubdomain(),
    });
    console.info(`${tunnel.url} tunnel started on port ${PORT}`);
})();
