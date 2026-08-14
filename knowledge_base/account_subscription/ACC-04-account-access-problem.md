# ACC-04: Account Access Problem

## Category
Account / SIM

## Subcategory
Account Access

## Problem

The customer cannot access their telecom provider account through the
website or mobile application, or reports that their account credentials
are not working.

## Common Symptoms

- Cannot sign in
- Password is rejected
- Username or email is not recognized
- Forgot password
- Account recovery fails
- Verification code is not received
- Verification code is rejected
- Account is locked
- Mobile application cannot access the account
- Website login fails
- Customer cannot view account or plan information

## Possible Causes

- Incorrect username or password
- Forgotten credentials
- Incorrect recovery information
- Verification code delivery problem
- Temporary account lock
- Account security restriction
- Provider website or application problem
- Incorrect mobile number or email associated with the account
- Browser or application problem
- Network connectivity problem

## Initial Diagnosis

Determine:

1. Whether the customer can access the provider website or application.
2. Whether the problem occurs during login or account recovery.
3. Whether the username/account identifier is recognized.
4. Whether a verification code is being received.
5. Whether the account is temporarily locked.
6. Whether the problem occurs on both the website and mobile application.
7. Whether other provider services are functioning normally.

## Troubleshooting Procedure

### 1. Verify Login Information

Ask the customer to verify that they are using the correct account
identifier and password.

Do not ask the customer to provide their password.

### 2. Use Account Recovery

If the customer forgot their password or cannot sign in, direct them
through the provider's official password/account-recovery process.

The customer should complete identity verification through the
provider's authorized system.

### 3. Check Verification Code

If a verification code is required:

- Verify that the customer is checking the correct phone number or
  email.
- Check whether the message or email is delayed.
- Request a new code through the provider's supported process.
- Use only the newest valid code when multiple codes have been
  requested.

Do not request that the customer provide authentication codes in the
complaint record.

### 4. Check Account Lock

If the account has been temporarily locked because of repeated failed
login attempts, follow the provider's account-recovery procedure.

Do not repeatedly attempt passwords when the account may already be
locked.

### 5. Check Website or Application

Determine whether the problem is:

- Website-specific
- Mobile-app-specific
- Account-specific
- Device-specific

If possible, retry through the provider's supported website or
application after basic troubleshooting.

### 6. Check Connectivity

Verify that the customer has a working Internet connection.

If the provider application or website works through another
connection, investigate the original network connection separately.

### 7. Check Provider System Status

If many customers cannot access their accounts at the same time, a
provider website, application, authentication, or account-system
problem may be involved.

## Diagnosis Guidance

### Password forgotten

Use the provider's official account-recovery process.

Do not request or store the customer's password.

### Verification code not received

Check:

- Correct registered phone number or email
- Network/connectivity
- Message or email delivery
- Temporary provider issue

If the code cannot be delivered despite correct account information,
escalate when carrier-side investigation is required.

### Account locked

Follow the provider's authorized recovery process.

Do not attempt to bypass account-security controls.

### Website works but mobile application does not

Possible causes:

- Application problem
- Application version
- Device compatibility
- Application configuration

Do not automatically classify this as an account failure.

### Mobile application works but website does not

Investigate the website/browser path separately.

### Multiple customers cannot sign in

A provider-side authentication or account-system problem may be
involved.

Escalate the pattern for provider investigation.

## Resolution

The issue may be resolved by:

- Completing password recovery
- Correcting the account identifier
- Completing authorized identity verification
- Resolving a temporary account lock
- Updating the supported application
- Retrying through the provider's supported website or application
- Waiting for a confirmed provider-side authentication issue to be
  resolved

## Escalation Conditions

Escalate when:

- Account recovery repeatedly fails.
- Verification codes cannot be delivered despite correct information.
- Account records appear inconsistent.
- The account remains locked and requires manual intervention.
- The customer cannot complete identity verification.
- Multiple customers experience simultaneous login failures.
- Provider authentication systems appear unavailable.
- Manual account correction is required.
- Unauthorized account activity is suspected.

## Security and Privacy

The AI must never request or store:

- Account passwords
- One-time verification codes
- Security PINs
- Full payment credentials
- Authentication tokens
- Other sensitive security credentials

Account access must be restored only through the provider's authorized
authentication and recovery mechanisms.

If unauthorized access is suspected, escalate through the provider's
account-security process.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Account-access issue type
- Website/application involved
- Error message, when available
- Account recovery attempted
- Verification-code issue, if applicable
- Account lock status
- Device/platform, when relevant
- Provider system status
- Troubleshooting completed
- Action taken
- Escalation reason

Do not record passwords, verification codes, security PINs, or
authentication tokens.

## Agent Guidance

Do not ask customers to send passwords or one-time verification codes.

Do not bypass identity verification.

Do not manually provide account information until the customer has
passed the provider's required authentication process.

Do not assume a login failure means the customer's account is disabled.

First distinguish between:

- Incorrect credentials
- Password recovery problem
- Verification problem
- Temporary account lock
- Website/application problem
- Provider authentication problem
- Security issue

Provider-specific recovery methods, verification requirements,
account-lock durations, and contact procedures should be maintained
separately in provider-specific policy documents.

## Example Scenarios

### Scenario 1: Forgotten Password

Customer:

"I can't remember my account password."

Action:

Direct the customer to the provider's authorized password-recovery
process.

Do not request the old password.

### Scenario 2: Verification Code Not Received

Customer:

"I entered my phone number but I'm not getting the verification code."

Action:

1. Verify the registered contact method through the authorized system.
2. Check for delivery problems.
3. Retry the supported recovery process.
4. Escalate if the provider cannot deliver the verification code.

### Scenario 3: Account Locked

Customer:

"My account is locked after several login attempts."

Action:

Follow the provider's authorized account-recovery process.

Do not attempt to bypass the lock.

### Scenario 4: Everyone Is Unable to Log In

Customer:

"None of us can access our accounts."

Action:

Treat this as a potential provider-side authentication issue and
escalate for system investigation.

## Source Basis

This article is a normalized knowledge article based on publicly
available account-support and security guidance from:

- Verizon Wireless Support
- AT&T Wireless Support
- T-Mobile Wireless Support
- Apple Support

Provider-specific recovery URLs, authentication procedures,
lockout periods, and security policies have been excluded so that this
article remains provider-neutral.