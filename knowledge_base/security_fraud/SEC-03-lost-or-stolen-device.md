# SEC-03: Lost or Stolen Device

## Category
Security & Fraud

## Subcategory
Lost or Stolen Mobile Device

## Problem

The customer reports that their mobile device has been lost or stolen
and wants to protect their mobile account, mobile number, SIM/eSIM,
personal information, and services.

A lost or stolen device may create risks involving unauthorized access,
SIM/eSIM misuse, account compromise, personal information exposure, and
unauthorized service or billing activity.

## Common Scenarios

- Customer lost their mobile phone.
- Customer's phone was stolen.
- Customer cannot locate their device.
- Customer believes someone may have access to the device.
- Customer wants to suspend the mobile line.
- Customer wants to replace the SIM/eSIM.
- Customer wants to protect their account after losing the device.
- Customer cannot receive calls or SMS because the device is unavailable.
- Customer suspects unauthorized activity after the device was lost.
- Customer suspects the stolen device has been used by another person.

## Possible Risks

- Unauthorized access to the device
- Unauthorized access to account applications
- Exposure of personal information
- Unauthorized account access
- Unauthorized SIM/eSIM replacement
- SIM-swap fraud
- Unauthorized calls or messages
- Unauthorized mobile data usage
- Unauthorized purchases
- Access to stored authentication sessions
- Access to email or other accounts through the device

The AI must not assume that unauthorized activity has occurred solely
because a device was lost or stolen.

## Initial Diagnosis

Determine:

1. Whether the device is lost or stolen.
2. Approximate date and time the device was lost or stolen.
3. Whether the customer can currently access their provider account.
4. Whether the mobile line is still active.
5. Whether the customer has access to another device.
6. Whether the customer has access to their account through an
   authorized channel.
7. Whether the customer has noticed unauthorized account activity.
8. Whether the customer has noticed unauthorized billing activity.
9. Whether the customer suspects SIM/eSIM changes.
10. Whether the device contains sensitive personal information.
11. Whether the customer has already reported the device as lost or
    stolen through an authorized device-management service.

Do not request passwords, authentication codes, security answers, or
other secret credentials.

## Immediate Protection

When a device is lost or stolen, the customer should be directed
through the provider's authorized lost-device process.

Depending on provider procedures, this may include:

- Suspending the mobile line.
- Blocking or restricting service on the lost device.
- Securing the account.
- Replacing the SIM/eSIM.
- Reviewing recent account activity.
- Reviewing recent billing activity.
- Using an authorized device-location or remote-lock feature.
- Reporting the device as stolen when appropriate.
- Restoring service on a replacement device.

The exact available actions depend on the provider and device.

## Account Security

A lost or stolen device may still contain active account sessions.

The customer should use authorized security procedures to protect:

- Provider account
- Email account
- Financial applications
- Messaging applications
- Other accounts accessible from the device

The AI should not provide instructions for bypassing device security
or account authentication.

## Mobile Line Protection

If the customer believes the device is compromised, the mobile line
may need to be temporarily suspended or otherwise protected through the
provider's authorized process.

Before making account or service changes, the provider must complete its
required customer verification.

## SIM/eSIM Protection

If the customer reports an unexpected SIM/eSIM change after losing the
device:

Route the case to:

`SEC-02: SIM Swap Fraud`

If the customer simply needs a legitimate replacement SIM/eSIM, route
through the provider's normal SIM replacement process.

Do not assume that a SIM replacement request is fraudulent.

## Unauthorized Activity

If the customer reports:

- Unexpected account changes
- Unauthorized password changes
- Unexpected SIM/eSIM activation
- Unrecognized purchases
- Unrecognized calls or messages
- Other suspicious activity

the complaint should also be routed to the appropriate security,
fraud, or billing workflow.

For unauthorized account access:

`SEC-01: Unauthorized Account Access`

For suspected SIM-swap activity:

`SEC-02: SIM Swap Fraud`

## Device Location and Remote Protection

If the customer's device supports an authorized device-location or
remote-protection service, the customer may use the relevant
manufacturer or platform tools.

The provider should not claim that it can locate a device unless the
provider actually offers and supports such functionality.

The AI must not claim to know the physical location of the customer's
device.

## Troubleshooting Procedure

### 1. Confirm Loss or Theft

Determine whether the device is:

- Lost
- Stolen
- Temporarily misplaced

### 2. Secure the Mobile Line

Follow the provider's authorized process for protecting or suspending
the mobile line when appropriate.

### 3. Secure the Account

Verify the customer through the authorized authentication process and
review account security when necessary.

### 4. Check SIM/eSIM Status

Review whether the mobile line has experienced a recent SIM/eSIM
change.

### 5. Check Account Activity

Review recent security-sensitive changes.

### 6. Check Billing Activity

Review recent charges or purchases when the customer reports
unauthorized activity.

### 7. Replace SIM/eSIM

If authorized, issue or activate a replacement SIM/eSIM through the
provider's normal process.

### 8. Restore Service

After replacement or account recovery, verify that the mobile line is
active on the authorized replacement device/SIM/eSIM.

## Diagnosis Guidance

### Device Lost, No Suspicious Activity

Treat as a lost-device case.

Secure the mobile line and provide the provider's authorized
replacement or recovery process.

### Device Stolen, No Suspicious Activity

Treat as a stolen-device security case.

Secure the mobile line and account as appropriate.

### Device Lost + Unauthorized Account Changes

Potential account compromise.

