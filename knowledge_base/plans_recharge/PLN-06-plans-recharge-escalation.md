# PLN-06: Plans and Recharge Escalation

## Category
Plans / Recharge

## Subcategory
Escalation

## Purpose

This article defines when a plans or recharge complaint must be
transferred from automated support to a human agent.

The AI should handle routine plan and recharge questions when the
available account information and knowledge base are sufficient.

The AI should escalate when the issue requires account investigation,
manual correction, payment investigation, plan activation, or
provider-side intervention.

## Issues Covered

This escalation workflow applies to:

- Failed recharge
- Recharge not reflected
- Plan activation problem
- Plan change problem
- Plan expiry problem
- Plan renewal problem

## When AI Can Handle the Complaint

The AI may resolve the complaint when:

- The issue is clearly identified.
- The required information is available.
- The solution is covered by the knowledge base.
- No account correction is required.
- No manual payment investigation is required.
- No carrier-side intervention is required.
- The recommended action is low-risk and reversible.

## When Human Escalation Is Required

### 1. Payment Succeeded but Recharge Is Missing

Escalate when:

- Payment is confirmed successful.
- Recharge is not reflected.
- Account balance is incorrect.
- The transaction cannot be reconciled automatically.

Do not ask the customer to make another payment before the original
transaction is investigated.

### 2. Plan Activation Failure

Escalate when:

- Payment was successful but the plan remains inactive.
- Plan status conflicts with the transaction record.
- Activation remains pending beyond the applicable processing period.
- Manual activation or correction is required.

### 3. Incorrect Plan or Wrong Mobile Line

Escalate when:

- The wrong plan was activated.
- A plan was applied to the wrong mobile line.
- A customer with multiple lines cannot determine which line received
  the plan.
- Account correction is required.

### 4. Failed Plan Change

Escalate when:

- The requested plan appears eligible but cannot be activated.
- The system repeatedly rejects the plan change.
- A plan change remains pending beyond the applicable processing period.
- Payment succeeded but the plan change did not occur.
- Manual intervention is required.

### 5. Unexpected Plan Expiry

Escalate when:

- The recorded expiration date conflicts with the customer's plan
  information.
- A successful renewal did not prevent expiration.
- Auto-renewal failed despite valid configuration.
- The account shows inconsistent plan status.
- Manual restoration or account correction is required.

### 6. Repeated Recharge Failure

Escalate when:

- A valid payment method repeatedly fails.
- Multiple recharge attempts produce the same unexplained error.
- The account appears restricted.
- Provider-side payment or recharge systems may be malfunctioning.

### 7. Multiple Customers Affected

Escalate for provider-level investigation when multiple similar
complaints occur:

- In the same geographic area
- During a similar time period
- With the same recharge or plan problem

This may indicate a provider-side system problem.

## Geographic and Temporal Analysis

The dataset contains:

- City
- State
- ZIP code
- Date
- Time

These fields can be used to identify clusters of plan/recharge
complaints.

Example:

Multiple customers
      +
Same ZIP code
      +
Same date/time period
      +
Recharge not reflected
      ↓
Potential provider-side issue
      ↓
Human / technical escalation

Geographic concentration alone is not proof of a provider fault.

The system should consider:

- Number of complaints
- Complaint similarity
- Geographic concentration
- Time concentration
- Affected plan/recharge function
- Known provider incidents

before generating a network or platform-level escalation.

## Escalation Priority

### High Priority

Consider high priority when:

- Multiple customers are unable to renew or recharge.
- A widespread provider-side system problem is suspected.
- Customers are losing mobile service because valid renewals are not
  being applied.
- A significant account or payment-system problem affects many
  customers.

### Medium Priority

Consider medium priority when:

- A confirmed payment is missing from the account.
- A valid plan activation has failed.
- A plan change requires manual intervention.
- A customer has repeatedly experienced the same unresolved issue.

### Low Priority

Consider low priority when:

- The issue is isolated.
- No immediate service interruption exists.
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
- Recharge amount, when applicable
- Plan name/identifier, when available
- Mobile line, when available
- Payment status
- Recharge status
- Plan status
- Renewal/expiration status
- Error message, when available
- Previous troubleshooting
- Previous attempts
- AI assessment
- Escalation reason
- Recommended next action

Do not include unnecessary payment credentials.

## AI Escalation Output

The system should generate a structured escalation record.

### Decision

`ESCALATE`

### Category

`Plans / Recharge`

### Subcategory

Example:

`Recharge Not Reflected`

### Priority

`LOW | MEDIUM | HIGH`

### Reason

A concise explanation of why human intervention is required.

### Customer Summary

A short summary of the complaint and relevant transaction details.

### Troubleshooting Completed

List the steps already attempted.

### AI Assessment

State the likely issue without presenting uncertain conclusions as facts.

### Recommended Action

State what the human agent should investigate next.

### Evidence

Include relevant complaint information and knowledge-base references.

## Example Escalation

### Customer Complaint

"I paid for my prepaid renewal this morning. The payment went through,
but my plan expired and I have no data."

### AI Decision

`ESCALATE`

### Priority

`HIGH`

### Reason

Payment appears successful but the plan remains expired and service
benefits are unavailable.

### AI Assessment

Potential failed plan renewal or account activation problem.

### Recommended Action

Verify the payment and renewal transaction, confirm the affected mobile
line, and investigate why the plan was not activated.

## Human Agent Workflow

When a plans/recharge complaint is escalated:

1. Review the AI summary.
2. Review the original complaint.
3. Review the transaction information.
4. Verify the customer account and mobile line.
5. Check payment status.
6. Check recharge/plan transaction status.
7. Check current plan status.
8. Check account balance.
9. Check relevant provider system status.
10. Correct the issue if authorized.
11. Escalate to a billing, account, or technical specialist when
    required.
12. Record the final resolution.

## Human Agent Actions

The human agent may:

- Confirm the recharge.
- Correct an account balance.
- Activate or restore an eligible plan.
- Correct a plan assignment.
- Correct a mobile-line association.
- Investigate a payment.
- Create a billing case.
- Create a technical case.
- Request additional information.
- Mark the ticket as pending.
- Escalate to a specialist.

## AI Limitations

The AI must not:

- Claim a payment succeeded without supporting transaction evidence.
- Claim a recharge succeeded without account evidence.
- Promise plan activation times without authoritative information.
- Guarantee refunds or credits.
- Modify plans without authorization.
- Change mobile lines without authorization.
- Ask customers to repeatedly make payments while a previous payment
  may still be processing.
- Invent provider-specific plan rules.
- Declare a provider-wide outage without supporting evidence.

## Provider-Specific Policies

The generic knowledge base should not contain hard-coded:

- Plan prices
- Recharge amounts
- Expiration periods
- Grace periods
- Activation deadlines
- Data allowances
- Promotional conditions
- Refund policies
- Provider-specific contact information

These should be stored separately as provider-specific policy
documents.

This allows the same AI architecture to support multiple network
providers without rewriting the core knowledge base.

## Agent Guidance

The purpose of escalation is to transfer useful context, not simply to
tell the customer to contact support again.

The human agent should receive:

- What happened
- What transaction occurred
- What was checked
- What was ruled out
- What remains unresolved
- Why escalation occurred
- What action should be investigated next

## Source Basis

This article is a normalized knowledge article based on publicly
available prepaid and wireless support procedures from:

- Verizon Wireless Support
- T-Mobile Wireless Support
- AT&T Wireless Support
- Federal Communications Commission (FCC) consumer guidance

Provider-specific escalation queues, SLAs, prices, plan rules,
processing times, and internal procedures should be maintained
separately as provider-specific policy documents.