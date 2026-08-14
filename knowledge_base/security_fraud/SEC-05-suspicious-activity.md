# SEC-05: Suspicious Account Activity

## Category
Security & Fraud

## Subcategory
Suspicious Account Activity

## Problem

The customer reports unusual or unrecognized activity on their mobile
provider account that may indicate unauthorized access, fraud, or a
security-related account change.

The activity may involve account settings, services, SIM/eSIM changes,
billing, authentication, or other account functions.

## Common Symptoms

- Unrecognized account changes
- Unexpected password change
- Unexpected email or phone-number change
- Unexpected security-setting change
- Unexpected SIM/eSIM activation
- Unexpected service or plan change
- Unrecognized device associated with the account
- Unexpected login notification
- Unexpected account-recovery notification
- Unrecognized billing activity
- Unexpected calls or messages
- Customer receives security notifications they did not initiate
- Customer suddenly loses access to the account
- Customer notices multiple suspicious activities at once

## Possible Causes

- Unauthorized account access
- Phishing
- Social engineering
- SIM-swap fraud
- Compromised credentials
- Legitimate activity performed by an authorized account user
- Provider system error
- Delayed or duplicated notification
- Billing-system issue
- Customer misunderstanding of a legitimate account change

The AI must not assume fraud solely because activity appears unfamiliar.

## Initial Diagnosis

Determine:

1. What activity the customer does not recognize.
2. Date and time of the activity.
3. Whether the customer can still access the account.
4. Whether account credentials changed.
5. Whether contact information changed.
6. Whether SIM/eSIM information changed.
7. Whether service or plan information changed.
8. Whether the customer received a security notification.
9. Whether billing activity is involved.
10. Whether the customer recently made any legitimate account changes.
11. Whether another authorized account user could have made the change.
12. Whether multiple suspicious activities occurred.

Do not request passwords, one-time passwords, authentication codes,
security answers, payment credentials, or other secret information.

## Suspicious Activity vs Legitimate Activity

### Potential Unauthorized Activity

More likely when:

- Customer denies making the change.
- Multiple unexpected changes occur.
- Security notifications were triggered unexpectedly.
- Account credentials were changed without authorization.
- SIM/eSIM was changed unexpectedly.
- Customer loses account access.
- Unrecognized billing activity accompanies the changes.

### Potential Legitimate Activity

More likely when:

- Customer performed the change.
- An authorized account user performed the change.
- The change corresponds to a recent support request.
- The notification corresponds to a legitimate provider action.

The AI should verify available provider records before classifying an
event as unauthorized.

## Activity Types

### Account Credentials

Examples:

- Password change
- Username change
- Account-recovery event
- Authentication-setting change

Route serious unauthorized credential activity through:

`SEC-01: Unauthorized Account Access`

### SIM/eSIM

Examples:

- SIM replacement
- eSIM activation
- SIM/eSIM identifier change

If the customer denies the change, route through:

`SEC-02: SIM Swap Fraud`

### Service Changes

Examples:

- Plan change
- Feature activation
- Feature removal
- New service activation
- Line-related changes

Verify whether the customer or authorized account user requested the
change.

### Billing Activity

Examples:

- Unrecognized charge
- Unexpected purchase
- Unexpected plan charge
- Unrecognized service fee

Route billing-specific investigation through the appropriate billing
workflow.

### Contact Information

Examples:

- Email address changed
- Phone number changed
- Address changed
- Security contact changed

Unexpected contact-information changes can indicate account
compromise.

## Initial Troubleshooting

### 1. Identify the Activity

Determine exactly what the customer noticed.

Avoid asking broad questions such as:

"Was your account hacked?"

Instead identify the specific event.

### 2. Verify Customer Identity

Use the provider's authorized authentication process before disclosing
sensitive account information or making security-related changes.

### 3. Review Recent Account Activity

Check available provider records for:

- Login events
- Password changes
- Contact changes
- Service changes
- SIM/eSIM changes
- Security-setting changes
- Account-recovery events

### 4. Check Billing Activity

If the customer reports financial activity, review available billing
records.

### 5. Check Network/SIM Status

If the customer also reports loss of cellular service, check for:

- SIM/eSIM changes
- Account suspension
- Network outage
- Device-related issues

Do not assume that service loss proves account compromise.

### 6. Review Related Security Reports

Check whether similar activity has been reported by other customers.

## Diagnosis Guidance

### One Unrecognized Change

Possible causes:

- Legitimate authorized activity
- Account misunderstanding
- Provider-system issue
- Unauthorized access

Verify the specific event before escalating.

### Multiple Unrecognized Changes

Potential account compromise.

Review:

- Credentials
- Contact information
- SIM/eSIM
- Service changes
- Billing activity

### Unrecognized SIM/eSIM Change

Potential SIM-swap activity.

Route to:

`SEC-02: SIM Swap Fraud`

### Unrecognized Password Change + Loss of Account Access

Potential account takeover.

Route to:

`SEC-01: Unauthorized Account Access`

### Suspicious Activity + Unrecognized Charges

Potential broader fraud event.

Escalate to the appropriate security and billing/fraud workflows.

### Suspicious Activity + Multiple Customers

Potential broader security incident.

Correlate related reports and escalate to security/fraud specialists.

## Resolution

The issue may be resolved by:

