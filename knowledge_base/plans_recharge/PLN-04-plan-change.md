# PLN-04: Mobile Plan Change

## Category
Plans / Recharge

## Subcategory
Plan Change

## Problem
The customer wants to change their current mobile plan or reports that
an attempted plan change did not produce the expected result.

## Common Scenarios

- Customer wants to upgrade their plan
- Customer wants to downgrade their plan
- Customer wants to switch to another plan
- Customer wants to change included data or calling benefits
- Customer wants to add or remove plan features
- Customer attempted to change plans but the change did not complete
- Customer reports that the wrong plan was activated
- Customer wants to change a plan on one of multiple lines

## Possible Causes of a Failed Plan Change

- Plan is not eligible for the requested change
- Account restriction
- Plan change is still processing
- Incorrect mobile line selected
- Required payment was unsuccessful
- Existing plan has a transition rule
- Requested plan is unavailable
- Provider system problem
- Plan-specific eligibility condition
- Account requires manual intervention

## Initial Diagnosis

Determine:

1. Current plan.
2. Requested plan.
3. Mobile line to be changed.
4. Whether the account has multiple lines.
5. Whether the customer has already submitted the change.
6. Whether payment is required.
7. Whether payment was successful.
8. Current plan status.
9. Requested plan status.
10. Whether the provider allows the requested change under the current
    plan and account conditions.

## Troubleshooting Procedure

### 1. Identify the Requested Change

Determine whether the customer wants to:

- Upgrade
- Downgrade
- Switch plans
- Add a feature
- Remove a feature
- Change the plan on a specific line

Do not assume the customer's desired plan based only on the complaint.

### 2. Check Current Plan

Verify:

- Current plan
- Current status
- Associated mobile line
- Current benefits
- Current renewal status

### 3. Check Plan Eligibility

Determine whether the requested plan is available for the customer's
account and mobile line.

Eligibility may depend on provider-specific rules.

### 4. Check Payment Requirements

If the plan change requires payment:

- Verify whether payment is required.
- Check whether the payment succeeded.
- Check whether the payment is pending or failed.

Do not treat a failed payment as a plan-change failure without checking
the payment status.

### 5. Check Change Status

If the customer has already requested the change, determine whether it
is:

- Not submitted
- Pending
- Completed
- Failed
- Cancelled

### 6. Check Correct Mobile Line

For customers with multiple lines, verify that the requested plan
change applies to the intended line.

### 7. Check Effective Date

Some plan changes may take effect immediately while others may take
effect during a future billing or renewal period.

Use provider-specific policy information when available.

Do not invent an effective date.

## Diagnosis Guidance

### Customer wants to change plans but has not submitted a request

This is a plan-selection or plan-information request.

Provide available plan-change information according to the provider's
current plan catalog and eligibility rules.

### Customer submitted a change but it is pending

Check the change status and applicable provider process.

Do not submit a duplicate change request unless the provider's process
requires it.

### Customer paid for a plan change but the old plan remains active

Check:

- Payment status
- Plan-change transaction
- Requested plan
- Effective date
- Account status

If the change should already have taken effect but has not, escalate.

### Wrong plan was activated

Verify the transaction and affected mobile line.

Do not make another plan purchase simply to correct the problem.

Route the issue through the appropriate account or plan-correction
process.

### Customer wants to downgrade

Check the provider's current eligibility and effective-date rules.

Do not promise that unused benefits or payments will be refunded unless
the applicable policy confirms eligibility.

## Resolution

If the requested plan change is eligible and the customer has not yet
submitted it, guide them through the provider's supported plan-change
process.

If the change has been successfully completed, confirm the new plan
status.

If the change is pending, provide the current status and applicable
process information.

If the change failed because of a payment problem, route the payment
issue through the appropriate payment workflow.

If the requested change requires manual account intervention, escalate.

## Escalation Conditions

Escalate when:

- A valid plan change cannot be completed.
- The requested plan appears eligible but the system rejects the
  change.
- The wrong plan was activated.
- The plan change is stuck in a pending state beyond the applicable
  processing period.
- Payment succeeded but the requested plan change did not occur.
- The correct mobile line cannot be determined.
- Account-level correction is required.
- The provider system appears to be malfunctioning.
- Multiple customers report the same plan-change problem.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Current plan
- Requested plan
- Mobile line
- Plan-change status
- Payment status, when applicable
- Requested date
- Effective date, when available
- Error message
- Account conditions relevant to the change
- Previous attempts
- Action taken
- Escalation reason

Do not store unnecessary payment credentials.

## Agent Guidance

Do not assume that a plan upgrade or downgrade takes effect
immediately.

Do not promise:

- A specific effective date
- A specific price
- A refund
- Retention of existing promotional benefits

unless the provider's current policy confirms it.

Do not submit duplicate plan changes when an earlier request is still
pending.

Keep provider-specific plan names, prices, eligibility rules,
promotions, and effective-date policies in separate provider-specific
policy documents.

## Example Scenarios

### Scenario 1: Customer Wants an Upgrade

Customer:

"I want to move to a plan with more data."

Action:

1. Identify the current plan.
2. Identify the requested plan or required benefits.
3. Check eligibility.
4. Provide the supported plan-change process.

### Scenario 2: Plan Change Pending

Customer:

"I changed my plan yesterday but it still shows my old plan."

Action:

1. Check plan-change transaction.
2. Check status.
3. Check effective date.
4. Escalate if the change should already be active but remains
   unresolved.

### Scenario 3: Payment Succeeded but Plan Did Not Change

Customer:

"I paid for the new plan but I'm still on the old one."

Action:

1. Verify payment.
2. Verify plan-change transaction.
3. Verify mobile line.
4. Check effective date.
5. Escalate if activation should have occurred.

### Scenario 4: Wrong Line Changed

Customer:

"I changed my plan but it changed my other number."

Action:

Verify the affected line and transaction, then escalate for account
correction.

## Source Basis

This article is a normalized knowledge article based on publicly
available plan-management and prepaid support documentation from:

- Verizon Wireless Support
- T-Mobile Wireless Support
- AT&T Wireless Support

Provider-specific plan names, pricing, promotional conditions,
eligibility rules, and effective dates have been excluded so that this
article remains provider-neutral.