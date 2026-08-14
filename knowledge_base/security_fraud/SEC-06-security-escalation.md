# SEC-06: Security and Fraud Escalation

## Category
Security & Fraud

## Subcategory
Security, Fraud, and Account Protection Escalation

## Purpose

This article defines when a security or fraud-related customer complaint
must be transferred from automated support to a human agent, security
team, fraud team, billing team, or other authorized provider personnel.

The AI may handle routine security questions when the issue is clearly
understood and authoritative information is available.

The AI must escalate when the issue requires identity verification,
account intervention, fraud investigation, security investigation,
billing review, SIM/eSIM intervention, or other provider-side action.

## Issues Covered

This escalation workflow applies to:

- Unauthorized account access
- SIM-swap fraud
- Lost or stolen devices
- Phishing and scams
- Suspicious account activity
- Unauthorized account changes
- Unauthorized SIM/eSIM changes
- Suspicious billing activity
- Potential coordinated fraud
- Potential security incidents

## When AI Can Handle the Complaint

The AI may resolve the complaint when:

- The customer only needs general security guidance.
- The issue is clearly identified as a known scam attempt with no
  customer interaction.
- The customer needs general information about protecting an account.
- Authoritative provider security information is available.
- No account intervention is required.
- No billing investigation is required.
- No fraud investigation is required.

The AI should provide approved information and direct the customer to
official provider channels when sensitive account action is required.

## When Human Escalation Is Required

### 1. Unauthorized Account Access

Escalate when:

- Customer denies making an account change.
- Credentials were changed without authorization.
- Customer lost account access.
- Multiple suspicious account changes occurred.
- Unauthorized security-setting changes occurred.
- Account takeover is suspected.

Route to:

`SEC-01: Unauthorized Account Access`

### 2. SIM-Swap Fraud

Escalate with high priority when:

- Customer denies requesting a SIM/eSIM change.
- Provider records show an unexpected SIM/eSIM change.
- Customer suddenly loses cellular service.
- Customer cannot receive calls or SMS.
- Other unauthorized account changes are present.
- Unauthorized financial activity is suspected.

Route to:

`SEC-02: SIM Swap Fraud`

### 3. Lost or Stolen Device

Escalate when:

- The stolen device may have exposed account access.
- Unauthorized account activity is reported.
- Unexpected SIM/eSIM activity is detected.
- Unauthorized billing activity is reported.
- Customer cannot secure the mobile line through normal procedures.

Route to:

`SEC-03: Lost or Stolen Device`

and the appropriate security workflow when compromise is suspected.

### 4. Phishing and Scam

Escalate when:

- Customer entered credentials into a suspicious website.
- Customer provided authentication information to a suspected scammer.
- Customer provided payment information.
- Customer reports subsequent unauthorized account activity.
- Multiple customers report the same suspicious communication.
- A coordinated phishing campaign is suspected.

Route to:

`SEC-04: Phishing and Scam`

### 5. Suspicious Account Activity

Escalate when:

- Multiple suspicious account changes are present.
- Customer denies making the reported changes.
- SIM/eSIM activity is unexpected.
- Account access was lost.
- Unauthorized billing activity is present.
- Security investigation is required.

Route to:

`SEC-05: Suspicious Account Activity`

## Immediate Security Handling

When account compromise is reasonably suspected, the customer should be
handled through the provider's authorized security process.

Depending on provider procedures, this may include:

- Identity verification
- Account protection
- Credential reset
- Session revocation
- SIM/eSIM protection
- Service suspension
- Reversal of unauthorized changes
- Billing review
- Fraud investigation

The AI must not bypass provider authentication or security controls.

## Security Incident Detection

The system should correlate security complaints using:

- Complaint category
- Complaint subcategory
- Account activity
- SIM/eSIM events
- Billing events
- Date
- Time
- Complaint similarity
- Common communication characteristics
- Geographic information when relevant

Potential incident pattern:

