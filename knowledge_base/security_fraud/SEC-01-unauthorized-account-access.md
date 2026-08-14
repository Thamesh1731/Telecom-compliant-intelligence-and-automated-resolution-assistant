# SEC-01: Unauthorized Account Access

## Category
Security & Fraud

## Subcategory
Unauthorized Account Access

## Problem

The customer reports that someone may have accessed their mobile
provider account without authorization.

The complaint may involve unauthorized login, account changes,
unexpected profile activity, or suspicious access to account
information.

## Common Symptoms

- Customer received an unexpected account login notification
- Customer cannot access their account because account credentials were
  changed
- Account information changed without authorization
- Customer notices an unfamiliar device or login
- Password or security credentials were changed unexpectedly
- Customer received an unexpected password-reset notification
- Customer received an unexpected verification request
- Customer notices unfamiliar account activity
- Customer reports that someone else may have accessed the account
- Customer reports unauthorized changes to services or settings

## Possible Causes

- Compromised account credentials
- Phishing attack
- Reused or exposed password
- Compromised email account
- Unauthorized access to a customer device
- Stolen authentication information
- SIM-related account compromise
- Social engineering
- Provider-side security issue
- Customer mistakenly interpreting a legitimate notification as
  unauthorized activity

The AI must not assume which cause occurred without sufficient evidence.

## Initial Diagnosis

Determine:

1. What unauthorized activity the customer observed.
2. Date and time of the suspected activity.
3. Whether the customer can still access the account.
4. Whether account credentials were changed.
5. Whether account information was changed.
6. Whether the customer received unexpected security notifications.
7. Whether the customer recognizes the reported activity.
8. Whether the mobile service itself is affected.
9. Whether the customer suspects SIM/eSIM changes.
10. Whether financial or billing activity is also involved.

Do not request passwords, authentication codes, security PINs, or other
secret credentials.

## Security vs Normal Account Activity

### Potential Unauthorized Access

More likely when:

- Customer does not recognize an account change.
- Customer receives an unexpected authentication notification.
- Account credentials changed without authorization.
- Multiple unexpected account changes occur.
- Customer reports loss of account control.

### Normal Account Activity

Possible when:

- The customer performed the change themselves.
- An authorized account user performed the change.
- The notification corresponds to a legitimate provider action.

The AI should verify available account information before labeling an
event unauthorized.

## Immediate Customer Protection

When unauthorized access is reasonably suspected, the customer should
be directed through the provider's authorized security process.

Depending on provider procedures, this may include:

- Securing the account.
- Changing compromised credentials.
- Reviewing account activity.
- Revoking unauthorized sessions.
- Verifying account ownership.
- Blocking unauthorized account changes.
- Reviewing SIM/eSIM changes.
- Reviewing billing activity.

The AI must not bypass provider authentication procedures.

## Account Access Lost

If the customer can no longer access the account:

1. Do not request the customer's password.
2. Use the provider's authorized account-recovery process.
3. Require appropriate identity verification.
4. Determine whether account credentials were changed.
5. Check for other unauthorized account changes.
6. Escalate if automated recovery fails.

## Unexpected Account Changes

Review available information for unauthorized changes such as:

- Contact information
- Password
- Security settings
- Service features
- Mobile-line settings
- SIM/eSIM information
- Device information
- Billing-related settings

Only authorized provider systems should be used to verify account
changes.

## SIM/eSIM Security Relationship

Unauthorized account access may be associated with unauthorized SIM or
eSIM activity.

If the customer reports:

- Unexpected SIM replacement
- Unexpected eSIM activation
- Loss of cellular service following suspicious account activity
- Unexpected mobile-line changes

route the case to the appropriate SIM-security or fraud workflow.

Do not assume that every unexpected loss of service is caused by fraud.

## Billing Security Relationship

If unauthorized account access is accompanied by:

- Unrecognized purchases
- Unexpected service changes
- Unrecognized charges
- Unauthorized plan changes

the complaint should also be routed to the appropriate billing or fraud
workflow.

Security review and billing review may need to occur separately.

## Troubleshooting Procedure

### 1. Confirm the Complaint

Determine exactly what the customer observed.

Avoid asking broad questions such as "Was your account hacked?"

Instead identify the specific event.

### 2. Check Account Access

Determine whether the customer can still access the account through the
provider's authorized channels.

### 3. Check Security Notifications

Review available notifications for:

- Login
- Password change
- Account recovery
- Security-setting change
- SIM/eSIM change
- Other security-sensitive activity

### 4. Check Account Changes

Review recent authorized account changes.

