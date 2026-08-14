# AS-03: Subscription Cancellation and Termination

## Category

account_subscription

## Subcategory

Subscription Cancellation and Termination

## Problem

The customer wants to cancel, terminate, or stop an existing telecom subscription or asks what happens when a subscription is cancelled.

The request may involve immediate cancellation, scheduled termination, or clarification of the cancellation process.

## Example Customer Complaints

- "I want to cancel my subscription."
- "How do I cancel my subscription?"
- "Please terminate my subscription."
- "I don't want this subscription anymore."
- "I want to stop my current subscription."
- "Can I cancel my subscription today?"
- "What happens if I cancel my subscription?"
- "I want to terminate this service."

## AI Assessment

SUBSCRIPTION CANCELLATION REQUEST

The customer is requesting cancellation or termination of an existing subscription.

## Recommended Human Action

Verify the customer's identity and confirm the exact subscription the customer wants to cancel.

Check:

- Current subscription status.
- Subscription or service being cancelled.
- Whether cancellation is available.
- Applicable cancellation conditions.
- Effective date of cancellation.
- Any remaining service period.
- Any pending subscription changes.
- Whether the request affects associated services.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Identify the exact subscription or service.
3. Confirm that the customer intends to cancel it.
4. Explain the applicable cancellation process.
5. Explain any relevant effects of cancellation.
6. Process the cancellation through the authorized system or route it appropriately.
7. Confirm the resulting subscription status.

## Billing Considerations

If cancellation results in a billing question, route the billing-specific issue to `billing`.

Examples include:

- Final charges.
- Refund requests.
- Disputed cancellation charges.
- Payment already made for a cancelled service.

Do not invent cancellation fees, refund amounts, or billing dates.

## Routing

Route to `plans_recharge` when the customer is actually asking to stop or change a mobile plan rather than a broader subscription.

Keep the request under `account_subscription` when the customer is specifically requesting subscription termination.

## Escalation

Escalate when:

- Cancellation cannot be processed through the standard procedure.
- The subscription status is inconsistent.
- The customer reports that a previous cancellation request was ignored.
- The cancellation requires specialist authorization.
- The customer disputes the cancellation status.
- Associated services require separate investigation.

## Important Notes

Do not cancel a subscription without the required customer authorization and verification.

Do not assume that cancellation immediately terminates every associated service.

Do not promise refunds, fee waivers, or specific termination dates unless confirmed by the applicable provider system or policy.

## Source Basis

This knowledge article is based on standardized telecom customer-support workflows for handling subscription cancellation and termination requests, verifying customer authorization, confirming affected services, processing termination requests, routing billing-related issues, and escalating cancellation discrepancies.