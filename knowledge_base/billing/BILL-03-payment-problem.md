# BILL-03: Payment Problem

## Category
Billing

## Subcategory
Payment

## Problem
The customer reports that a bill payment failed, was not reflected
on their account, was applied incorrectly, or was processed differently
than expected.

## Common Symptoms

- Payment was declined
- Payment was submitted but does not appear on the account
- Payment amount appears incorrect
- AutoPay did not process as expected
- Payment was deducted from the customer's bank account but the
  telecom account still shows an unpaid balance
- Customer made a payment but received a payment-due notification
- Payment was applied to the wrong account or billing period
- Customer is concerned that a failed payment may cause service
  interruption

## Possible Causes

- Payment method declined
- Insufficient funds
- Incorrect payment information
- Bank or card authorization failure
- AutoPay configuration problem
- Payment processing delay
- Payment submitted to a different account
- Payment has cleared the bank but has not yet posted to the provider
  account
- Payment processing error
- Payment was not successfully submitted

## Initial Diagnosis

Determine:

1. Payment amount
2. Date and time of payment
3. Payment method
4. Whether the payment was successfully submitted
5. Whether the customer's bank or card shows the transaction
6. Whether the payment appears in the provider's payment history
7. Whether the payment was made through AutoPay, online payment,
   bank bill pay, check, or another method

## Troubleshooting Procedure

### Step 1: Check Payment Status

Check the provider account's payment history or transaction history.

Determine whether the payment is:

- Pending
- Posted
- Failed
- Reversed
- Missing

Do not assume that a payment failed simply because it is not immediately
visible on the account.

### Step 2: Check the Payment Method

If the payment failed, verify that:

- The payment method is valid.
- The required account or card information is correct.
- The payment method has not expired.
- The customer's bank or card issuer did not decline the transaction.

### Step 3: Check the Bank or Card Account

If the customer says money was deducted, determine whether the
transaction actually cleared.

Record:

- Transaction date
- Amount
- Payment reference or trace information, when available
- Payment method

A pending authorization is not necessarily the same as a completed
payment.

### Step 4: Check for Payment Posting Delay

If the payment was successfully processed but is not visible on the
telecom account, allow the provider's normal posting period to pass.

Do not request another payment immediately if the original payment may
still be processing, because this could result in duplicate payment.

### Step 5: Check Other Accounts

If the payment is missing, verify whether it was accidentally submitted
to another account belonging to the customer.

### Step 6: AutoPay Problems

If AutoPay did not process correctly, check:

- AutoPay enrollment status
- Scheduled payment date
- Payment method
- Payment method validity
- Whether the payment was declined
- Whether another payment was already made manually

## Resolution

### Payment Failed

If the payment genuinely failed, guide the customer toward an available
valid payment method according to the provider's payment procedures.

### Payment Was Submitted but Has Not Posted

Verify the payment status and allow the normal processing period when
appropriate.

If the payment cleared but remains missing after the applicable
processing period, create a payment investigation or billing case.

### Payment Was Incorrect

If the payment amount was incorrect or was applied incorrectly, submit
the appropriate billing correction request.

### AutoPay Problem

Correct the AutoPay configuration or route the issue for manual review
when the problem cannot be resolved automatically.

## Escalation Conditions

Escalate when:

- The customer's payment has cleared but is not reflected on the
  account after the normal processing period.
- The payment cannot be located using available account information.
- The payment appears to have been applied incorrectly.
- The customer was charged but the payment remains missing.
- A payment was duplicated.
- AutoPay repeatedly fails despite valid payment information.
- A payment correction requires manual account investigation.
- The issue could result in inappropriate service suspension or a
  disputed balance.

## Agent Information to Record

Record:

- Ticket ID
- Payment amount
- Payment date
- Payment method
- Payment status
- Account number
- Payment reference or trace information, when available
- Whether the customer's bank/card shows the transaction
- Whether the provider account shows the payment
- Previous payment attempts
- Action taken

## Agent Guidance

Do not ask the customer to make another payment immediately when the
original payment may still be processing.

First determine whether the original transaction was:

- Never submitted
- Declined
- Pending
- Successfully processed
- Successfully processed but not posted

Do not assume that a payment showing as a bank transaction means the
provider has received and posted the payment.

Do not promise that a payment will be credited by a specific time unless
that timeframe is supported by the provider's current policy.

## Source Basis

This article is a normalized knowledge article based on publicly
available information from:

- Federal Communications Commission consumer complaint guidance
- AT&T public payment support documentation
- Public US telecom billing and payment guidance

Provider-specific payment deadlines, contact information, and payment
methods have been excluded so that this article can be used by a
provider-neutral telecom complaint assistant.