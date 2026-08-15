# ACC-05: Account Information Change

## Category
Account / SIM

## Subcategory
Account Information and Profile Changes

## Problem

The customer wants to update information associated with their
telecom account, such as contact information, billing information,
communication preferences, or other account profile details.

## Common Scenarios

- Change phone number associated with the account
- Change email address
- Update mailing address
- Update contact information
- Change communication preferences
- Update account profile information
- Correct incorrect account information
- Change information associated with a mobile line
- Customer reports that an account change did not take effect

## Possible Causes of a Failed Change

- Customer does not have permission to modify the information
- Identity verification is incomplete
- Account is restricted
- Information is invalid or incomplete
- Change requires additional verification
- Change requires carrier-side intervention
- Provider system problem
- Requested information conflicts with existing account records

## Initial Diagnosis

Determine:

1. What account information the customer wants to change.
2. Whether the customer is authorized to make the change.
3. Whether the provider allows the change through self-service.
4. Whether identity verification is required.
5. Whether the requested change affects a mobile line or the entire
   account.
6. Whether the customer has already attempted the change.
7. Whether the change was accepted, rejected, or remains pending.

## Types of Account Information

Potential account information includes:

- Contact email
- Contact phone number
- Mailing address
- Billing address
- Communication preferences
- Account profile information
- Information associated with a mobile line

Provider-specific account fields vary.

## Security and Identity Verification

Account information must only be changed after completing the provider's
required authentication and identity-verification process.

The AI must not:

- Change account information directly without authorization.
- Bypass identity verification.
- Ask customers to provide passwords.
- Ask customers to provide one-time verification codes.
- Store authentication credentials.

If the requested change involves sensitive account ownership or
security information, follow the provider's enhanced verification
process.

## Troubleshooting Procedure

### 1. Identify the Requested Change

Determine exactly what the customer wants to modify.

Example:

"I want to change my email address."

Do not assume the customer wants to change other account information.

### 2. Verify Account Access

Determine whether the customer can access their provider account.

If they cannot access the account, route the complaint to:

`ACC-04: Account Access Problem`

### 3. Complete Authentication

The customer must use the provider's authorized authentication process.

Do not collect authentication credentials in the support conversation.

### 4. Check Whether Self-Service Is Available

If the provider supports self-service changes, direct the customer to
the applicable account-management feature.

### 5. Verify the Change

After the customer submits the change, verify whether the account now
shows the updated information.

### 6. Check Change Status

Determine whether the requested change is:

- Not submitted
- Pending
- Completed
- Rejected
- Reversed

### 7. Check for Restrictions

If the change cannot be completed, determine whether:

- Additional verification is required.
- The account has a restriction.
- The requested information is invalid.
- Provider-side intervention is required.

## Diagnosis Guidance

### Customer can change the information through self-service

Guide the customer through the provider's supported account-management
process.

### Customer cannot access the account

Route to `ACC-04: Account Access Problem`.

Do not attempt to modify account information without authentication.

### Change submitted but information did not update

Check:

- Change status
- Account records
- Provider system status
- Whether additional verification is required

Escalate if the change was accepted but the account remains incorrect.

### Customer wants to change account ownership

Treat ownership changes as a higher-risk account operation.

Do not perform or recommend bypassing provider verification.

Follow the provider's account-ownership transfer process.

### Customer wants to change a mobile number

Verify whether the request is:

- Changing contact information
- Changing the actual mobile line number

These are different operations.

A mobile-number change may require additional provider procedures.

## Resolution

The issue may be resolved by:

- Updating information through authorized self-service tools.
- Completing required identity verification.
- Correcting invalid account information.
- Completing the provider's supported account-change process.

After the change, verify that the updated information appears correctly.

## Escalation Conditions

Escalate when:

- The account does not allow the requested change.
- The change was accepted but the account information remains incorrect.
- Account records contain conflicting information.
- Manual account correction is required.
- Ownership or security-sensitive changes require specialist review.
- The account is restricted.
- Multiple customers report the same account-management problem.
- Provider-side systems appear to be preventing account changes.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Type of information being changed
- Mobile line, when applicable
- Current change status
- Verification status
- Error message, when available
- Previous change attempts
- Provider system status
- Action taken
- Escalation reason

Do not record:

- Passwords
- One-time verification codes
- Security PINs
- Authentication tokens
- Full payment credentials
- Other unnecessary sensitive information

## Agent Guidance

Do not change account information without completing the required
authentication process.

Do not assume that a contact-information change is equivalent to a
mobile-number change.

Do not promise that an account change will take effect immediately
unless the provider's current policy confirms it.

Do not expose the customer's existing account information before
authentication.

Provider-specific fields, verification requirements, change procedures,
processing times, and restrictions should be maintained separately in
provider-specific policy documents.

## Example Scenarios

### Scenario 1: Change Email

Customer:

"I want to update the email address on my account."

Action:

1. Verify account access.
2. Complete authentication.
3. Use the provider's supported account-management process.
4. Verify the new email address is saved.

### Scenario 2: Change Failed

Customer:

"I changed my address yesterday but my account still shows the old
one."

Action:

1. Verify the change request.
2. Check change status.
3. Check account records.
4. Escalate if the change was accepted but the account was not updated.

### Scenario 3: Customer Cannot Access Account

Customer:

"I can't log in, so I can't change my phone number."

Action:

Route to:

`ACC-04: Account Access Problem`

### Scenario 4: Account Ownership Change

Customer:

"I want to transfer this account to another person."

Action:

Do not treat this as a normal profile-information update.

Follow the provider's authorized account-ownership transfer process and
escalate when manual verification or intervention is required.

## Source Basis

This article is a normalized knowledge article based on publicly
available account-management and authentication guidance from:

- Verizon Wireless Support
- AT&T Wireless Support
- T-Mobile Wireless Support

Provider-specific account fields, authentication requirements,
ownership-transfer procedures, processing times, and contact information
have been excluded so that this article remains provider-neutral.