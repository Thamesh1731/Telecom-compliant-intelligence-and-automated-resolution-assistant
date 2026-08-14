# AS-02: Subscription Changes

## Category

account_subscription

## Subcategory

Subscription Changes

## Problem

The customer wants to modify an existing telecom subscription, including changing the subscription type, adding or removing subscribed services, or requesting a different subscription configuration.

The request concerns a change to the customer's existing subscription rather than a technical fault.

## Example Customer Complaints

- "I want to change my subscription."
- "Can I upgrade my subscription?"
- "I want to downgrade my subscription."
- "I want to change the services included in my subscription."
- "Can I add another service to my subscription?"
- "I want to remove a service from my subscription."
- "I selected the wrong subscription and want to change it."
- "How can I change my current subscription?"

## AI Assessment

SUBSCRIPTION CHANGE REQUEST

The customer is requesting a modification to an existing subscription.

## Recommended Human Action

Identify the exact change requested and verify the customer's account.

Check:

- Current subscription.
- Requested subscription.
- Requested effective date.
- Services being added or removed.
- Eligibility for the requested subscription.
- Any applicable account restrictions.
- Whether the change is immediate or scheduled.
- Whether the request affects billing or other services.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Confirm the current subscription.
3. Clarify the requested change.
4. Check eligibility and applicable conditions.
5. Explain any relevant effects of the change.
6. Process the change through the authorized system or route it to the appropriate team.
7. Confirm the resulting subscription status.

## Routing

Route to `plans_recharge` when the request specifically concerns:

- Mobile plan selection.
- Data allowance.
- Voice or SMS allowance.
- Recharge.
- Plan validity.

Route to `billing` when the primary issue concerns:

- Charges caused by a subscription change.
- Payment for a subscription.
- Refunds or disputed fees.

Keep the request under `account_subscription` when the customer is primarily requesting a change to the subscription itself.

## Escalation

Escalate when:

- The requested subscription change cannot be processed.
- Eligibility cannot be determined.
- The account contains conflicting subscription information.
- The requested change requires specialist authorization.
- A previous subscription change was incorrectly applied.
- The customer reports that the requested change did not take effect.

## Important Notes

Do not promise that a requested subscription change will be approved before eligibility is verified.

Do not provide unsupported pricing, fees, or effective dates.

Do not make changes to a customer's subscription without the required authorization and verification.

## Source Basis

This knowledge article is based on standardized telecom customer-support workflows for handling subscription modification requests, verifying customer authorization, checking eligibility, processing subscription changes, routing plan-related requests, and escalating changes that require specialist intervention.