Similar security complaints
+
Similar activity
+
Similar time period
+
Multiple affected accounts
↓
Potential Security Incident
↓
Human Review
↓
Confirmed or Rejected

The AI must not automatically declare a confirmed security incident
solely from customer complaints.

## Security Event Correlation

The system should be able to identify relationships between:

- Account login events
- Password changes
- Contact-information changes
- SIM/eSIM changes
- Service changes
- Billing events
- Customer complaints
- Security notifications

Example:

Customer Complaint
+
Unexpected Password Change
+
Unexpected SIM Activation
+
Loss of Cellular Service
↓
Potential Account Takeover / SIM Swap

This correlation should generate a review candidate rather than an
automatic fraud determination.

## Geographic Analysis

Geographic information may be useful for identifying coordinated
physical or regional activity.

The system may analyze:

- City
- State
- ZIP code
- Time
- Complaint concentration

However, security incidents should not be declared solely because
customers are geographically close.

Geographic correlation should be treated as supporting evidence only.

## Temporal Analysis

The system should analyze:

- Multiple reports within a short period
- Sudden increases in suspicious activity
- Activity occurring immediately after a common communication campaign
- SIM/eSIM changes occurring within a similar time window
- Account changes occurring shortly after phishing reports

Time thresholds should be configurable.

## Incident Confidence

### Low

Suspicious activity is reported but evidence is limited.

### Medium

Multiple suspicious indicators exist or similar reports are present.

### High

Strong evidence of unauthorized activity affects one or more accounts.

### Confirmed

Authorized provider security or fraud personnel confirm the incident.

## Escalation Priority

### High Priority

Consider high priority when:

- Customer account takeover is suspected.
- Unauthorized SIM/eSIM activity is confirmed or strongly suspected.
- Customer has lost control of the mobile number.
- Unauthorized financial activity is suspected.
- Multiple accounts appear affected.
- A coordinated security attack is suspected.
- Sensitive account access may have been compromised.

### Medium Priority

Consider medium priority when:

- Suspicious account activity requires manual investigation.
- Credentials may have been exposed.
- A phishing interaction occurred.
- Multiple similar reports exist but broader impact is unclear.
- Manual account-security intervention is required.

### Low Priority

Consider low priority when:

- Customer only reports a suspicious message.
- No interaction with the suspected scam occurred.
- No account compromise is indicated.
- The customer only needs general security information.

Final priority should follow provider security and fraud policies.

## Information Required Before Escalation

The AI should provide the human team with:

- Ticket ID
- Original customer complaint
- Complaint category
- Complaint subcategory
- Date
- Time
- Suspicious activity type
- Account function affected
- SIM/eSIM involvement
- Billing involvement
- Communication type, when applicable
- Whether the customer interacted with the communication
- Whether credentials may have been exposed
- Whether account access was lost
- Related ticket IDs
- Existing incident ID
- Provider security information, when available
- Troubleshooting completed
- AI assessment
- Incident confidence
- Escalation reason
- Recommended next action

Do not include:

- Passwords
- One-time passwords
- Authentication codes
- Security answers
- Payment credentials
- Authentication tokens
- Device unlock codes

## AI Escalation Output

The system should generate a structured escalation record.

### Decision

ESCALATE

### Category

Security & Fraud

### Subcategory

Example: Potential Account Takeover

### Priority

LOW | MEDIUM | HIGH

### Incident Status

POTENTIAL | CONFIRMED | UNKNOWN

### Reason

A concise explanation of why human intervention is required.

### Customer Summary

A short summary of the customer's reported security issue.

### Security Indicators

List relevant indicators such as:

- Unexpected account change
- Unexpected SIM/eSIM change
- Lost account access
- Suspicious communication
- Unrecognized billing activity

### Related Complaints

List relevant ticket IDs.

### AI Assessment

State the likely security issue without presenting uncertain conclusions
as confirmed facts.

### Recommended Action

State what the human agent, security team, fraud team, or billing team
should investigate next.

## Example High-Priority Escalation

