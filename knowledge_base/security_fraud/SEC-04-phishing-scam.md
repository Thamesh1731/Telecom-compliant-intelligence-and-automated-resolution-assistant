# SEC-04: Phishing and Scam

## Category
Security & Fraud

## Subcategory
Phishing, Fraudulent Messages, and Social Engineering

## Problem

The customer reports receiving a suspicious message, email, phone call,
website, or other communication that may attempt to obtain personal,
account, authentication, financial, or mobile-service information.

The communication may impersonate the customer's network provider or
another trusted organization.

## Common Symptoms

- Suspicious text message claiming to be from the provider
- Suspicious email claiming to be from the provider
- Unexpected phone call requesting account information
- Message asking the customer to click a link
- Message requesting a password or authentication code
- Message requesting payment information
- Message claiming the account will be suspended
- Message claiming the customer has won a reward or promotion
- Fake account-verification request
- Fake SIM/eSIM activation request
- Suspicious website resembling the provider's website
- Customer entered information into a suspicious website
- Customer provided information to a suspected scammer
- Customer suspects that their account credentials were compromised

## Possible Causes

- Phishing
- Smishing
- Vishing
- Fake provider communication
- Social engineering
- Malicious website
- Compromised email or messaging account
- Credential theft
- Fake account-recovery request
- Fraudulent payment request

The AI must not assume that a communication is fraudulent solely because
it appears unusual. Available evidence should be reviewed.

## Initial Diagnosis

Determine:

1. How the customer received the communication.
2. Date and time of the communication.
3. Whether it claimed to represent the provider.
4. What action the customer was asked to take.
5. Whether a link was included.
6. Whether the customer clicked the link.
7. Whether the customer entered any information.
8. Whether the customer provided a password.
9. Whether the customer provided an authentication code.
10. Whether the customer provided payment information.
11. Whether the customer noticed subsequent account changes.
12. Whether the customer lost access to their account.
13. Whether unexpected SIM/eSIM activity occurred.
14. Whether unauthorized billing activity occurred.

Do not request the customer's password, authentication codes, security
answers, or payment credentials.

## Common Phishing Indicators

Potential warning signs include:

- Unexpected request for sensitive information
- Urgent or threatening language
- Request for authentication codes
- Request for passwords
- Unexpected payment request
- Suspicious links
- Unusual sender address or phone number
- Misspelled or misleading domain names
- Claims that immediate action is required
- Requests to bypass normal provider procedures
- Requests to install unknown software
- Requests to move communication to an unusual channel

These indicators are not individually conclusive.

## Provider Impersonation

A scammer may impersonate:

- Mobile network provider
- Customer-support representative
- Billing department
- Security department
- Account-recovery team
- Technical-support team
- Delivery or payment service

The customer should use the provider's official communication channels
rather than relying on contact information supplied by a suspicious
message.

## Suspicious Link

If the customer receives a suspicious link:

- Do not instruct the customer to open it for investigation.
- Recommend using the provider's official website or application
  independently.
- Do not request that the customer send passwords or authentication
  codes.
- Do not treat the linked website as an authoritative provider source.

If the customer already clicked the link, determine whether information
was entered and whether subsequent account activity occurred.

## Customer Entered Credentials

If the customer entered a password or other sensitive authentication
information into a suspected phishing site:

1. Treat the credentials as potentially compromised.
2. Direct the customer through the provider's authorized account
   security process.
3. Recommend changing compromised credentials through the official
   provider channel.
4. Review recent account activity.
5. Check for unauthorized SIM/eSIM changes.
6. Check for unauthorized account changes.
7. Escalate when account compromise is suspected.

Do not ask the customer to provide the compromised password.

## Customer Provided Authentication Code

Authentication codes are sensitive security information.

The customer should never provide such codes to the AI, human agent,
or another person unless the provider's authorized process explicitly
requires a secure mechanism for doing so.

If the customer provided a code to a suspected scammer:

- Treat the account as potentially compromised.
- Follow the provider's authorized account-security process.
- Review recent account activity.
- Check for SIM/eSIM changes.
- Escalate when required.

Do not request the code itself.

## Customer Provided Payment Information

If payment information was provided to a suspected scammer:

- Do not request full payment credentials.
- Route the case through the provider's authorized fraud or billing
  process.
- Review relevant account activity.
- Review charges when applicable.
- Escalate according to provider procedures.

The AI should not make assumptions about whether a payment account has
actually been compromised.

## Customer Clicked a Suspicious Link

Determine:

- Whether the customer entered information.
- Whether they downloaded anything.
- Whether they logged into an account.
- Whether they noticed subsequent account changes.

If credentials or other sensitive information were entered, escalate
through the appropriate account-security process.

## Customer Did Not Interact With the Scam

If the customer only received the message and did not interact with it:

- Do not treat the account as compromised without additional evidence.
- Explain that suspicious communication should not be trusted.
- Direct the customer to official provider channels for verification.
- Record the report through the provider's approved fraud-reporting
  process when available.

## Diagnosis Guidance

### Suspicious Message, No Interaction

Likely phishing or scam attempt.

No account compromise should be assumed.

### Suspicious Message + Credentials Entered

Potential account compromise.

Route through:

`SEC-01: Unauthorized Account Access`

### Suspicious Message + SIM/eSIM Change

Potential SIM-swap activity.

Route through:

`SEC-02: SIM Swap Fraud`

### Suspicious Message + Unauthorized Charges

Potential fraud and billing issue.

Escalate to the appropriate security and billing/fraud workflows.

### Suspicious Message + Multiple Customers

Potential broader phishing campaign.

Correlate similar reports and escalate to the security/fraud team when
appropriate.

