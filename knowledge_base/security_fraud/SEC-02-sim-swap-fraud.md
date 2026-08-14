# SEC-02: SIM Swap Fraud

## Category
Security & Fraud

## Subcategory
SIM Swap and Unauthorized SIM/eSIM Changes

## Problem

The customer reports that their mobile number may have been transferred
to another SIM or eSIM without authorization.

A SIM swap occurs when a mobile line is moved from one SIM/eSIM to
another. A fraudulent SIM swap may allow an unauthorized person to gain
control of the customer's mobile number.

## Common Symptoms

- Mobile service suddenly stops working
- Device unexpectedly shows no cellular service
- SIM/eSIM stops working without explanation
- Customer receives an unexpected SIM replacement notification
- Customer receives an unexpected eSIM activation notification
- Customer's mobile number stops receiving calls or SMS
- Customer cannot receive authentication messages
- Account shows an unexpected SIM/eSIM change
- Customer reports that someone may have taken control of their number
- Account changes occur around the same time as unexpected loss of
  cellular service

## Possible Causes

- Unauthorized SIM replacement
- Unauthorized eSIM activation
- Legitimate SIM replacement that the customer does not recognize
- Account compromise
- Social engineering
- Fraudulent identity verification
- Unauthorized account access
- Provider provisioning error
- Device or SIM failure unrelated to fraud

The AI must not assume that every sudden loss of cellular service is a
SIM-swap attack.

## Initial Diagnosis

Determine:

1. When cellular service stopped.
2. Whether the customer can make or receive calls.
3. Whether the customer can send or receive SMS.
4. Whether mobile data works.
5. Whether the device detects the SIM/eSIM.
6. Whether the customer recently requested a SIM replacement.
7. Whether the customer recently activated an eSIM.
8. Whether the customer received a SIM/eSIM change notification.
9. Whether the account shows a recent SIM/eSIM change.
10. Whether other unauthorized account changes are present.
11. Whether the customer can access their account.
12. Whether unauthorized financial activity is also suspected.

Do not request passwords, one-time passwords, authentication codes,
security answers, or other secret credentials.

## SIM Swap vs Normal SIM Replacement

### Potential Unauthorized SIM Swap

More likely when:

- Customer denies requesting the SIM change.
- Cellular service suddenly stops.
- Account records show an unexpected SIM/eSIM change.
- Customer receives an unexpected SIM/eSIM activation notification.
- Multiple unauthorized account changes occur.
- Customer loses access to SMS authentication.

### Legitimate SIM Replacement

More likely when:

- Customer recently requested a replacement.
- Customer activated a new SIM/eSIM intentionally.
- The account record matches the customer's activity.
- The customer knowingly changed devices or SIMs.

The AI should verify available account information before labeling a SIM
change fraudulent.

## Immediate Protection

When unauthorized SIM/eSIM activity is reasonably suspected, the case
should be handled through the provider's authorized fraud/security
process.

Depending on provider procedures, actions may include:

- Securing the account.
- Verifying customer identity.
- Blocking further unauthorized changes.
- Restoring the authorized SIM/eSIM.
- Reversing unauthorized account changes.
- Reviewing recent account activity.
- Reviewing billing activity.
- Escalating to the security/fraud team.

The AI must not bypass provider authentication procedures.

## Loss of Cellular Service

If the customer reports sudden loss of service:

1. Determine when service stopped.
2. Check whether the device detects the SIM/eSIM.
3. Check whether an authorized SIM/eSIM change occurred.
4. Check recent account activity.
5. Check for known network outages.
6. Check whether the customer recently replaced the SIM/eSIM.
7. Escalate when unauthorized SIM activity is suspected.

A loss of service can also be caused by:

- Network outage
- Device failure
- SIM failure
- Account suspension
- Coverage issue

Do not automatically classify the problem as fraud.

## SIM/eSIM Change Verification

Through authorized provider systems, verify:

- SIM replacement event
- eSIM activation event
- SIM/eSIM identifier change
- Activation date and time
- Device association, when available
- Account changes surrounding the event

Do not expose sensitive internal identifiers to the customer unless
provider policy permits it.

## Account Security Relationship

A SIM swap may be associated with unauthorized account access.

Check for related activity such as:

- Password changes
- Contact information changes
- Security-setting changes
- Unauthorized service changes
- Unexpected account recovery attempts

If unauthorized account access is suspected, also route through:

`SEC-01: Unauthorized Account Access`

## Billing Security Relationship

If suspicious SIM activity is accompanied by:

- Unauthorized purchases
- Unrecognized service changes
- Unrecognized charges
- Unauthorized plan changes

route the relevant portion of the case to the appropriate billing or
fraud workflow.

## Troubleshooting Procedure

### 1. Confirm Service Loss

Determine whether the customer has:

- No cellular signal
- No calls
- No SMS
- No mobile data
- Partial service

### 2. Check SIM/eSIM Detection

Determine whether the device recognizes the SIM/eSIM.

### 3. Check Recent SIM/eSIM Activity

Review authorized provider records for recent SIM/eSIM changes.

### 4. Verify Customer Request

Ask whether the customer recently:

- Replaced a SIM
- Activated an eSIM
- Changed devices
- Requested a number transfer between SIMs

### 5. Check Account Activity

Review recent security-sensitive account changes.

### 6. Check Network Status

Verify whether a network outage could independently explain the loss of
service.

### 7. Escalate Suspicious Activity

If the customer denies the SIM/eSIM change and provider records show an
unexpected change, escalate through the authorized security/fraud
process.

## Diagnosis Guidance

### Unexpected SIM Change + Loss of Service

Potential SIM swap.

Priority should generally be high because control of the mobile number
may have been transferred.