Route to:

`SEC-01: Unauthorized Account Access`

### Device Lost + Unexpected SIM Change

Potential SIM-swap activity.

Route to:

`SEC-02: SIM Swap Fraud`

### Device Stolen + Unauthorized Charges

Potential broader fraud event.

Escalate to the appropriate security and billing/fraud teams.

### Customer Cannot Access Account

Use the provider's authorized account-recovery and identity-verification
process.

Do not bypass authentication.

## Resolution

The issue may be resolved by:

- Securing or suspending the mobile line.
- Securing the provider account.
- Replacing the SIM/eSIM.
- Activating service on an authorized replacement device.
- Reviewing and reversing unauthorized changes when authorized.
- Reviewing suspicious billing activity.
- Escalating confirmed or suspected fraud.
- Providing approved lost-device guidance.

The AI should not claim that a device or account has been secured unless
the provider system confirms the action.

## Escalation Conditions

Escalate when:

- The device was stolen and account compromise is suspected.
- Unauthorized account changes are present.
- An unexpected SIM/eSIM change occurred.
- Unauthorized billing activity is present.
- The customer cannot regain authorized account access.
- Identity verification fails.
- Manual account intervention is required.
- Fraud investigation is required.
- Multiple accounts show similar suspicious activity.
- The provider cannot determine whether the mobile line remains secure.

## Potential Lost-Device Security Incident

A single lost or stolen device does not necessarily represent a broader
security incident.

However, multiple similar suspicious cases may indicate a larger issue.

Example:

Ticket 5001
"Phone stolen and SIM changed without permission."

Ticket 5002
"Lost phone followed by unexpected eSIM activation."

Ticket 5003
"Phone stolen and account settings changed."

Similar activity
+
Similar time period
=
Potential Security Incident

The system must not declare a confirmed security incident without
authorized security confirmation.

## Incident Information

A lost-device security incident should contain:

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
- Device unlock codes

## Confidence Levels

### Low

Lost or stolen device reported with no evidence of unauthorized
activity.

### Medium

Lost or stolen device combined with suspicious account or SIM/eSIM
activity.

### High

Lost or stolen device combined with confirmed unauthorized account,
SIM/eSIM, or billing activity.

### Confirmed

Provider security or fraud personnel confirm unauthorized activity.

## Human Agent Workflow

When a lost or stolen device complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Confirm the mobile line.
5. Secure or suspend the line when authorized.
6. Review recent SIM/eSIM activity.
7. Review recent account activity.
8. Review billing activity when relevant.
9. Determine whether fraud is suspected.
10. Replace or restore the SIM/eSIM when authorized.
11. Restore service on the authorized replacement device when applicable.
12. Escalate to security/fraud teams when required.
13. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Lost/stolen status
- Mobile line status
- SIM/eSIM status
- Account-security indicators
- Billing indicators, when applicable
- Replacement status
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
- Device unlock codes

## Agent Guidance

Do not ask customers to provide passwords or one-time authentication
codes.

Do not bypass identity verification.

Do not claim that the provider can locate a device unless that
functionality is actually supported.

Do not claim that a lost device has been remotely locked or wiped unless
the relevant system confirms the action.

Do not assume a lost device resulted in account compromise.

Do not assume a SIM replacement is fraudulent without supporting
evidence.

Do not promise recovery of the physical device.

Do not expose internal security systems or fraud-detection methods.

Do not create duplicate incidents when an existing security incident
already covers the same activity.

Provider-specific lost-device procedures, line suspension rules,
replacement SIM/eSIM procedures, authentication requirements, device
blocking policies, security controls, and fraud escalation procedures
should be maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, lost and stolen device complaints should
support automated correlation of suspicious account, SIM/eSIM, and
billing activity.

The architecture should support:

- Lost/stolen device classification
- Account activity correlation
- SIM/eSIM event correlation
- Billing-event correlation
- Complaint similarity analysis
- Time-window analysis
- Potential security incident detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Confidence scoring
- Human confirmation
- Security/fraud escalation
- Large numbers of simultaneous cases

Human agents should investigate suspicious cases rather than manually
comparing every individual complaint.

## Example

Customer complaint:

"My phone was stolen yesterday. I cannot access my account, and I
received a notification that a new SIM was activated."

The system detects:

- Stolen device
- Loss of account access
- Unexpected SIM activation

AI assessment:

POTENTIAL ACCOUNT COMPROMISE AND SIM SWAP

Priority:

HIGH

Human action:

Verify the customer's identity through the authorized security
process, secure the account and mobile line, investigate the SIM change,
and escalate to security/fraud specialists.

## Example of Normal Lost-Device Case

Customer complaint:

"I lost my phone while traveling. My account is still accessible and
I have not noticed any suspicious activity."

The system detects:

- Lost device
- No reported account compromise
- No reported SIM/eSIM changes
- No reported unauthorized billing

AI assessment:

LOST DEVICE

Human action:

Follow the provider's authorized lost-device and SIM/eSIM replacement
process.

## Source Basis

This article is a normalized knowledge article based on publicly
available lost/stolen-device, mobile-account security, SIM/eSIM
protection, fraud-prevention, and telecommunications customer-support
practices from US network providers and FCC consumer guidance.

Provider-specific lost-device procedures, line suspension rules,
device-blocking capabilities, replacement SIM/eSIM procedures,
authentication requirements, account-security controls, and fraud
escalation procedures should be maintained separately as
provider-specific policy documents.