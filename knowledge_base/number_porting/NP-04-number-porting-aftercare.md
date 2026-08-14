# NP-04: Number Porting Aftercare and Post-Porting Issues

## Category

number_porting

## Subcategory

Post-Porting Service Issues

## Problem

The customer's mobile number has been successfully ported, but they are experiencing problems with the number or associated mobile services after the transfer.

The issue may affect calls, SMS, mobile data, caller ID, network registration, or other services associated with the newly transferred number.

## Example Customer Complaints

- "My number was ported but I cannot make calls."
- "The port is complete but I have no network."
- "I can receive calls but cannot make them after porting."
- "My SMS stopped working after the number transfer."
- "My number was transferred but mobile data doesn't work."
- "People cannot call my ported number."
- "My caller ID is wrong after porting."
- "The port completed but my number isn't working."

## AI Assessment

POST-PORTING SERVICE OR NUMBER CONFIGURATION ISSUE

The number transfer appears to have completed, but one or more services associated with the transferred number are not functioning correctly.

## Recommended Human Action

Confirm:

- Porting completion status.
- Correct mobile number.
- Current provider.
- SIM/eSIM status.
- Mobile-line activation.
- Network registration.
- Incoming calls.
- Outgoing calls.
- SMS.
- Mobile data.
- Caller ID and number routing where applicable.

## Diagnostic Interpretation

If the number is not registered on the new network, investigate SIM/eSIM activation, mobile-line provisioning, or network registration.

If outgoing calls fail but other services work, investigate calling-service provisioning.

If incoming calls fail, investigate number routing and incoming-call provisioning.

If SMS fails, investigate messaging-service provisioning.

If mobile data fails while calls work, investigate data-service configuration and provisioning.

If caller ID or number identity is incorrect, investigate number configuration and routing.

These are possibilities to investigate, not confirmed causes.

## Basic Troubleshooting

Where appropriate, ask the customer to:

1. Restart the device.
2. Confirm that the SIM/eSIM is enabled.
3. Check network registration.
4. Test an outgoing call.
5. Test an incoming call.
6. Send and receive an SMS.
7. Test mobile data.
8. Record any error messages.

## Human Action

The support agent should:

1. Verify the customer's identity where required.
2. Confirm that porting has completed.
3. Verify the transferred number.
4. Check mobile-line provisioning.
5. Check SIM/eSIM activation.
6. Check relevant calling, messaging, and data services.
7. Investigate number routing where applicable.
8. Route the specific technical issue to the appropriate support category when necessary.
9. Escalate unresolved post-porting problems.

## Routing

Route to `sim_esim` when the primary problem is SIM/eSIM activation or detection.

Route to `number_calling` when the primary problem is incoming or outgoing calling.

Route to `mobile_service` when the primary problem concerns general mobile service functionality.

Route to `internet` when the primary problem is mobile internet or data service.

Keep the issue under `number_porting` when the problem specifically appears to originate from the completed number transfer or number provisioning.

## Escalation

Escalate when:

- Porting is confirmed complete but the number is not functioning.
- Incoming or outgoing routing appears incorrect.
- Multiple services fail after porting.
- The mobile line is active but provisioning is incomplete.
- The number appears incorrectly assigned.
- The issue requires provider-to-provider investigation.
- Standard troubleshooting does not restore service.

## Important Notes

Do not assume that every post-porting problem is caused by the porting process.

Do not declare porting successful solely because the customer received a confirmation message. Verify the status through the applicable system where possible.

Do not modify number routing or provisioning without authorization.

Do not promise a specific resolution time unless confirmed by the applicable provider system or support process.

## Source Basis

This knowledge article is based on standardized telecom support workflows for diagnosing service problems following mobile number porting, verifying transfer completion, checking SIM/eSIM activation and service provisioning, investigating number routing, and escalating persistent post-porting issues requiring specialist or provider-to-provider intervention.