### SIM Change Was Authorized

Treat as a normal SIM/eSIM activation or replacement issue unless other
evidence indicates compromise.

### Loss of Service but No SIM Change

Investigate:

- Network outage
- Device issue
- SIM failure
- Account suspension
- Coverage issue

Do not classify as SIM-swap fraud without supporting evidence.

### Unexpected SIM Change + Account Changes

Potential account takeover and SIM-swap activity.

Escalate to the security/fraud team.

### Unexpected SIM Change + Financial Activity

Potential broader fraud event.

Escalate to the appropriate security and billing/fraud teams.

## Resolution

When an unauthorized SIM/eSIM change is confirmed or strongly suspected,
authorized provider personnel may:

- Secure the account.
- Verify customer identity.
- Restore the authorized SIM/eSIM.
- Block unauthorized changes.
- Reverse unauthorized account changes.
- Review related security activity.
- Review related billing activity.
- Escalate the incident to security/fraud specialists.

The AI should not claim that service has been restored unless the
provider system confirms restoration.

## Escalation Conditions

Escalate with high priority when:

- Customer denies requesting a SIM/eSIM change.
- Provider records show an unexpected SIM/eSIM change.
- Customer has suddenly lost cellular service.
- Customer cannot receive calls or SMS.
- Customer cannot access the account.
- Unauthorized account changes are present.
- Unauthorized financial activity is suspected.
- Identity verification or account recovery fails.
- Manual SIM/eSIM restoration is required.
- Security investigation is required.
- Multiple customers show similar suspicious SIM activity.

## Potential SIM Swap Incident

Multiple suspicious cases may indicate a broader fraud pattern.

Example:

Ticket 4001
"Lost cellular service unexpectedly."

Ticket 4002
"Received an eSIM activation notification I didn't request."

Ticket 4003
"My SIM stopped working and my account information changed."

Common indicators
+
Similar time period
+
SIM/eSIM changes
=
Potential SIM Swap Incident

The system must not declare a confirmed fraud incident without
authorized security confirmation.

## Incident Information

A SIM-swap security incident should contain:

- Incident ID
- Incident category
- First detected date/time
- Number of related tickets
- Common activity pattern
- Affected service
- SIM/eSIM activity
- Account-security indicators
- Billing indicators, when applicable
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

Possible SIM/eSIM issue with insufficient evidence of unauthorized
activity.

### Medium

Unexpected SIM/eSIM activity combined with suspicious account or
service changes.

### High

Customer denies the SIM/eSIM change and provider records show an
unexpected change with corresponding loss of service.

### Confirmed

Provider security or fraud personnel confirm unauthorized SIM/eSIM
activity.

## Human Agent Workflow

When a potential SIM-swap complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Review recent SIM/eSIM changes.
5. Review account activity.
6. Check for unauthorized credential changes.
7. Check for billing activity when relevant.
8. Check current network status.
9. Determine whether the SIM/eSIM change was authorized.
10. Secure the account when required.
11. Restore authorized SIM/eSIM service when authorized.
12. Escalate to security/fraud specialists when required.
13. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Service-loss time
- SIM/eSIM change time
- SIM/eSIM change status
- Customer authorization status
- Account-security indicators
- Billing indicators, when applicable
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
- Payment credentials
- Authentication tokens

## Agent Guidance

Do not ask customers to provide passwords or one-time authentication
codes.

Do not bypass identity verification.

Do not assume a SIM failure is fraud without checking available
evidence.

Do not confirm sensitive account information before completing the
provider's required authentication process.

Do not promise immediate restoration unless the authorized provider
system confirms that restoration is possible.

Do not expose internal fraud-detection methods or security systems.

Do not create duplicate incidents when an existing SIM-swap incident
already covers the same activity.

Provider-specific SIM/eSIM replacement controls, authentication
requirements, fraud detection rules, account recovery procedures,
security escalation procedures, and restoration processes should be
maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, SIM-swap complaints should support
automated correlation of suspicious account and SIM/eSIM activity.

The architecture should support:

- SIM/eSIM event classification
- Account activity correlation
- Complaint similarity analysis
- Time-window analysis
- Service-loss correlation
- Security-event correlation
- Billing-event correlation
- Potential SIM-swap detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security/fraud escalation
- Large numbers of simultaneous cases

Human agents should investigate suspicious incidents rather than
manually comparing every individual complaint.

## Example

Customer complaint:

"My phone suddenly lost all service. I received an email saying a new
eSIM was activated, but I didn't request one."

The system detects:

- Sudden service loss
- Unexpected eSIM activation
- Customer denies authorization

AI assessment:

POTENTIAL SIM SWAP

Priority:

HIGH

Human action:

Verify the customer's identity through the authorized security
process, secure the account, investigate the eSIM activation, and
restore the authorized mobile service when permitted.

## Example of Potential Broader Incident

Customer complaints:

Ticket 4101
"Unexpected SIM replacement."

Ticket 4102
"eSIM activated without my permission."

Ticket 4103
"Lost cellular service and account settings changed."

The system detects:

- Similar suspicious SIM activity
- Similar time period
- Multiple affected accounts

AI assessment:

POTENTIAL SIM-SWAP FRAUD INCIDENT

Human action:

Security/fraud personnel should review the related accounts and
provider security events to determine whether a broader incident exists.

## Source Basis

This article is a normalized knowledge article based on publicly
available SIM-swap, account-security, fraud-prevention, and
telecommunications customer-support practices from US network providers
and FCC consumer guidance.

Provider-specific SIM/eSIM replacement controls, authentication
requirements, fraud detection systems, account recovery procedures,
security investigation processes, incident response procedures, and
customer communication policies should be maintained separately as
provider-specific policy documents.