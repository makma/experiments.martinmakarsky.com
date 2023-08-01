import { NextApiResponse } from 'next';

export default async function handler(req: any, res: NextApiResponse) {

    if (req.method === 'POST') {
        const body = req.body
        if (!body) {
            return new Response(null, { status: 400 });
        }

        await createFirewallRule(body.ipAddress);

        return res.send({ status: 200 });
    } else {
        return res.send({ status: 405 });
    }
}

async function getCustomRulesetId() {
    const rulesets: Array<any> = await getZoneRulesets();
    const customRuleset = rulesets.find(item => { return item.phase === "http_request_firewall_custom" })
    return customRuleset.id;
}

async function getZoneRulesets() {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID ?? ""
    const apiToken = process.env.CLOUDFLARE_API_TOKEN ?? ""

    let url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`;

    let options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiToken}` }
    };

    try {
        const rulesets = await (await fetch(url, options)).json();
        console.log(JSON.stringify(rulesets))
        return rulesets.result;
    } catch (error) {
        console.error('error:' + error)
    }
}

async function createFirewallRule(ipAddress: string) {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN ?? ""
    const zoneId = process.env.CLOUDFLARE_ZONE_ID ?? ""

    const customRulesetId = await getCustomRulesetId();

    const ruleBody = {
        description: `Firewalll rule for ${ipAddress} created by Fingerprint.`,
        expression: `ip.src eq ${ipAddress}`,
        action: "block"
    }

    let url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${customRulesetId}/rules`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(ruleBody)
    };

    try {
        const blockAction = await (await fetch(url, options)).json();
        return blockAction.result;
    } catch (error) {
        console.error('error:' + error)
    }
}
