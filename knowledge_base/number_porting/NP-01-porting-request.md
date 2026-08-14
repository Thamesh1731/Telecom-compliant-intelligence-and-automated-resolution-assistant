# NP-01: Mobile Number Porting Request

## Category

number_porting

## Subcategory

New Number Porting Request

## Problem

The customer wants to transfer an existing mobile number from one telecom provider to another while retaining the same number.

The request may involve starting a porting process, understanding the required information, or checking the basic procedure for transferring the number.

## Example Customer Complaints

- "I want to port my number to this network."
- "How can I transfer my mobile number?"
- "I want to keep my number when switching providers."
- "I want to move my number from my current provider."
- "Can I port my existing number?"
- "How do I start number porting?"
- "I want to switch networks without changing my number."
- "I need to port my mobile number."

## AI Assessment

MOBILE NUMBER PORTING REQUEST

The customer wants to transfer an existing mobile number between telecom providers while retaining the same number.

## Recommended Human Action

Determine:

- Current telecom provider.
- Target telecom provider.
- Mobile number being ported.
- Whether the customer has initiated a porting request.
- Whether required authorization or porting information is available.
- Whether the number is eligible for transfer.
- Whether any existing restrictions apply.

## Information to Collect

Where applicable, collect:

- Customer account information.
- Mobile number to be transferred.
- Current provider.
- Requested target provider.
- Required porting authorization information.
- Customer identity verification.
- Existing porting request reference, if one already exists.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Confirm the mobile number to be ported.
3. Confirm the current and target providers.
4. Check number-porting eligibility.
5. Explain the authorized porting procedure.
6. Initiate or route the porting request through the applicable system.
7. Provide the customer with the relevant request or reference information.

## Eligibility

Eligibility may depend on provider rules, account status, number status, geographic or regulatory requirements, and other applicable conditions.

Do not assume that every mobile number is eligible for porting.

## Routing

Keep the request under `number_porting` when the primary purpose is transferring an existing number between providers.

Route to `sim_esim` when the customer only needs a SIM or eSIM replacement or activation without changing providers.

Route to `number_calling` when the customer has a calling problem unrelated to transferring the number.

Route to `account_subscription` when the primary request concerns subscription status rather than number transfer.

## Escalation

Escalate when:

- Porting eligibility cannot be determined.
- The porting request cannot be submitted.
- Required authorization information is invalid or unavailable.
- The number has an existing conflicting porting request.
- The transfer requires specialist intervention.
- Regulatory or provider-specific requirements require further investigation.

## Important Notes

Do not promise that a number will be successfully ported before eligibility and authorization checks are completed.

Do not provide or invent porting authorization credentials.

Do not promise a specific completion time unless confirmed by the applicable provider system or authorized process.

## Source Basis

This knowledge article is based on standardized telecom number-porting support workflows for initiating mobile number transfers, verifying customer identity and eligibility, collecting required porting information, submitting authorized requests, and escalating cases requiring specialist or regulatory investigation.