### 5. Check SIM/eSIM Activity

If the customer reports loss of mobile service or suspicious SIM
activity, verify whether a recent SIM/eSIM change occurred.

### 6. Check Billing Activity

If suspicious financial activity is reported, route to the relevant
billing or fraud process.

## Escalation Conditions

Escalate immediately or with high priority when:

- The customer has lost control of the account.
- Unauthorized credentials changes are suspected.
- Unauthorized SIM/eSIM changes are suspected.
- Multiple unauthorized account changes occurred.
- Unauthorized financial activity is suspected.
- Identity verification fails during recovery.
- The customer reports possible account takeover.
- Security controls need to be manually restored.
- The account requires specialist security investigation.
- Automated recovery cannot restore authorized account access.

## Security Incident

When multiple customers experience similar unauthorized account access
patterns, the system may generate a potential security incident.

Example:

Ticket 3001
"Someone changed my account password."

Ticket 3002
"Received an unexpected login notification."

Ticket 3003
"My account contact information was changed."

Similar activity
+
Similar time period
+
Common provider system
=
Potential Security Incident

The AI must not declare a confirmed security incident without
authorized security or provider confirmation.

## Incident Information

A security incident should contain:

- Incident ID
- Incident category
- First detected date/time
- Number of related tickets
- Common activity pattern
- Affected account function
- Geographic information when relevant
- Current status
- Confidence level
- Human confirmation status
- Related ticket IDs

Do not include passwords, authentication codes, security answers, or
other secret credentials in the incident record.

## Confidence Levels

### Low

Limited evidence or an unclear unauthorized activity report.

### Medium

Multiple suspicious indicators or confirmed unauthorized account
changes.

### High

Strong evidence of unauthorized account activity affecting one or
more accounts.

### Confirmed

Provider security personnel or an authorized security system confirms
the incident.

## Human Agent Workflow

When an unauthorized-access complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity using the provider's authorized process.
4. Review recent account activity.
5. Review security-related changes.
6. Check SIM/eSIM activity when relevant.
7. Check billing activity when relevant.
8. Secure the account using authorized procedures.
9. Reverse unauthorized changes when authorized.
10. Escalate to the security/fraud team when required.
11. Document the actions taken.
12. Record the final resolution.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Suspected unauthorized activity
- Account function affected
- SIM/eSIM involvement, when applicable
- Billing involvement, when applicable
- Security notifications
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

Do not ask customers to provide passwords or one-time authentication
codes.

Do not bypass identity verification.

Do not confirm sensitive account information before completing the
provider's required authentication process.

Do not state that an account was hacked unless the evidence or
authorized provider investigation supports that conclusion.

Do not promise that unauthorized activity will be reversed unless the
provider's authorized process allows it.

Do not expose internal security systems, detection methods, or
investigation procedures.

Do not create duplicate security incidents when an existing incident
already covers the same activity.

Provider-specific account recovery procedures, authentication
requirements, fraud controls, security contacts, investigation
procedures, and remediation policies should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, unauthorized account-access complaints
should support automated detection of suspicious patterns.

The architecture should support:

- Security-event classification
- Account activity correlation
- Complaint similarity analysis
- Time-window analysis
- SIM/eSIM event correlation
- Billing-event correlation
- Potential security incident detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security-team escalation
- Large numbers of simultaneous security complaints

Human agents should investigate security incidents rather than manually
comparing every individual complaint.

## Example

Customer complaint:

"I received a notification that my account password was changed, but I
didn't change it. I can no longer log in."

The system detects:

- Unexpected credential change
- Loss of account access
- Customer denies making the change

AI assessment:

POTENTIAL UNAUTHORIZED ACCOUNT ACCESS

Priority:

HIGH

Human action:

Verify the customer's identity through the authorized provider
security process, secure the account, investigate recent changes, and
escalate to the security team if required.

## Example of Potential Security Incident

Customer complaints:

Ticket 3101
"Unexpected password reset."

Ticket 3102
"My account email was changed."

Ticket 3103
"Someone changed my account settings."

All events occur within a similar period.

AI assessment:

POTENTIAL ACCOUNT SECURITY INCIDENT

Human action:

Review the related accounts and provider security events and determine
whether a broader security incident exists.

## Source Basis

This article is a normalized knowledge article based on publicly
available account-security, authentication, fraud-prevention, and
telecommunications customer-support practices from US network providers
and FCC consumer guidance.

Provider-specific authentication requirements, account-recovery
procedures, security controls, fraud investigation processes, incident
response procedures, and customer communication policies should be
maintained separately as provider-specific policy documents.