### Customer Complaint

"My phone suddenly lost service. I received an email saying a new SIM
was activated, but I never requested one. I also cannot access my
account."

### AI Decision

ESCALATE

### Priority

HIGH

### Incident Status

POTENTIAL

### Security Indicators

- Sudden loss of service
- Unexpected SIM activation
- Loss of account access

### AI Assessment

Potential SIM-swap fraud and account takeover.

### Recommended Action

Verify customer identity through the authorized security process,
secure the account and mobile line, investigate the SIM change, and
escalate to security/fraud specialists.

## Example Phishing Escalation

### Customer Complaint

"I clicked a link from a message pretending to be my provider and
entered my account password."

### AI Decision

ESCALATE

### Priority

HIGH

### Incident Status

POTENTIAL

### Security Indicators

- Provider impersonation
- Suspicious link
- Credentials potentially exposed

### AI Assessment

Potential account compromise.

### Recommended Action

Follow the authorized account-security process and review recent
account activity.

## Example Low-Priority Report

### Customer Complaint

"I received a text saying my account would be suspended unless I
clicked a link. I did not click anything."

### AI Decision

ESCALATE

### Priority

LOW

### Incident Status

POTENTIAL

### Security Indicators

- Provider impersonation
- Urgent request
- Suspicious link
- No customer interaction

### AI Assessment

Potential phishing attempt.

### Recommended Action

Record the report through the approved fraud-reporting process and
direct the customer to official provider channels.

## Human Agent Workflow

When a security or fraud complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Determine the type of security event.
5. Review recent account activity.
6. Review SIM/eSIM activity when relevant.
7. Review billing activity when relevant.
8. Review related complaints.
9. Determine whether the event is individual or systemic.
10. Secure the account when authorized.
11. Reverse unauthorized changes when authorized.
12. Associate the ticket with an existing incident when appropriate.
13. Escalate to the security or fraud team when required.
14. Escalate to billing when a financial investigation is required.
15. Record the final outcome.

## Human Agent Actions

The human agent may:

- Verify customer identity.
- Secure the account.
- Reset authorized security credentials.
- Revoke unauthorized sessions.
- Protect or replace a SIM/eSIM.
- Suspend a mobile line when authorized.
- Reverse unauthorized account changes.
- Initiate a billing investigation.
- Associate tickets with an existing incident.
- Confirm a security incident.
- Reject a false incident candidate.
- Escalate to security specialists.
- Escalate to fraud specialists.
- Escalate to billing specialists.
- Escalate to network operations when relevant.
- Mark tickets as resolved or pending.

## Security Incident Lifecycle

A security incident should follow a controlled lifecycle:

POTENTIAL
↓
UNDER REVIEW
↓
CONFIRMED
↓
INVESTIGATION
↓
CONTAINED
↓
RESOLVED

Alternative path:

POTENTIAL
↓
REJECTED

The exact lifecycle should follow provider security operations.

## Duplicate Incident Prevention

Before creating a new security incident, the system should check whether
an existing incident covers:

- Similar security activity
- Similar affected accounts
- Similar time period
- Similar communication characteristics
- Similar SIM/eSIM activity
- Similar billing activity

If a matching incident exists:

ASSOCIATE TICKET WITH EXISTING INCIDENT

instead of creating a duplicate incident.

## AI Limitations

The AI must not:

- Declare fraud without sufficient evidence.
- Declare an account takeover without sufficient evidence.
- Request passwords.
- Request one-time passwords.
- Request authentication codes.
- Request security answers.
- Request full payment credentials.
- Bypass identity verification.
- Modify security settings without an authorized process.
- Guarantee account recovery.
- Guarantee financial reimbursement.
- Expose internal security systems.
- Expose fraud-detection methods.
- Expose internal investigation procedures.
- Automatically close a widespread security incident without
  authorization.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Security event type
