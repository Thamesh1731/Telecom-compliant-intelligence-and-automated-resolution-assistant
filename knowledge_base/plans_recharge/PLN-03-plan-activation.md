# PLN-03: Plan Activation Problem

## Category
Plans / Recharge

## Subcategory
Plan Activation

## Problem
The customer reports that a mobile plan was purchased, renewed, or
recharged successfully, but the expected plan or service benefits have
not become active.

## Common Symptoms

- Plan purchase completed but plan is not active
- Recharge completed but plan benefits are unavailable
- Renewal payment succeeded but the previous plan remains active
- Customer cannot use expected voice benefits
- Customer cannot use expected SMS benefits
- Customer cannot use expected mobile data benefits
- Plan shows as pending
- Plan activation appears delayed
- Customer received confirmation but the account still shows the
  previous plan
- Service remains restricted after successful plan purchase

## Possible Causes

- Plan activation is still processing
- Recharge was added as account balance instead of activating the
  intended plan
- Plan activation failed after successful payment
- Wrong plan or mobile line was selected
- Account or service configuration problem
- Plan eligibility requirement was not satisfied
- Provider-side activation problem
- Previous plan has not expired or transitioned
- Payment was successful but the plan transaction was not completed
- Account system has not updated correctly

## Initial Diagnosis

Determine:

1. Which plan the customer intended to activate.
2. Whether payment or recharge was successful.
3. Whether the plan appears in the customer's account.
4. Whether the plan status is active, pending, expired, or unavailable.
5. Which mobile line received the plan.
6. Whether the expected benefits are available.
7. Whether the previous plan is still active.
8. Whether the provider reports a current activation or account-system
   issue.

## Troubleshooting Procedure

### 1. Verify the Plan Purchase

Check the account or transaction history.

Confirm:

- Plan name or plan identifier
- Purchase date
- Purchase amount
- Transaction status
- Associated mobile line
- Activation status

### 2. Check Payment Status

Determine whether the payment is:

- Pending
- Successful
- Failed
- Reversed

A successful payment does not necessarily mean that the plan has
already been activated.

### 3. Check Plan Status

Determine whether the plan is:

- Active
- Pending
- Scheduled
- Expired
- Cancelled
- Not present

### 4. Check the Correct Mobile Line

If the customer has multiple lines, verify that the plan was purchased
for the intended line.

Do not assume that a successful purchase was applied to the line the
customer intended.

### 5. Check Available Benefits

Determine which benefits are missing:

- Voice
- SMS
- Mobile data
- Other plan-specific benefits

If only one benefit is unavailable, investigate that service separately
rather than treating the entire plan as inactive.

### 6. Check Previous Plan

Determine whether the customer's previous plan:

- Is still active
- Has expired
- Is scheduled to expire
- Has been replaced
- Has transitioned to the new plan

Plan transition rules are provider-specific.

### 7. Refresh or Reconnect Service

When appropriate:

1. Restart the device.
2. Allow the device to reconnect to the mobile network.
3. Check the account/plan status again.
4. Test the affected service.

Do not repeatedly restart the device if the provider system clearly
shows that the plan itself is not active.

### 8. Check Provider System Status

If multiple customers report that newly purchased plans are not
activating, investigate a possible provider-side activation issue.

## Diagnosis Guidance

### Payment successful but plan is not visible

Possible causes:

- Plan transaction still processing
- Account system delay
- Plan applied to another line
- Activation failure

Verify the transaction before requesting another purchase.

### Plan is visible but status is pending

The activation may still be processing.

Check the provider's current activation status and applicable process.

### Plan is active but one benefit is unavailable

Investigate the specific service:

- Voice
- SMS
- Mobile data

Do not deactivate or repurchase the entire plan unnecessarily.

### Previous plan is still active

The new plan may be scheduled to activate after the current plan ends,
depending on the provider's plan rules.

Do not assume that simultaneous activation is required.

### Multiple customers have the same activation problem

A provider-side system issue may be involved.

Escalate the pattern rather than handling every complaint as an
independent customer problem.

## Resolution

If the plan is active and the expected benefits are available, confirm
successful activation with the customer.

If the plan is pending, provide the current status and follow the
provider's applicable activation process.

If the plan was purchased for the wrong line, follow the provider's
account-correction process.

If payment succeeded but activation failed, create an appropriate
investigation or escalate for manual intervention.

If a provider-side activation issue is confirmed, provide the available
status information.

## Escalation Conditions

Escalate when:

- Payment was successful but the plan remains inactive.
- Plan status is inconsistent with the transaction history.
- Plan activation remains pending beyond the provider's applicable
  processing period.
- The plan was applied incorrectly.
- A required account correction is necessary.
- The customer remains without expected service after successful plan
  activation.
- Multiple customers experience similar activation failures.
- A provider-side activation or account-system problem is suspected.
- Manual plan activation or correction is required.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Plan name/identifier
- Purchase amount
- Purchase date and time
- Payment status
- Plan status
- Associated mobile line
- Previous plan status
- Missing benefits
- Transaction/reference information
- Error message, when available
- Troubleshooting completed
- Provider system status
- Action taken
- Escalation reason

Do not store unnecessary payment credentials.

## Agent Guidance

Do not assume that successful payment means successful plan activation.

Treat these as separate states:

Payment successful
→ Financial transaction completed

Plan purchase successful
→ Plan transaction accepted

Plan active
→ Customer's account has the intended plan entitlement

Benefits available
→ Customer can actually use the included services

These states may not occur simultaneously.

Do not tell the customer to purchase the plan again until the original
transaction has been verified.

Do not promise a specific activation time unless the provider's current
policy confirms it.

Provider-specific activation rules, plan names, eligibility
requirements, and processing times should be maintained separately as
provider-specific policy documents.

## Example Scenarios

### Scenario 1: Payment Successful, Plan Missing

Customer:

"I paid for my new plan, but my account still shows my old plan."

Action:

1. Verify payment.
2. Verify plan transaction.
3. Check plan status.
4. Verify the mobile line.
5. Escalate if the plan purchase is confirmed but activation has not
   completed.

### Scenario 2: Plan Active, Data Not Working

Customer:

"My new plan is active, but I can't use mobile data."

Action:

Do not treat this as a plan-activation failure.

Route the complaint to the mobile-data troubleshooting workflow.

### Scenario 3: Plan Pending

Customer:

"My new plan says pending."

Action:

1. Verify payment.
2. Check transaction status.
3. Check provider activation status.
4. Follow the applicable activation process.
5. Escalate if activation remains unresolved.

### Scenario 4: Wrong Line

Customer:

"I bought the plan, but it was added to my other number."

Action:

Verify the transaction and affected line, then escalate through the
account-correction process.

## Source Basis

This article is a normalized knowledge article based on publicly
available prepaid and wireless support documentation from:

- Verizon Prepaid Support
- T-Mobile Prepaid Support
- AT&T Prepaid Support

Provider-specific plan names, activation periods, eligibility rules,
pricing, and service conditions have been excluded so that this
article remains provider-neutral.