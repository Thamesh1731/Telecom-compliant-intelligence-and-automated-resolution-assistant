# PLN-02: Recharge Not Reflected

## Category
Plans / Recharge

## Subcategory
Recharge Completed but Balance or Plan Not Updated

## Problem
The customer reports that a recharge or refill was successfully
submitted or paid for, but the expected balance, plan, or service
benefits have not appeared on the account.

## Common Symptoms

- Customer was charged but recharge balance did not increase
- Recharge confirmation was received but the account still shows the
  old balance
- Plan renewal payment succeeded but the plan has not activated
- Recharge appears in payment history but benefits are missing
- Customer's service remains restricted after a successful recharge
- Recharge amount appears different from the expected amount

## Possible Causes

- Recharge is still processing
- Payment succeeded but recharge has not been posted
- Account balance has not refreshed
- Recharge was applied to a different account or line
- Payment was reversed
- Recharge transaction failed after payment authorization
- Plan renewal is still being processed
- Provider-side system problem
- Account or plan configuration problem

## Initial Diagnosis

Determine:

1. Recharge amount
2. Date and time of recharge
3. Recharge method
4. Payment status
5. Whether the customer received a confirmation
6. Current account balance
7. Current plan status
8. Payment/transaction history
9. Whether the recharge was applied to the correct account or mobile line

## Troubleshooting Procedure

### 1. Check Payment Status

Determine whether the transaction is:

- Pending
- Successful
- Failed
- Reversed

Do not assume that a successful bank transaction means the recharge
has already been applied to the mobile account.

### 2. Check Recharge History

Verify whether the recharge appears in the provider's account or
transaction history.

Check:

- Recharge amount
- Date
- Status
- Associated account/line
- Transaction reference

### 3. Check Current Balance

Compare the customer's current balance with:

- Balance before recharge
- Recharge amount
- Any applicable deductions or plan charges

### 4. Check Plan Status

Determine whether:

- The previous plan is still active.
- The new plan has activated.
- The plan renewal is pending.
- The recharge was added as account balance rather than immediately
  activating a plan.

### 5. Verify the Correct Account or Line

If the customer has multiple lines or accounts, verify that the
recharge was applied to the intended line.

### 6. Check Provider System Status

If multiple customers report successful payments but missing balances
or plan activations, investigate a possible provider-side system issue.

## Diagnosis Guidance

### Payment successful, recharge missing

The payment may have been completed while the recharge transaction is
still processing or has failed to post.

Verify the recharge transaction before requesting another payment.

### Recharge appears in history but balance is unchanged

Possible causes:

- Account balance display delay
- Recharge applied to a plan rather than general balance
- Recharge applied to another account/line
- Provider system issue

### Balance increased but plan did not activate

Check:

- Plan eligibility
- Renewal status
- Activation status
- Whether additional activation conditions apply

Do not assume that every recharge automatically activates a specific
plan.

### Service remains inactive after successful recharge

Check:

- Account balance
- Plan activation status
- Payment status
- Service status
- Known provider issues

If the account remains inactive despite a confirmed successful
recharge, escalate.

## Resolution

If the recharge is still processing, provide the current transaction
status and avoid unnecessary duplicate payments.

If the recharge has been successfully applied, verify that the balance
or plan status is updated correctly.

If the payment succeeded but the recharge remains missing after the
provider's normal processing period, create an investigation or
escalate.

If the recharge was applied to the wrong account or line, route the
issue through the provider's account-correction process.

## Escalation Conditions

Escalate when:

- Payment was successfully processed but the recharge is missing.
- Recharge appears in transaction history but the balance is incorrect.
- The correct account/line cannot be determined.
- Plan activation failed after confirmed payment.
- Service remains restricted despite a confirmed successful recharge.
- The transaction appears completed but account records are inconsistent.
- Multiple customers report similar missing-recharge problems.
- Provider-side system failure is suspected.
- Manual account correction is required.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Recharge amount
- Recharge date and time
- Recharge method
- Payment status
- Recharge transaction status
- Transaction reference
- Account/line involved
- Previous balance, when available
- Current balance
- Current plan status
- Confirmation received
- Previous troubleshooting
- Action taken
- Escalation reason

Do not store unnecessary payment credentials.

## Agent Guidance

Do not tell the customer to recharge again until the original
transaction has been verified.

Duplicate payments can occur when a previous transaction is still
processing.

Do not assume that a payment confirmation and a recharge confirmation
are the same event.

The system should distinguish:

Payment successful
→ Money transaction completed

Recharge successful
→ Account balance or plan entitlement updated

These events may occur at different stages.

## Example Scenarios

### Scenario 1: Payment Successful, Balance Missing

Customer:
"I paid $50 for my prepaid account, but my balance hasn't changed."

Action:

1. Check payment status.
2. Check recharge transaction.
3. Check account balance.
4. Verify the intended mobile line.
5. Escalate if the payment is confirmed but the recharge remains
   missing after the applicable processing period.

### Scenario 2: Recharge Confirmation Received

Customer:
"I received a recharge confirmation but my plan still hasn't started."

Action:

1. Verify the recharge.
2. Check plan activation status.
3. Determine whether the recharge was added as balance or used for
   renewal.
4. Escalate if activation requires carrier-side intervention.

### Scenario 3: Multiple Customers Affected

Several customers report:

"My recharge went through, but none of us received our prepaid
benefits."

Action:

Treat the pattern as a potential provider-side system issue and
escalate for investigation.

## Source Basis

This article is a normalized knowledge article based on publicly
available prepaid support documentation from:

- Verizon Prepaid Support
- T-Mobile Prepaid Support
- AT&T Prepaid Support

Provider-specific processing times, plan rules, prices, and payment
methods have been excluded so that this article remains
provider-neutral.   