## Resolution

The issue may be resolved by:

- Identifying the communication as suspicious.
- Directing the customer to official provider channels.
- Securing compromised accounts through authorized procedures.
- Reviewing suspicious account activity.
- Reviewing SIM/eSIM activity.
- Reviewing billing activity when applicable.
- Reporting the suspected scam through the provider's approved process.
- Escalating confirmed or suspected security incidents.

The AI should not claim that a scammer has been identified unless
authoritative evidence supports that conclusion.

## Escalation Conditions

Escalate when:

- Customer entered account credentials into a suspicious website.
- Customer provided an authentication code to a suspected scammer.
- Customer reports unauthorized account changes.
- Customer reports an unexpected SIM/eSIM change.
- Customer reports unauthorized charges.
- Customer has lost access to their account.
- Multiple customers report the same suspicious communication.
- The communication appears to target provider accounts at scale.
- A security investigation is required.
- The provider's security team needs the communication details for
  investigation.

## Potential Phishing Campaign

Multiple similar reports may indicate a coordinated phishing campaign.

Example:

Ticket 6001
"Received a text saying my account would be suspended unless I clicked
a link."

Ticket 6002
"Got the same account suspension message."

Ticket 6003
"Received a message asking me to verify my provider account."

Similar message
+
Similar sender characteristics
+
Similar time period
=
Potential Phishing Campaign

The AI must not declare a confirmed campaign without authorized security
confirmation.

## Incident Information

A phishing incident should contain:

- Incident ID
- Incident category
- First detected date/time
- Communication type
- Reported sender information, when appropriate
- Common message characteristics
- Number of related reports
- Affected service
- Potential account-security impact
- Current status
- Confidence level
- Human confirmation status
- Related ticket IDs

Do not store:

- Customer passwords
- Authentication codes
- Payment credentials
- Security answers
- Account recovery secrets

Any captured suspicious message content should be handled according to
the provider's approved security and data-retention policies.

## Confidence Levels

### Low

Suspicious communication reported with limited supporting evidence.

### Medium

Multiple phishing indicators are present or similar reports exist.

### High

Strong evidence indicates a coordinated or provider-impersonation
campaign.

### Confirmed

Provider security or fraud personnel confirm the phishing or scam
campaign.

## Human Agent Workflow

When a phishing or scam complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Determine the communication channel.
4. Review available message characteristics.
5. Determine whether the customer interacted with the communication.
6. Determine whether credentials or other sensitive information may have
   been exposed.
7. Check recent account activity.
8. Check SIM/eSIM activity when relevant.
9. Check billing activity when relevant.
10. Review related phishing reports.
11. Determine whether a broader campaign may exist.
12. Secure the customer's account when authorized.
13. Escalate to security/fraud specialists when required.
14. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Communication type
- Sender information when appropriate
- General description of the communication
- Whether customer interacted with it
- Whether credentials may have been exposed
- Whether SIM/eSIM activity occurred
- Whether billing activity occurred
- Related ticket IDs
- Incident ID
- Verification status
- Actions taken
- Escalation reason
- Final resolution

Do not record:

- Passwords
- Authentication codes
- Security answers
- Full payment credentials
- Account recovery secrets

## Agent Guidance

Do not ask customers to provide passwords or authentication codes.

Do not ask customers to click suspicious links.

Do not use suspicious links as authoritative provider sources.

Do not request full payment credentials.

Do not bypass identity verification.

Do not state that a communication is definitively fraudulent unless
sufficient evidence or authorized provider information supports the
conclusion.

Do not promise that compromised information can be recovered.

Do not expose internal fraud-detection systems or security
investigation methods.

Do not create duplicate incidents when an existing phishing incident
already covers the same campaign.

Provider-specific phishing-reporting procedures, security controls,
fraud investigation processes, account-recovery procedures, customer
communication policies, and incident response procedures should be
maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, phishing and scam reports should support
automated detection of common communication patterns.

The architecture should support:

- Communication classification
- Sender-pattern analysis
- Complaint similarity analysis
- Time-window analysis
- Campaign detection
- Account-security correlation
- SIM/eSIM correlation
- Billing correlation
- Potential incident generation
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security/fraud escalation
- Large numbers of simultaneous reports

Human agents should investigate campaigns and compromised accounts
rather than manually comparing every individual report.

## Example

Customer complaint:

"I received a text claiming to be from my mobile provider saying my
account would be suspended unless I clicked a link. I did not click it."

The system detects:

- Provider impersonation
- Urgency
- Suspicious link
- No customer interaction

AI assessment:

POTENTIAL PHISHING ATTEMPT

Priority:

LOW

Human action:

Record the report through the approved fraud-reporting process and
provide the customer with official provider channels for account
verification.

## Example of Account Compromise

Customer complaint:

"I clicked a link from a message that looked like it was from my
provider and entered my account password. Shortly afterward, I received
an unexpected account-change notification."

The system detects:

- Suspected phishing
- Credentials potentially compromised
- Subsequent account activity

AI assessment:

POTENTIAL ACCOUNT COMPROMISE

Priority:

HIGH

Human action:

Follow the authorized account-security process, secure the account,
review recent activity, and escalate to security/fraud specialists.

## Source Basis

This article is a normalized knowledge article based on publicly
available phishing, smishing, social-engineering, account-security,
fraud-prevention, and telecommunications customer-support practices
from US network providers, FCC consumer guidance, and general
cybersecurity guidance.

Provider-specific phishing-reporting procedures, authentication
requirements, account-recovery processes, fraud investigation systems,
security controls, incident response procedures, and customer
communication policies should be maintained separately as
provider-specific policy documents.