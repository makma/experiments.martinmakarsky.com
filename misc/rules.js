{rules:[
    {
        dashboardExpression: "Incognito or private modes are being detected",
        dashboardOperators: ["eq", "ne"],
        dashboardValues: [true, false],
        expression: "products.incognito.data.result",
        operator: "eq",
        value: true,
        message: "Incognito mode is not allowed.",
        status: 403
    },
    {
        dashboardExpression: "Visitor seen for the first time",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.identification.data.visitorFound",
        operator: "eq",
        value: true,
        message: "First time visitors must login via passkey.",
        status: 403
    },
    {
        dashboardExpression: "Request's country code",
        dashboardOperators: ["eq", "ne"],
        dashboardValues: "text field input",
        expression: "products.identification.data.ipLocation.country.code",
        operator: "eq",
        value: "US",
        message: "Requests from the given country code are not allowed.",
        status: 403
    },
    {
        dashboardExpression: "Request's confidence score is",
        dashboardOperators: ["gt", "lt"],
        dashboardValues: "number field input",
        expression: "products.identification.data.confidence.score",
        operator: "lt",
        value: "0.8",
        message: "Low confidence score.",
        status: 403
    },
    {
        dashboardExpression: "Bot result",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: ["notDetected", "good", "bad"],
        expression: "products.botd.data.bot.result",
        operator: "eq",
        value: "bad",
        message: "Bad bot detected.",
        status: 403
    },
    {
        dashboardExpression: "Android rooted device detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.rootApps.data.result",
        operator: "eq",
        value: true,
        message: "Rooted device detected.",
        status: 403
    },
    {
        dashboardExpression: "Android emulator detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.emulator.data.result",
        operator: "eq",
        value: true,
        message: "Android emulator detected.",
        status: 403
    },
    {
        dashboardExpression: "Android cloned app detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.clonedApp.data.result",
        operator: "eq",
        value: true,
        message: "Android cloned app detected.",
        status: 403
    },
    {
        dashboardExpression: "Jailbroken device detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.jailbroken.data.result",
        operator: "eq",
        value: true,
        message: "Jailbroken device detected.",
        status: 403
    },
    {
        dashboardExpression: "Frida device detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.frida.data.result",
        operator: "eq",
        value: true,
        message: "Frida device detected.",
        status: 403
    },
    {
        dashboardExpression: "Request comes from the blocklisted IP",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.ipBlocklist.data.result",
        operator: "eq",
        value: true,
        message: "Request comes from the blocklisted IP.",
        status: 403
    },
    {
        dashboardExpression: "Request comes from the TOR network",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.tor.data.result",
        operator: "eq",
        value: true,
        message: "Request comes from the TOR network.",
        status: 403
    },
    {
        dashboardExpression: "Request comes from the VPN",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.vpn.data.result",
        operator: "eq",
        value: true,
        message: "Request comes from the VPN.",
        status: 403
    },
    {
        dashboardExpression: "Request comes from the proxy",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.proxy.data.result",
        operator: "eq",
        value: true,
        message: "Request comes from the proxy.",
        status: 403
    },
    {
        dashboardExpression: "Request comes from the antidetect browser",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.tampering.data.antiDetectBrowser",
        operator: "eq",
        value: true,
        message: "Request comes from the antidetect browser.",
        status: 403
    },
    {
        dashboardExpression: "Browser tampering detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.tampering.data.result",
        operator: "eq",
        value: true,
        message: "Browser tampering detected.",
        status: 403
    },
    {
        dashboardExpression: "Privacy-focussed browser detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.privacySettings.data.result",
        operator: "eq",
        value: true,
        message: "Privacy-focussed browser detected.",
        status: 403
    },
    {
        dashboardExpression: "Virtual machine detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.virtualMachine.data.result",
        operator: "eq",
        value: true,
        message: "Virtual machine detected.",
        status: 403
    },
    {
        dashboardExpression: "Geolocation spoofing detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.locationSpoofing.data.result",
        operator: "eq",
        value: true,
        message: "Geolocation spoofing detected.",
        status: 403
    },
    {
        dashboardExpression: "Suspect score is",
        dashboardOperators: ["lt", "gt"],
        dashboardValues: "number field input",
        expression: "products.suspectScore.data.result",
        operator: "gt",
        value: 10,
        message: "High suspect score.",
        status: 403
    },
    {
        dashboardExpression: "Remote control tools detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: [true, false],
        expression: "products.remoteControl.data.result",
        operator: "eq",
        value: true,
        message: "Remote control tools detected.",
        status: 403
    },
    {
        dashboardExpression: "Number of distinct countries associated with the visitor during the last 24 hours",
        dashboardOperators: ["lt", "gt"],
        dashboardValues: "number field input",
        expression: "products.velocity.data.distinctIp.intervals.24h",
        operator: "lt",
        value: 5,
        message: "Multiple countries detected for the given visitor.",
        status: 403
    },
    {
        dashboardExpression: "Developer tools detected",
        dashboardOperators: ["eq", "nq"],
        dashboardValues: true,
        expression: "products.developerTools.data.result",
        operator: "eq",
        value: true,
        message: "Developer tools detected.",
        status: 403
    }
]}