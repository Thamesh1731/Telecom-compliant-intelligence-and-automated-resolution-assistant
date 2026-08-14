# NP-02: Number Porting Status

## Category

number_porting

## Subcategory

Number Porting Status and Tracking

## Problem

The customer has already submitted a mobile number porting request and wants to know its current status, progress, or whether the transfer has been completed.

The customer may also report that the porting process appears to be pending or that they have not received an expected update.

## Example Customer Complaints

- "What is the status of my number porting?"
- "Has my number been ported yet?"
- "Is my number transfer complete?"
- "My porting request is still pending."
- "I want to check my porting status."
- "When will my number be transferred?"
- "I submitted a porting request but nothing has happened."
- "Why is my number porting still in progress?"

## AI Assessment

NUMBER PORTING STATUS REQUEST

The customer is asking for the current state or progress of an existing number-porting request.

## Recommended Human Action

Check:

- Existing porting request.
- Porting reference number.
- Current porting status.
- Request submission date.
- Current and target provider.
- Any pending verification or authorization.
- Rejection or failure reason, if applicable.
- Whether the number transfer has completed.
- Whether any action is required from the customer.

## Possible Statuses

The porting request may be:

- Submitted.
- Pending.
- In progress.
- Awaiting required information.
- Approved.
- Completed.
- Rejected.
- Failed.
- Cancelled.

These statuses should only be reported when confirmed by the applicable provider system.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Locate the porting request.
3. Confirm the current status.
4. Check for pending actions or missing information.
5. Explain the current status to the customer.
6. Provide the next required action when applicable.
7. Escalate unresolved or inconsistent status information.

## Porting Delay

If the customer reports that the transfer is taking longer than expected:

- Check the current porting status.
- Review any pending requirements.
- Check for rejection or failure information.
- Determine whether the request requires intervention.
- Escalate when the request remains unresolved without a clear reason.

Do not assume that a pending request has failed.

## Completed Porting

If the system confirms that porting is complete:

- Confirm the transferred number.
- Verify the target service status where applicable.
- Check whether the customer reports any post-porting service problem.
- Route a separate technical issue to the appropriate category.

## Routing

Keep the request under `number_porting` when the primary issue is the status or progress of the number transfer.

Route to `number_calling` if porting has completed but the customer cannot make or receive calls.

Route to `sim_esim` if the number has been transferred but the primary problem concerns SIM/eSIM activation or detection.

Route to `billing` if the primary issue concerns charges related to the porting process.

## Escalation

Escalate when:

- The porting status cannot be determined.
- The system shows conflicting porting information.
- The request remains pending without a clear reason.
- The porting request has failed unexpectedly.
- The customer disputes a rejection.
- The transfer appears complete but the number is not functioning correctly.
- Specialist or provider-to-provider investigation is required.

## Important Notes

Do not provide an estimated completion time unless confirmed by the applicable provider system or authorized process.

Do not assume that a pending porting request is delayed without checking its current status and applicable process.

Do not disclose porting authorization information or sensitive customer data.

## Source Basis

This knowledge article is based on standardized telecom number-porting support workflows for tracking existing porting requests, verifying status, identifying pending requirements, handling delays and failures, confirming completed transfers, routing post-porting technical issues, and escalating unresolved transfer cases.