- Confirming legitimate account activity.
- Securing the account through authorized procedures.
- Reversing unauthorized account changes when authorized.
- Restoring authorized account settings.
- Restoring the authorized SIM/eSIM when applicable.
- Reviewing and correcting billing activity when authorized.
- Escalating suspected fraud or security incidents.

The AI must not claim that an account has been secured or restored unless
the provider system confirms the action.

## Escalation Conditions

Escalate when:

- Customer denies making the reported change.
- Multiple suspicious account changes are present.
- Unauthorized credentials changes are suspected.
- Unexpected SIM/eSIM activity is present.
- Customer has lost account access.
- Unauthorized financial activity is present.
- Identity verification fails.
- Manual security intervention is required.
- Fraud investigation is required.
- Multiple customers report similar activity.
- Provider records conflict with the customer's report.

## Potential Security Incident

Multiple similar suspicious-account reports may indicate a broader
security incident.

Example:

Ticket 7001
"Someone changed my account email."

Ticket 7002
"My password was changed without permission."

Ticket 7003
"An unknown SIM was activated on my account."

Ticket 7004
"My account plan was changed unexpectedly."

Similar activity
+
Similar time period
+
Multiple affected accounts
=
Potential Security Incident

The AI must not declare a confirmed security incident without
authorized security confirmation.

## Incident Information

A security incident should contain:

- Incident ID
- Incident category
- First detected date/time
- Number of related tickets
- Common activity pattern
- Affected account function
- SIM/eSIM involvement
- Billing involvement, when applicable
- Geographic information when relevant
- Current status
- Confidence level
- Human confirmation status
- Related ticket IDs

Do not include:

- Passwords
- One-time passwords
- Authentication codes
- Security answers
- Payment credentials
- Authentication tokens

## Confidence Levels

### Low

Unrecognized activity is reported but there is insufficient evidence of
unauthorized access.

### Medium

Multiple suspicious indicators exist or an unauthorized account change
has been identified.

### High

Strong evidence indicates unauthorized account activity affecting one
or more accounts.

### Confirmed

Provider security or fraud personnel confirm unauthorized activity.

## Human Agent Workflow

When a suspicious-account-activity complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Review recent account activity.
5. Determine whether the reported activity was authorized.
6. Review credential changes.
7. Review contact-information changes.
8. Review SIM/eSIM activity.
9. Review service and plan changes.
10. Review billing activity when relevant.
11. Review related security complaints.
12. Determine whether the issue is individual or systemic.
13. Secure the account when authorized.
14. Reverse unauthorized changes when authorized.
15. Escalate to security/fraud specialists when required.
16. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Suspicious activity type
- Account function affected
- SIM/eSIM involvement, when applicable
- Billing involvement, when applicable
- Security notification information
- Related ticket IDs
- Incident ID
- Verification status
- Actions taken
- Escalation reason
- Final resolution

Do not record:

- Passwords
- One-time passwords
- Authentication codes
- Security answers
- Full payment credentials
- Authentication tokens

## Agent Guidance

Do not ask customers to provide passwords or authentication codes.

Do not bypass identity verification.

Do not assume that unfamiliar activity is fraudulent without reviewing
available evidence.

Do not confirm sensitive account information before completing the
provider's required authentication process.

Do not promise that unauthorized activity will be reversed unless the
provider's authorized process allows it.

Do not expose internal security systems, fraud-detection methods, or
investigation procedures.

Do not create duplicate incidents when an existing security incident
already covers the same activity.

Provider-specific security controls, authentication requirements,
account-activity logs, fraud detection rules, investigation procedures,
account recovery procedures, and customer communication policies should
be maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, suspicious account activity should support
automated detection and correlation.

The architecture should support:

- Account-activity classification
- Security-event correlation
- SIM/eSIM event correlation
- Billing-event correlation
- Complaint similarity analysis
- Time-window analysis
- Geographic analysis when relevant
- Potential security incident detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security/fraud escalation
- Large numbers of simultaneous cases

Human agents should investigate security incidents rather than manually
comparing every individual complaint.

## Example

Customer complaint:

"I received a notification that my account email was changed, but I
didn't make the change. I also received a notification about a new SIM."

The system detects:

- Unrecognized contact-information change
- Unexpected SIM activity
- Customer denies authorization

AI assessment:

POTENTIAL ACCOUNT COMPROMISE AND SIM-SWAP ACTIVITY

Priority:

HIGH

Human action:

Verify the customer's identity through the authorized security
process, secure the account, investigate the SIM change, and escalate
to security/fraud specialists.

## Example of Legitimate Activity

Customer complaint:

"I received a notification that my plan was changed, but I forgot
that my authorized family member made the change."

The system detects:

- Unrecognized activity initially reported
- Authorized account user identified
- Activity matches provider records

AI assessment:

LIKELY AUTHORIZED ACCOUNT ACTIVITY

Human action:

Confirm the authorized change and close the security investigation if
no other suspicious activity exists.

## Source Basis

This article is a normalized knowledge article based on publicly
available account-security, fraud-prevention, authentication, SIM/eSIM,
billing-security, and telecommunications customer-support practices
from US network providers and FCC consumer guidance.

Provider-specific account-activity monitoring, authentication
requirements, fraud detection systems, security investigation
procedures, incident response processes, account recovery procedures,
and customer communication policies should be maintained separately as
provider-specific policy documents.