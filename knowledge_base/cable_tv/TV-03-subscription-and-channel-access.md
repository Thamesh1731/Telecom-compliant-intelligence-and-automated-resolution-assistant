# TV-03: Cable TV Subscription and Channel Access

## Category

cable_tv

## Subcategory

Subscription and Channel Access

## Problem

The customer reports that they cannot access one or more cable TV channels or subscribed programming, or they are unsure whether a channel is included in their current television subscription.

The issue may involve channel authorization, subscription entitlements, recently changed services, or missing subscribed channels.

## Example Customer Complaints

- "I am paying for this channel but cannot watch it."
- "A channel I subscribed to is not available."
- "Why can't I access this channel?"
- "My premium channels disappeared."
- "I upgraded my TV package but the channels are still locked."
- "This channel says I am not subscribed."
- "I want to know if this channel is included in my package."
- "Some of my subscribed channels are missing."

## AI Assessment

CABLE TV SUBSCRIPTION OR CHANNEL AUTHORIZATION ISSUE

The complaint indicates that channel access may not match the customer's current television subscription or service entitlements.

## Recommended Human Action

Verify:

- Customer account status.
- Active cable TV subscription.
- Current TV package or channel tier.
- Channel entitlement or authorization.
- Recently requested subscription changes.
- Whether the affected channel is included in the customer's package.
- Known channel-specific service issues.

Determine whether the problem affects:

- One channel.
- Multiple channels.
- Premium channels.
- Recently added channels.
- All subscribed channels.

## Basic Troubleshooting

Ask the customer to:

1. Confirm the exact channel that is unavailable.
2. Check whether other subscribed channels work.
3. Restart the cable TV receiver or set-top box.
4. Allow the equipment to reconnect.
5. Retest the affected channel.
6. Check whether the channel remains unavailable after the equipment restart.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Confirm the active TV subscription.
3. Check whether the affected channel is included.
4. Verify channel authorization.
5. Check for pending subscription changes.
6. Refresh or reauthorize the service when an authorized procedure exists.
7. Escalate persistent authorization problems.

## Routing

Route to `account_subscription` when the customer is primarily asking about the status or modification of their overall subscription.

Route to `plans_recharge` when the request concerns a mobile plan or recharge rather than cable TV.

Route to `billing` when the primary complaint concerns charges for the TV subscription or channel package.

Keep the request under `cable_tv` when the issue is specifically about cable TV channel access.

## Escalation

Escalate when:

- A subscribed channel remains inaccessible after authorization checks.
- The customer's account shows incorrect channel entitlements.
- A recent subscription change has not been reflected.
- Multiple subscribed channels are incorrectly unavailable.
- The issue requires backend authorization or provisioning.
- The customer disputes the recorded subscription entitlement.

## Important Notes

Do not assume a channel is included in the customer's package without checking the applicable subscription information.

Do not promise access to premium or restricted channels without verifying eligibility and authorization.

Do not treat a channel authorization problem as a signal-quality issue unless the available evidence indicates a signal problem.

## Source Basis

This knowledge article is based on standardized cable television support workflows for verifying television subscriptions, channel entitlements, authorization status, recently changed services, and resolving or escalating channel-access problems.