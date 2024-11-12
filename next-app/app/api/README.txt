Passkey flow contains two main steps:

1. Adding a Passkey.
2. Authenticating with a Passkey.

Adding a passkey is usually done only once per device. 
A passkey can be your password manager, your face ID or a physical token.


Authenticating with a passkey is done every time you login and your login 
requires additional verification.

Both adding and authenticating require two API routes. 
1. Adding a passkey:
    a. /api/passkey-register
    b. /api/passkey-register-verify

2. Authenticating with a passkey:
    a. /api/passkey-authenticate
    b. /api/passkey-authenticate-verify