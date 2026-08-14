# PLN-01: Recharge or Refill Failed

## Category
Plans / Recharge

## Subcategory
Recharge Failure

## Problem
The customer attempted to add funds or renew a prepaid mobile plan,
but the recharge/refill was unsuccessful or the payment could not be
completed.

## Common Symptoms

- Recharge fails
- Refill is declined
- Payment cannot be completed
- Recharge shows an error
- AutoPay or Auto Refill does not complete
- Refill card or PIN cannot be redeemed
- Customer cannot add sufficient funds to renew the plan
- Payment method is rejected
- Customer receives an error while attempting to recharge

## Possible Causes

- Invalid or expired payment method
- Payment method declined
- Insufficient funds
- Incorrect payment information
- Payment processing problem
- Provider system issue
- AutoPay or Auto Refill configuration problem
- Invalid or already-used refill card/PIN
- Account restriction
- Recharge amount does not meet the plan's requirements
- Temporary provider-side issue

## Initial Diagnosis

Determine:

1. Whether the customer is using a prepaid service.
2. Whether the recharge was attempted through an online account,
   mobile application, refill card, phone system, or another method.
3. The attempted recharge amount.
4. Whether an error message was displayed.
5. Whether the payment method was charged or declined.
6. Whether the account balance changed.
7. Whether the plan renewal date has passed.
8. Whether AutoPay or Auto Refill was being used.
9. Whether the provider reports a current payment-system problem.

## Troubleshooting Procedure

### 1. Check Payment Method

Verify that the selected payment method is valid.

Check for:

- Expired card
- Incorrect payment information
- Declined transaction
- Insufficient funds
- Unsupported payment method

Do not request or store full payment credentials in the complaint
record.

### 2. Check Account Balance

Check the current prepaid account balance.

Determine whether the available balance is sufficient for the intended
plan renewal or recharge.

### 3. Check Payment History

Review the account's payment or transaction history.

Determine whether the attempted recharge is:

- Not submitted
- Failed
- Pending
- Successful
- Reversed

Do not treat an absent balance update as proof that the payment failed.

### 4. Retry Using an Approved Method

If the payment genuinely failed, the customer may retry using another
valid payment method supported by the provider.

Do not repeatedly retry a transaction when the original payment may
still be processing.

### 5. Check AutoPay / Auto Refill

If the customer uses automatic payments:

- Verify that AutoPay or Auto Refill is enabled.
- Check the configured payment method.
- Check whether the payment method is valid.
- Check whether the scheduled payment was attempted.
- Check whether the payment was declined.
- Check whether the account has sufficient funds.

### 6. Check Refill Card or PIN

If a refill card or PIN was used:

- Verify that the correct code was entered.
- Verify that the refill method is supported by the provider.
- Check whether the refill was already redeemed.
- Check whether the provider reports an issue with the refill code.

Do not assume a refill card is invalid solely because the balance has
not updated immediately.

### 7. Check Provider System Status

If multiple customers are experiencing payment or recharge failures,
check whether the provider reports a system or payment-service issue.

## Diagnosis Guidance

### Payment was declined

Possible causes:

- Payment method problem
- Bank/card authorization failure
- Invalid payment information
- Insufficient funds

The customer should use a valid supported payment method according to
the provider's procedure.

### Payment succeeded but balance did not update

Do not classify this as a simple failed recharge.

Check:

- Payment confirmation
- Payment history
- Account balance
- Payment processing status

If the payment was successfully processed but the recharge remains
missing, use the appropriate payment/recharge investigation workflow.

### AutoPay failed

Check:

- AutoPay enrollment
- Payment method
- Scheduled payment
- Account balance
- Provider system status

If AutoPay repeatedly fails despite valid configuration, escalate.

### Refill card/PIN failed

Check:

- Code entered correctly
- Card/PIN validity
- Whether it has already been redeemed
- Whether the provider supports the refill method

If the problem cannot be resolved through available information,
escalate.

### Multiple customers cannot recharge

A provider-side payment-system problem may be involved.

This should be investigated separately from an individual customer's
payment-method problem.

## Resolution

If the payment method was invalid or declined, guide the customer toward
an available supported payment method.

If AutoPay or Auto Refill configuration is incorrect, correct it when
the applicable system permits the action.

If a refill card/PIN is valid and supported, complete the refill
according to the provider's procedure.

If a provider-side payment problem is confirmed, provide the available
status information and avoid unnecessary repeated payment attempts.

If the recharge remains unresolved after standard troubleshooting,
escalate for investigation.

## Escalation Conditions

Escalate when:

- A valid payment was processed but the recharge did not occur.
- The account balance is inconsistent with the payment history.
- A recharge repeatedly fails despite a valid payment method.
- AutoPay or Auto Refill repeatedly fails.
- A valid refill card/PIN cannot be redeemed.
- A provider-side payment-system issue is suspected.
- The account has a restriction preventing recharge.
- The customer may lose service because the recharge cannot be
  completed.
- Manual investigation is required.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Recharge amount
- Date and time of attempt
- Recharge method
- Payment status
- Account balance
- Plan renewal status
- AutoPay/Auto Refill status
- Error message, if available
- Refill card/PIN status, when applicable
- Previous recharge attempts
- Provider system status
- Action taken
- Escalation reason

Do not store:

- Full credit/debit card numbers
- Banking passwords
- Payment PINs
- Other unnecessary financial credentials

## Agent Guidance

Do not assume that a failed recharge means the customer's bank
transaction failed.

First determine whether the payment was:

- Never submitted
- Declined
- Pending
- Successfully processed
- Reversed

Do not tell the customer to make repeated payments when the original
transaction may still be processing.

Do not promise that a recharge will be completed within a specific
time unless the provider's current policy confirms the timeframe.

Provider-specific recharge amounts, payment limits, expiration periods,
and supported payment methods should be maintained in provider-specific
policy documents.

## Example Scenarios

### Scenario 1: Card Declined

Customer:
"My prepaid recharge keeps getting declined."

Action:

1. Check payment status.
2. Verify the payment method.
3. Check for a provider payment-system issue.
4. Guide the customer to an available supported payment method.

### Scenario 2: Money Was Deducted

Customer:
"The money was taken from my bank account but my prepaid balance
didn't increase."

Action:

1. Do not immediately request another payment.
2. Check payment confirmation.
3. Check payment history.
4. Check account balance.
5. Determine whether the transaction is pending or completed.
6. Escalate if the completed payment is missing from the account.

### Scenario 3: AutoPay Failed

Customer:
"My plan did not renew even though AutoPay is enabled."

Action:

1. Check AutoPay status.
2. Check the configured payment method.
3. Check payment history.
4. Determine whether the scheduled payment failed.
5. Resolve configuration problems or escalate if carrier-side
   investigation is required.

## Source Basis

This article is a normalized knowledge article based on publicly
available prepaid support documentation from:

- Verizon Prepaid Support
- T-Mobile Prepaid Support
- AT&T Prepaid Support

Provider-specific prices, payment limits, plan names, payment deadlines,
and contact information have been excluded so that this article remains
provider-neutral.