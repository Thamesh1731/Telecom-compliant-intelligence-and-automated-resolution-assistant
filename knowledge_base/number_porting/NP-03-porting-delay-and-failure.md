# NP-03: Number Porting Delay and Failure

## Category

number_porting

## Subcategory

Number Porting Delay and Failure

## Problem

The customer reports that a mobile number porting request has been delayed, rejected, failed, or otherwise cannot be completed.

The issue may involve an unsuccessful transfer, missing requirements, eligibility problems, incorrect information, or a porting request that remains unresolved.

## Example Customer Complaints

- "My number porting failed."
- "Why was my porting request rejected?"
- "My number transfer is stuck."
- "The porting process failed."
- "My number still hasn't been transferred."
- "Why can't I port my number?"
- "My porting request was rejected."
- "The number transfer keeps failing."

## AI Assessment

POTENTIAL NUMBER PORTING FAILURE OR DELAY

The customer reports that an existing number-porting request has not completed successfully.

## Recommended Human Action

Check:

- Existing porting request.
- Current porting status.
- Rejection or failure reason.
- Customer and account information.
- Number eligibility.
- Required authorization information.
- Current and target provider.
- Any pending verification.
- Previous porting attempts.
- Conflicting or duplicate requests.

## Common Causes to Investigate

Possible causes include:

- Incorrect customer information.
- Missing or invalid authorization information.
- Number not eligible for transfer.
- Account-related restriction.
- Conflicting porting request.
- Verification failure.
- Provider-side processing issue.
- Regulatory or service-area restriction.

These are possibilities to investigate, not confirmed causes.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Locate the existing porting request.
3. Determine the exact failure or rejection status.
4. Review the recorded reason.
5. Identify whether additional information or customer action is required.
6. Correct eligible information through the authorized process.
7. Resubmit or restart the request when permitted.
8. Escalate unresolved failures when necessary.

## Delayed Porting

If the request remains pending:

- Check the current porting status.
- Check whether additional verification is required.
- Check for provider or system-side processing issues.
- Determine whether the request has exceeded the applicable processing window.
- Escalate when the delay cannot be explained or resolved through standard procedures.

Do not automatically classify every pending request as a failure.

## Rejected Porting

If the request was rejected:

1. Identify the recorded rejection reason.
2. Explain the reason to the customer where permitted.
3. Determine whether the issue can be corrected.
4. Correct eligible information through the authorized process.
5. Submit a new request when permitted.

Do not invent a rejection reason.

## Routing

Keep the issue under `number_porting` when the primary problem is the number transfer itself.

Route to `account_subscription` when the primary issue is an account or subscription restriction unrelated to the transfer process.

Route to `sim_esim` when porting has completed but the primary problem is SIM/eSIM activation or detection.

Route to `number_calling` when the number has successfully transferred but calls are not working.

Route to `billing` when the primary complaint concerns charges associated with the porting process.

## Escalation

Escalate when:

- The failure reason cannot be determined.
- The system contains conflicting porting information.
- The request repeatedly fails after correction.
- The customer disputes the rejection.
- The number appears eligible but cannot be transferred.
- Provider-to-provider investigation is required.
- Regulatory or specialist intervention is required.

## Important Notes

Do not assume the cause of a failed porting request without checking the recorded status or failure information.

Do not promise successful porting after resubmission.

Do not provide or invent authorization credentials.

Do not promise a specific completion time unless confirmed by the applicable provider system or authorized process.

## Source Basis

This knowledge article is based on standardized telecom number-porting support workflows for investigating delayed, rejected, and failed number transfers, checking eligibility and authorization requirements, correcting eligible request information, handling resubmission, and escalating unresolved provider or regulatory issues.