- Account function affected
- SIM/eSIM involvement
- Billing involvement
- Communication type
- Customer interaction status
- Account access status
- Related ticket IDs
- Incident ID
- Verification status
- Incident status
- Incident confidence
- Actions taken
- Escalation reason
- Final action
- Final resolution

Do not record:

- Passwords
- One-time passwords
- Authentication codes
- Security answers
- Payment credentials
- Authentication tokens
- Device unlock codes

## Agent Guidance

Do not process every suspicious activity report as confirmed fraud.

Use available evidence and authorized provider information before
classifying an event.

Do not bypass identity verification.

Do not request sensitive authentication information.

Do not promise refunds or account restoration without authorization.

Do not assume that a lost device, unexpected notification, or failed
login automatically means an account was compromised.

Separate technical network problems from security incidents.

Separate billing disputes from confirmed fraud unless evidence connects
them.

Do not create duplicate security incidents.

Provider-specific security controls, authentication requirements, fraud
detection systems, investigation procedures, escalation queues, SLAs,
account-recovery processes, billing policies, and customer
communication procedures should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, the security system should support
automated analysis of potentially thousands or millions of complaints.

The architecture should support:

- Security-event classification
- Complaint similarity analysis
- Account activity correlation
- SIM/eSIM event correlation
- Billing-event correlation
- Communication-pattern analysis
- Temporal clustering
- Geographic analysis when relevant
- Potential incident generation
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security-team escalation
- Fraud-team escalation
- Billing-team escalation
- Incident lifecycle management
- Large numbers of concurrent security incidents
- Horizontal scaling of AI and processing services

Human agents should investigate incidents and exceptions rather than
manually comparing every individual complaint.

## Example Large-Scale Workflow

Customer Complaints
↓
AI Classification
↓
Security Event Detection
↓
Account / SIM / Billing Correlation
↓
Complaint Similarity
↓
Temporal Analysis
↓
Potential Security Incident
↓
Existing Incident Check
↓
YES → Associate Ticket With Existing Incident
NO → Create Potential Incident
↓
Human Review
↓
Confirm / Reject
↓
Security / Fraud / Billing Team
↓
Investigation
↓
Containment
↓
Resolution
↓
Related Tickets Updated

## Example Routing

### Unauthorized Account Access

Customer Complaint
↓
Verify Identity
↓
Review Account Activity
↓
Unauthorized Activity?
↓
YES → Secure Account
↓
Security Investigation

### SIM Swap

Customer Complaint
↓
Unexpected SIM/eSIM Change?
↓
YES → Verify Identity
↓
Secure Account and Mobile Line
↓
Security/Fraud Investigation

### Phishing

Customer Complaint
↓
Suspicious Communication
↓
Customer Interacted?
↓
NO → Record Scam Report
YES → Check Credential Exposure
↓
Potential Account Compromise
↓
Security Escalation

### Lost/Stolen Device

Customer Complaint
↓
Device Lost/Stolen
↓
Secure Mobile Line
↓
Check SIM/eSIM and Account Activity
↓
Suspicious Activity?
↓
NO → Lost Device Workflow
YES → Security/Fraud Escalation

### Suspicious Account Activity

Customer Complaint
↓
Identify Account Change
↓
Authorized?
↓
YES → Resolve / Explain
NO / UNKNOWN → Security Review
↓
Potential Incident?
↓
YES → Incident Escalation

### Billing Fraud

Customer Complaint
↓
Identify Charge
↓
Review Billing Record
↓
Unauthorized?
↓
YES / UNKNOWN → Billing + Security Review
NO → Explain Charge

## Source Basis

This article is a normalized knowledge article based on publicly
available account-security, SIM-swap, phishing, fraud-prevention,
lost-device, billing-security, and telecommunications customer-support
practices from US network providers, FCC consumer guidance, and general
cybersecurity guidance.

Provider-specific security controls, authentication requirements,
fraud-detection systems, incident thresholds, security investigation
procedures, escalation queues, SLAs, account-recovery procedures,
billing policies, and customer communication policies should be
maintained separately as provider-specific policy documents.