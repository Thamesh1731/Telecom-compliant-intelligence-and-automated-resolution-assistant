# AS-01: Subscription Status and Details

## Category

account_subscription

## Subcategory

Subscription Status and Details

## Problem

The customer wants information about the status, details, or current state of their telecom subscription.

The request may involve understanding whether a subscription is active, checking subscription details, confirming included services, or clarifying the current subscription associated with the customer's account.

## Example Customer Complaints

- "Is my subscription still active?"
- "What subscription am I currently on?"
- "Can you tell me my subscription details?"
- "I want to know the status of my subscription."
- "What services are included in my subscription?"
- "When does my subscription expire?"
- "Why does my account show a different subscription?"
- "I don't understand which subscription I have."

## AI Assessment

SUBSCRIPTION STATUS OR INFORMATION REQUEST

The customer is requesting information about an existing subscription rather than reporting a specific technical fault.

## Recommended Human Action

Verify the customer's account and determine the current subscription status.

Check:

- Active or inactive subscription status.
- Subscription name or type.
- Subscription start date where applicable.
- Subscription renewal or expiry information.
- Services included in the subscription.
- Associated mobile or telecom services.
- Any pending subscription changes.
- Current subscription state in the provider system.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Identify the subscription associated with the account.
3. Confirm the current subscription status.
4. Explain the relevant subscription details.
5. Clarify any pending changes or renewal information.
6. Route the request to a specialized category if the issue concerns billing, plan changes, cancellation, or another service.

## Routing

Route to `plans_recharge` when the customer wants to:

- Change a mobile plan.
- Purchase a new plan.
- Recharge a service.
- Change data or voice allowances.

Route to `billing` when the customer is asking about:

- Subscription charges.
- Unexpected fees.
- Payment issues.
- Refunds.

Route to `account_subscription` when the customer primarily wants:

- Subscription status.
- Subscription details.
- Subscription association with an account.
- Subscription activation state.

## Escalation

Escalate when:

- The subscription status shown to the customer conflicts with provider records.
- A subscription appears active when it should be inactive.
- A requested subscription change is missing or incorrectly applied.
- The subscription cannot be identified from available account information.
- The issue requires account-level investigation.

## Important Notes

Do not assume that a subscription is active solely because the customer can access a service.

Do not disclose account-specific subscription information before completing required customer verification.

Do not provide unsupported renewal dates, fees, eligibility requirements, or subscription benefits.

## Source Basis

This knowledge article is based on standardized telecom customer-support workflows for verifying subscription status, reviewing subscription details, confirming associated services, protecting account information, routing subscription-related requests, and escalating discrepancies requiring account-level investigation.