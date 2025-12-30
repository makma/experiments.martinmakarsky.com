<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to your account</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 md:p-10">
        <div class="w-full max-w-sm md:max-w-3xl">
            <div class="flex flex-col gap-6">
                <div class="rounded-lg border bg-white text-gray-900 shadow-sm overflow-hidden">
                    <div class="grid p-0 md:grid-cols-2">
                        <form id="signin-form" class="p-6 md:p-8" onsubmit="handleSubmit(event)">
                            <div class="flex flex-col gap-6">
                                <div class="flex flex-col items-center text-center">
                                    <h1 class="text-2xl font-bold">Sign in to your account</h1>
                                    <p class="text-balance text-gray-600">
                                        Start with $20 in free credits
                                    </p>
                                </div>
                                <div class="grid gap-2">
                                    <label for="signin-email" class="text-sm font-medium">Email</label>
                                    <input
                                        id="signin-email"
                                        name="email"
                                        type="email"
                                        value="marks@lumon.com"
                                        required
                                        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                </div>
                                <div class="grid gap-2">
                                    <div class="flex items-center">
                                        <label for="signin-password" class="text-sm font-medium">Password</label>
                                    </div>
                                    <input
                                        id="signin-password"
                                        name="password"
                                        type="password"
                                        value="password"
                                        required
                                        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                </div>
                                <button
                                    id="signin-submit"
                                    type="submit"
                                    class="w-full my-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    <span id="submit-text">Sign in</span>
                                </button>
                                <div id="turnstile-container-wrapper" class="grid gap-2 mt-2" style="display: none;">
                                    <label class="text-sm font-medium">Security check</label>
                                    <div class="mt-1" id="turnstile-container"></div>
                                </div>
                                <div id="error-alert" class="relative w-full rounded-lg border p-4 border-red-500 bg-red-50 text-red-800" style="display: none;">
                                    <div class="text-sm">
                                        <h5 class="mb-1 font-medium leading-none tracking-tight">Error</h5>
                                        <div id="error-message"></div>
                                    </div>
                                </div>
                                <div id="success-alert" class="relative w-full rounded-lg border p-4 border-green-500 bg-green-50 text-green-800" style="display: none;">
                                    <div class="text-sm">
                                        <h5 class="mb-1 font-medium leading-none tracking-tight">Success</h5>
                                        <div id="success-message"></div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="hidden bg-gray-100/70 md:flex items-center justify-center">
                            <img
                                src="images/lumon-globe-logo.svg"
                                alt="Lumon Globe Logo"
                                class="w-[250px] h-[100px] opacity-20"
                            />
                        </div>
                    </div>
                </div>
                <div class="text-balance text-center text-xs text-gray-600">
                    Please enjoy each credit equally. By clicking continue, you agree to our
                    <a href="#" class="underline underline-offset-4 hover:text-gray-900">Terms of Service</a> and
                    <a href="#" class="underline underline-offset-4 hover:text-gray-900">Privacy Policy</a>.
                </div>
            </div>
        </div>
    </div>

    <script>
        const TURNSTILE_SITE_KEY = '0x4AAAAAACGw49uNJoXVhVS5';
        let turnstileToken = null;
        let showTurnstile = false;

        function renderTurnstile() {
            if (!window.turnstile) return;
            window.turnstile.render('#turnstile-container', {
                sitekey: TURNSTILE_SITE_KEY,
                action: 'login',
                callback: (token) => {
                    turnstileToken = token;
                },
            });
        }

        function loadTurnstile() {
            if (!showTurnstile) return;

            if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
                const script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
                script.async = true;
                script.defer = true;
                script.onload = renderTurnstile;
                document.body.appendChild(script);
            } else {
                renderTurnstile();
            }
        }

        async function handleSubmit(e) {
            e.preventDefault();
            
            const submitButton = document.getElementById('signin-submit');
            const submitText = document.getElementById('submit-text');
            const formData = new FormData(e.target);
            
            submitButton.disabled = true;
            submitText.textContent = 'Signing in...';
            
            document.getElementById('error-alert').style.display = 'none';
            document.getElementById('success-alert').style.display = 'none';

            const payload = {
                email: formData.get('email'),
                password: formData.get('password'),
            };

            if (turnstileToken) {
                payload['cf-turnstile-response'] = turnstileToken;
            }

            try {
                const response = await fetch('/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                let data = null;
                try {
                    data = await response.json();
                } catch {
                    data = null;
                }

                const turnstileRequired = response.status === 403 && data?.code === 'turnstile_required';

                if (turnstileRequired) {
                    showTurnstile = true;
                    document.getElementById('turnstile-container-wrapper').style.display = 'block';
                    loadTurnstile();
                    submitButton.disabled = false;
                    submitText.textContent = 'Sign in';
                    return;
                }

                if (response.status >= 200 && response.status < 300 && data) {
                    document.getElementById('success-message').textContent = data.message || 'Login successful';
                    document.getElementById('success-alert').style.display = 'block';
                } else {
                    const errorMsg = data?.message ?? 'Sign in failed';
                    document.getElementById('error-message').textContent = errorMsg;
                    document.getElementById('error-alert').style.display = 'block';
                }
            } catch (error) {
                document.getElementById('error-message').textContent = 'Unexpected error during sign in';
                document.getElementById('error-alert').style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitText.textContent = 'Sign in';
            }
        }
    </script>
</body>
</html>

