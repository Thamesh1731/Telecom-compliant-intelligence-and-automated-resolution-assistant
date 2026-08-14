# ACC-06: Account and SIM Escalation

## Category
Account / SIM

## Subcategory
Escalation

## Purpose

This article defines when an Account or SIM complaint must be
transferred from automated support to a human agent.

The AI should handle routine account and SIM questions when the issue is
clearly understood and can be resolved using available information.

The AI must escalate when the issue requires identity verification,
account modification, SIM/eSIM provisioning, security investigation,
manual correction, or carrier-side intervention.

## Issues Covered

This escalation workflow applies to:

- SIM not detected
- Damaged or lost SIM
- SIM replacement
- eSIM activation problems
- eSIM transfer problems
- Account login problems
- Account recovery problems
- Account information changes

## When AI Can Handle the Complaint

The AI may resolve the complaint when:

- The problem is clearly identified.
- The required information is available.
- Standard troubleshooting is sufficient.
- No sensitive account operation is required.
- No manual account correction is required.
- No carrier-side SIM/eSIM provisioning is required.
- The recommended action is low-risk.

## When Human Escalation Is Required

### 1. SIM Cannot Be Detected

Escalate when:

- The SIM remains undetected after standard troubleshooting.
- The SIM appears defective.
- SIM provisioning is incorrect.
- The mobile line cannot be associated with the SIM.
- The device or SIM slot may have a hardware problem.

### 2. SIM Replacement Required

Escalate when:

- The SIM is lost or stolen.
- A replacement SIM must be issued.
- The replacement SIM requires carrier-side activation.
- The replacement SIM cannot be provisioned.
- Account verification is required before replacement.
- Manual account or line correction is required.

### 3. eSIM Activation or Transfer Failure

Escalate when:

- A valid eSIM cannot be activated.
- eSIM provisioning fails.
- An eSIM transfer cannot be completed.
- The activation information must be reissued.
- The mobile line cannot be associated with the eSIM.
- Account or device records are inconsistent.
- Carrier-side intervention is required.

### 4. Account Access Failure

Escalate when:

- Account recovery repeatedly fails.
- Verification cannot be completed.
- The account remains locked and requires manual intervention.
- Account records appear inconsistent.
- Provider authentication systems appear unavailable.
- Unauthorized account activity is suspected.

### 5. Account Information Change

Escalate when:

- The requested change cannot be completed through authorized
  self-service.
- Identity verification is unsuccessful.
- The change was accepted but the account was not updated.
- Account records contain conflicting information.
- Ownership or security-sensitive changes are requested.
- Manual account correction is required.

## Security Escalation

Immediately route to the appropriate security/account-support process
when there is evidence or a credible report of:

- Unauthorized account access
- Unauthorized SIM replacement
- Lost or stolen SIM with potential account compromise
- Unauthorized account changes
- Suspicious mobile-line activity

The AI must not attempt to independently determine whether fraud has
occurred.

## Geographic and Temporal Analysis

Account and SIM complaints can be analyzed using:

- City
- State
- ZIP code
- Date
- Time

Geographic clustering can help identify potential provider-side issues.

For example:

Multiple customers
      +
Same ZIP code
      +
Same time period
      +
SIM/eSIM activation failures
      ↓
Potential provider-side provisioning issue
      ↓
Human / technical escalation

Geographic concentration alone is not proof of a provider fault.

The system should consider:

- Number of complaints
- Complaint similarity
- Geographic concentration
- Time concentration
- Affected service
- Known provider incidents

before generating a provider-level escalation.

## Escalation Priority

### High Priority

Consider high priority when:

- Multiple customers are unable to activate or use SIM/eSIM service.
- A widespread provisioning problem is suspected.
- Unauthorized account activity is suspected.
- Lost or stolen SIM activity may compromise an account.
- A large number of customers cannot access their accounts.
- A provider authentication or provisioning outage is suspected.

### Medium Priority

Consider medium priority when:

- Individual SIM replacement requires manual intervention.
- eSIM activation requires carrier-side investigation.
- Account recovery cannot be completed automatically.
- Account information is inconsistent.
- A requested account change requires manual correction.

### Low Priority

Consider low priority when:

- The issue is isolated.
- No immediate service or security impact exists.
- Additional information is required before investigation.

Final priority should follow the provider's operational policies.

## Information Required Before Escalation

The AI should provide the human agent with:

- Ticket ID
- Original customer complaint
- Complaint category
- Complaint subcategory
- Customer city
- State
- ZIP code
- Date
- Time
- Device type, when available
- SIM/eSIM type
- Mobile line, when available
- Account status, when available
- SIM/eSIM status
- Activation status
- Error message
- Troubleshooting completed
- Previous attempts
- AI assessment
- Escalation reason
- Recommended next action

Do not include passwords, one-time verification codes, security PINs,
authentication tokens, or unnecessary payment credentials.

## AI Escalation Output

The system should generate a structured escalation record.

### Decision

`ESCALATE`

### Category

`Account / SIM`

### Subcategory

Example:

`eSIM Activation`

### Priority

`LOW | MEDIUM | HIGH`

### Reason

A concise explanation of why human intervention is required.

### Customer Summary

A short summary of the customer's issue.

### Troubleshooting Completed

List the steps already attempted.

### AI Assessment

State the likely issue without presenting uncertain conclusions as
facts.

### Recommended Action

State what the human agent should investigate next.

### Evidence

Include relevant information from the complaint and knowledge base.

## Example Escalation

### Customer Complaint

"My old SIM stopped working. I received a replacement SIM, but the new
one still isn't recognized by my phone."

### AI Decision

`ESCALATE`

### Priority

`MEDIUM`

### Reason

Replacement SIM remains undetected after standard troubleshooting and
may require provisioning or device investigation.

### AI Assessment

Potential replacement-SIM provisioning or device/SIM-slot issue.

### Recommended Action

Verify replacement-SIM provisioning and mobile-line association, then
investigate the device if provisioning is correct.

## Human Agent Workflow

When an Account/SIM complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Review troubleshooting already completed.
4. Verify the customer's identity using the provider's authorized
   authentication process.
5. Verify account and mobile-line status.
6. Verify SIM/eSIM status.
7. Check provisioning or activation status.
8. Perform authorized account or carrier-side actions.
9. Resolve the complaint when possible.
10. Escalate to a specialist when required.
11. Record the final action and resolution.

## Human Agent Actions

The human agent may:

- Replace a SIM.
- Activate or provision a SIM.
- Provision an eSIM.
- Correct a mobile-line association.
- Restore authorized account access.
- Correct account information.
- Initiate account-security procedures.
- Request additional verification.
- Create a technical investigation.
- Mark the ticket as pending.
- Escalate to a specialist.

## AI Limitations

The AI must not:

- Request or store account passwords.
- Request or store one-time verification codes.
- Bypass identity verification.
- Change account ownership automatically.
- Deactivate or replace a SIM without authorization.
- Activate an eSIM without the provider's authorized process.
- Expose private account information before authentication.
- Declare fraud with certainty.
- Promise account restoration times without authoritative information.
- Invent provider-specific SIM or account policies.

## Provider-Specific Policies

The generic knowledge base should not contain hard-coded:

- SIM replacement fees
- eSIM activation procedures
- Account recovery deadlines
- Authentication requirements
- Ownership-transfer rules
- Account lock durations
- Provider-specific contact information
- Supported device lists

These should be maintained separately as provider-specific policy
documents.

This allows the same AI architecture to support multiple network
providers without rewriting the core knowledge base.

## Agent Guidance

The purpose of escalation is to transfer useful context to a human
agent, not simply to tell the customer to contact support again.

The human agent should receive:

- What happened
- What was checked
- What was ruled out
- What remains uncertain
- Why escalation occurred
- What action should be taken next

For security-sensitive complaints, follow the provider's authorized
security process before performing account or SIM changes.

## Example Routing

### SIM Not Detected

SIM not detected
      ↓
Basic troubleshooting
      ↓
Still not detected?
   ┌──┴──┐
  NO    YES
   ↓      ↓
Resolve  ACC-06

### eSIM Activation

eSIM activation
      ↓
Compatible device?
      ↓
Valid activation information?
      ↓
Provisioning successful?
   ┌──┴──┐
  YES   NO
   ↓     ↓
Resolve ACC-06

### Account Access

Login problem
      ↓
Normal recovery works?
   ┌──┴──┐
  YES   NO
   ↓     ↓
Resolve ACC-06

## Source Basis

This article is a normalized knowledge article based on publicly
available account, SIM, eSIM, and security support guidance from:

- Apple Support
- Verizon Wireless Support
- AT&T Wireless Support
- T-Mobile Wireless Support

Provider-specific escalation queues, SLAs, authentication procedures,
SIM replacement policies, eSIM procedures, and internal security
processes should be maintained separately as provider-specific policy
documents.