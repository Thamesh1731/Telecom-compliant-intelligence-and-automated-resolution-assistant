# AS-04: Subscription Eligibility and Availability

## Category

account_subscription

## Subcategory

Subscription Eligibility and Availability

## Problem

The customer wants to know whether they are eligible for a particular subscription or whether a subscription is available for their account, service, location, or customer type.

The request concerns eligibility or availability rather than an existing subscription problem.

## Example Customer Complaints

- "Am I eligible for this subscription?"
- "Can I get this subscription?"
- "Why can't I subscribe to this service?"
- "Is this subscription available for my account?"
- "Can I switch to this subscription?"
- "Why am I not eligible for this plan?"
- "Is this service available to me?"
- "What do I need to qualify for this subscription?"

## AI Assessment

SUBSCRIPTION ELIGIBILITY OR AVAILABILITY REQUEST

The customer is asking whether a subscription can be obtained, activated, or changed based on applicable eligibility requirements.

## Recommended Human Action

Identify the exact subscription the customer is requesting and verify the relevant account and service information.

Check applicable factors such as:

- Current account status.
- Existing subscription.
- Customer eligibility.
- Service availability.
- Account restrictions.
- Required verification.
- Required equipment or service compatibility.
- Any applicable subscription conditions.

## Human Action

The support agent should:

1. Identify the requested subscription.
2. Verify the customer's account where required.
3. Check the applicable eligibility criteria.
4. Confirm whether the subscription is available.
5. Explain any applicable requirements.
6. If the customer is not eligible, provide the authorized reason when available.
7. Route the request to a specialized team if eligibility requires further investigation.

## Routing

Route to `plans_recharge` when the request specifically concerns eligibility for a mobile plan, recharge, data allowance, voice allowance, or plan change.

Route to `cable_tv` when eligibility concerns a cable television service.

Route to `installation_technician` when availability depends on installation or technician assessment.

Route to `account_subscription` when the customer is asking about general subscription eligibility or subscription availability.

## Escalation

Escalate when:

- Eligibility information is unavailable or inconsistent.
- The customer's account shows conflicting eligibility information.
- A requested subscription is incorrectly marked unavailable.
- Specialist verification is required.
- The customer disputes an eligibility decision.
- Service availability requires technical or location-specific investigation.

## Important Notes

Do not guarantee eligibility before the applicable checks are completed.

Do not invent eligibility criteria, fees, service areas, or approval requirements.

A customer's ability to use an existing service does not automatically mean they are eligible for every subscription.

## Source Basis

This knowledge article is based on standardized telecom customer-support workflows for handling subscription eligibility and availability requests, verifying account and service conditions, routing specialized eligibility questions, and escalating cases where eligibility or availability cannot be determined through standard procedures.