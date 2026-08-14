
# BILL-06: Billing Escalation

## Category
Billing

## Subcategory
Escalation

## Purpose
This article defines when a billing complaint should be transferred from
automated support to a human agent or specialized billing team.

The AI should attempt routine explanation and guidance when sufficient
information is available. It should escalate when the issue requires
account investigation, authorization, manual correction, or a decision
that the AI cannot safely make.

## When AI Can Handle the Complaint

The AI may provide an automated response when:

- The billing issue can be explained using available account information.
- The customer is asking for an explanation of a known charge.
- A payment status is available and clearly indicates its current state.
- A known credit or adjustment is already visible on the account.
- The customer is asking about general billing procedures.
- The required action does not require human authorization.
- The available knowledge base contains sufficient information to answer
  the question.

## When Human Escalation Is Required

Escalate the complaint when:

### 1. Billing Information Is Inconsistent

- Account records conflict with the customer's bill.
- The charge cannot be explained using available information.
- The account contains conflicting payment or credit information.

### 2. Manual Correction Is Required

- A billing error requires a manual adjustment.
- A credit must be manually applied.
- A refund requires manual approval.
- A payment must be manually located or corrected.
- The account balance appears incorrect.

### 3. Customer Formally Disputes a Charge

Escalate when the customer continues to dispute a charge after the
available billing information has been explained.

Record the disputed amount, billing period, charge description, and
customer's requested resolution.

### 4. Unauthorized Activity Is Suspected

Escalate when:

- A charge cannot be associated with an authorized account action.
- The customer reports unauthorized account activity.
- The customer reports an account or service change they did not
  authorize.
- Fraud is suspected.

Do not make a final fraud determination automatically.

### 5. Repeated Unresolved Complaint

Escalate when:

- The customer has previously contacted support about the same issue.
- The previous resolution did not solve the problem.
- A promised credit, refund, or correction was not completed.
- The customer repeatedly reports the same billing problem.

### 6. High-Impact Billing Issue

Consider higher priority when:

- A large disputed amount is involved.
- Multiple billing periods are affected.
- Service suspension may result from a disputed balance.
- Multiple customers appear to be affected by the same billing problem.
- A systemic billing error is suspected.

## Escalation Priority

### High Priority

Use high priority when:

- Fraud or unauthorized account activity is suspected.
- Service disruption may result from an unresolved billing error.
- A significant or repeated billing problem affects the customer.
- A systemic billing problem may affect multiple customers.

### Medium Priority

Use medium priority when:

- Manual billing investigation is required.
- A refund or credit is delayed.
- A formal billing dispute remains unresolved.
- Account records require specialist review.

### Low Priority

Use low priority when:

- The issue is non-urgent.
- The customer requests clarification that cannot be completed
  automatically but does not involve immediate service impact.
- Additional documentation is required before investigation.

Priority should ultimately follow the provider's applicable policies and
service-level requirements.

## Information Required Before Escalation

The AI or first-level agent should provide the next agent with:

- Ticket ID
- Customer complaint
- Billing period
- Disputed amount
- Charge description
- Payment information relevant to the issue
- Previous interactions
- Previous ticket references
- Credits or refunds involved
- Customer's requested resolution
- AI summary
- Reason for escalation

Do not include unnecessary sensitive financial credentials.

## AI Escalation Output

When escalation is triggered, the system should produce:

### Escalation Decision

`ESCALATE`

### Priority

`LOW | MEDIUM | HIGH`

### Reason

A concise explanation of why human intervention is required.

### Summary

A short description of the customer's issue and relevant account
context.

### Recommended Action

The next action the human agent should investigate.

### Evidence

Relevant billing information and knowledge-base sources used by the AI.

## Example

Customer complaint:

"My bill has been wrong for three months. I already contacted support
twice and was told I would receive a credit, but nothing has changed."

AI output:

Priority:
HIGH

Decision:
ESCALATE

Reason:
Repeated unresolved billing dispute and missing promised credit.

Summary:
Customer reports an unresolved billing discrepancy spanning three
billing periods. Previous support interactions reportedly promised a
credit that has not appeared.

Recommended Action:
Review previous support cases, verify the disputed charges and promised
credit, and determine whether a manual billing adjustment is required.

## Human Agent Workflow

When an escalated billing complaint reaches a human agent:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Review the disputed billing information.
4. Review previous support interactions.
5. Verify the relevant account and billing records.
6. Determine whether the issue can be resolved.
7. Apply or request the appropriate correction when authorized.
8. Request additional information if necessary.
9. Escalate to a billing specialist when required.
10. Record the final action and resolution.

## Agent Actions

The human agent may:

- Resolve the complaint.
- Apply an authorized correction.
- Request additional information.
- Create a billing investigation.
- Escalate to a billing specialist.
- Mark the ticket as pending when customer information is required.

## Regulatory Escalation

If the provider's internal complaint process does not resolve the issue,
the customer may have external complaint options.

For US telecommunications billing or service complaints, the FCC
encourages consumers to contact their provider first. The FCC may serve
a qualifying complaint on the provider, after which the provider has up
to 30 days to respond. The FCC does not resolve every individual
complaint and may refer some matters to other agencies. 

The AI should not automatically instruct customers to file an FCC
complaint. External escalation is a later option after the applicable
provider process has been attempted.

## Agent Guidance

Do not:

- Promise a refund without verifying eligibility.
- Promise a credit without authorization.
- Declare a charge fraudulent without appropriate evidence.
- Invent dispute deadlines.
- Invent refund processing times.
- Expose sensitive financial information.
- Repeatedly give the same automated troubleshooting response after the
  customer has already completed it.

The purpose of escalation is to transfer the complete context to a
human, not simply to tell the customer to contact support again.

## Source Basis

This article is a normalized knowledge article based on publicly
available information from:

- Federal Communications Commission (FCC) Consumer Complaint Center
- Public US telecom billing dispute procedures
- Public US telecom customer-support documentation

Provider-specific escalation levels, deadlines, contact information,
and legal procedures should be maintained separately as
provider-specific policy documents.