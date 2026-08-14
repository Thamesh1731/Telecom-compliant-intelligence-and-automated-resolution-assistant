# CALL-05: Caller ID and Number Issues

## Category
Number & Calling Services

## Subcategory
Caller ID, Number Display, and Number Identity Issues

## Problem

The customer reports an issue with how their phone number or caller
identity is displayed, recognized, or presented during calls.

The issue may affect the customer's outgoing caller ID, incoming caller
identification, displayed phone number, name associated with the number,
or number presentation after a SIM/eSIM change or number transfer.

## Common Symptoms

- Outgoing calls show the wrong number
- Outgoing calls show "Private" or "Unknown"
- Customer's name does not appear correctly on the recipient's device
- Incoming calls show an unexpected number
- Caller ID information is missing
- Caller ID works for some recipients but not others
- Caller ID changed after a SIM/eSIM replacement
- Caller ID changed after changing devices
- Caller ID changed after number porting
- Customer's number appears incorrectly to other people
- Customer receives calls intended for another number
- Customer's number is displayed incorrectly after a service change

## Possible Causes

- Caller ID setting disabled
- Provider-side caller ID configuration
- Recipient device or carrier configuration
- Caller ID database information
- Number provisioning issue
- Number porting or routing issue
- SIM/eSIM provisioning problem
- Account or line configuration
- Device configuration
- Number reassignment or previous ownership
- Call-blocking or privacy configuration
- Inter-carrier caller ID differences
- Temporary provider-side service issue

The AI must not assume the cause without sufficient evidence.

## Initial Diagnosis

Determine:

1. Whether the issue affects incoming or outgoing calls.
2. What number is displayed.
3. Whether the problem affects all recipients.
4. Whether the problem affects only certain recipients.
5. Whether the customer sees the same issue from multiple devices.
6. Whether the customer recently changed SIM/eSIM.
7. Whether the customer recently changed devices.
8. Whether the customer recently ported the number.
9. Whether caller ID was previously working correctly.
10. Whether the customer has caller ID blocking enabled.
11. Whether the mobile line is active.
12. Whether the customer receives calls intended for another number.
13. Whether SMS and other mobile services work normally.
14. Whether a known number or caller-ID incident exists.

## Caller ID vs Number Problem

### Caller ID Display Problem

More likely when:

- Calls connect normally.
- Only the displayed caller identity is incorrect.
- The mobile number itself remains active.

Continue with this workflow.

### Mobile Number Not Working

More likely when:

- Calls cannot be made or received.
- The number appears inactive.
- Other mobile services are also affected.

Route to:

`CALL-01: Phone Number Not Working`

### Number Porting Problem

More likely when:

- The issue began immediately after number porting.
- Incoming calls are routed incorrectly.
- Caller ID shows an unexpected number after the port.

Route to the appropriate number-porting workflow when applicable.

## Outgoing Caller ID

Outgoing caller ID determines what number or caller identity may be
presented to the person receiving the call.

The displayed information can depend on:

- Customer account configuration
- Device settings
- Provider settings
- Receiving carrier
- Recipient device
- Caller ID databases

Therefore, the provider may not control every aspect of how a number
or caller name appears on every recipient's device.

## Troubleshooting Procedure

### 1. Test an Outgoing Call

Call a known number and determine:

- What number appears.
- Whether "Private" or "Unknown" appears.
- Whether the correct mobile number appears.
- Whether the caller name is displayed.

### 2. Test Multiple Recipients

Determine whether the problem occurs:

- With all recipients.
- With one carrier.
- With one recipient.
- With multiple carriers.

If only one recipient is affected, investigate recipient-side or
inter-carrier factors before treating the customer's line as defective.

### 3. Check Caller ID Settings

Review supported device and account settings related to caller ID
presentation.

Do not change provider-controlled settings without authorization.

### 4. Check Account and Line Status

Through authorized provider systems, verify:

- Mobile-line status
- Number assignment
- Caller ID configuration
- Service configuration
- Recent account changes

### 5. Check SIM/eSIM

Verify that the SIM/eSIM is:

- Detected
- Active
- Correctly provisioned
- Associated with the correct mobile line

### 6. Check Number Porting

If the customer recently transferred the number, verify:

- Porting status
- Number assignment
- Incoming routing
- Outgoing caller ID provisioning

### 7. Check Provider Status

Check available information for:

- Caller ID incidents
- Number provisioning issues
- Porting incidents
- Routing incidents
- Known inter-carrier issues

## Diagnosis Guidance

### Outgoing Calls Show the Wrong Number

Possible causes:

- Number provisioning issue
- SIM/eSIM provisioning problem
- Porting issue
- Caller ID configuration
- Device configuration

### Outgoing Calls Show "Private" or "Unknown"

Possible causes:

- Caller ID blocking enabled
- Provider-side configuration
- Device setting
- Recipient network behavior

Verify the customer's caller ID configuration before escalating.

### Customer's Name Is Incorrect

Possible causes:

- Caller ID database information
- Recipient carrier information
- Recipient device contacts
- Provider caller-name configuration

The displayed caller name may not be controlled entirely by the
customer's mobile provider.

### Caller ID Is Wrong for Only One Recipient

Possible causes:

- Recipient device contact information
- Recipient carrier database
- Inter-carrier caller ID handling

Do not automatically classify the customer's line as defective.

### Caller ID Changed After SIM/eSIM Replacement

Possible causes:

- Provisioning issue
- Incorrect line association
- Activation issue

Check SIM/eSIM provisioning.

### Caller ID Changed After Number Porting

Possible causes:

- Porting-related provisioning
- Number-routing issue
- Caller ID database propagation
- Inter-carrier information mismatch

Allow for propagation where applicable, but do not promise a specific
time without authoritative provider information.

### Customer Receives Calls Intended for Another Number

Possible causes:

- Number-routing issue
- Number reassignment
- Incorrect provisioning
- Caller-side dialing error
- Inter-carrier routing problem

This may require provider-side investigation.

## Resolution

The issue may be resolved by:

- Correcting caller ID configuration.
- Disabling unintended caller ID blocking through the authorized
  process.
- Correcting number provisioning.
- Correcting SIM/eSIM provisioning.
- Resolving a number-porting issue.
- Correcting provider-side caller ID configuration.
- Resolving a confirmed routing problem.

After resolution, verify:

- Outgoing caller ID
- Incoming call routing
- Correct mobile number presentation

## Escalation Conditions

Escalate when:

- The wrong number is consistently presented to multiple recipients.
- Account records show an incorrect number assignment.
- Caller ID remains incorrect after standard troubleshooting.
- SIM/eSIM provisioning appears incorrect.
- The issue began after number porting.
- Calls intended for another number reach the customer.
- Number routing appears incorrect.
- Multiple customers report the same caller ID issue.
- Manual provider-side intervention is required.
- A carrier-routing or provisioning incident is suspected.

## Potential Caller ID Incident

Multiple similar complaints may indicate a broader caller ID or number
provisioning incident.

Example:

Ticket 8401
"My calls show the wrong number."

Ticket 8402
"Customers are seeing an incorrect caller ID."

Ticket 8403
"My caller ID changed after the provider update."

Same service
+
Similar time period
+
Similar symptoms
=
Potential Caller ID Incident

The AI must not declare a confirmed incident without authoritative
provider confirmation.

## Human Agent Workflow

When a caller-ID or number issue is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Verify account status.
5. Verify mobile-line status.
6. Verify assigned mobile number.
7. Check caller ID configuration.
8. Check SIM/eSIM provisioning.
9. Check number-porting status when relevant.
10. Check number routing when relevant.
11. Check current provider incidents.
12. Review related complaints.
13. Determine whether the issue is device-specific, recipient-specific,
    number-specific, provisioning-related, or systemic.
14. Perform authorized corrective action.
15. Escalate to the appropriate calling/network team.
16. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Incoming/outgoing status
- Number displayed
- Caller ID status
- Caller name status
- Affected recipients
- Recipient carrier when known
- Device type
- SIM/eSIM status
- Number assignment
- Number-porting status when relevant
- Number-routing status when relevant
- Related ticket IDs
- Incident ID when applicable
- Troubleshooting completed
- Escalation reason
- Final resolution

Do not record:

- Passwords
- Authentication codes
- Security answers
- Payment credentials

## Agent Guidance

Do not assume the customer's provider controls how caller ID appears
on every recipient's device.

Do not assume an incorrect caller name means the mobile number itself
is incorrect.

Do not expose internal caller ID databases or network-routing
information.

Do not promise that caller-name information will update by a specific
time without authoritative provider information.

Do not make account or service changes without required authorization.

Do not create duplicate incidents when an existing caller-ID incident
already covers the same problem.

Provider-specific caller ID features, number assignment rules, caller
name policies, porting procedures, routing processes, supported
settings, troubleshooting procedures, incident information, and
escalation policies should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, caller-ID and number-related complaints
should support automated classification and correlation.

The architecture should support:

- Caller ID classification
- Number-display classification
- Recipient-based analysis
- Carrier-based analysis
- Complaint similarity analysis
- Time-window analysis
- Number-routing correlation
- SIM/eSIM correlation
- Porting-event correlation
- Incident detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Network-team escalation
- Large numbers of simultaneous complaints

The system should allow large numbers of caller-ID complaints to be
analyzed without requiring agents to manually compare every ticket.

## Example

Customer complaint:

"When I call people, they see a completely different number instead of
my mobile number. This happens with everyone I call."

The system detects:

- Outgoing calls work.
- Caller ID is consistently incorrect.
- Multiple recipients are affected.

AI assessment:

POTENTIAL NUMBER OR CALLER-ID PROVISIONING ISSUE

Human action:

Verify the assigned mobile number, caller ID configuration,
SIM/eSIM provisioning, and recent account or porting changes.

## Example of Recipient-Specific Issue

Customer complaint:

"My number appears correctly to most people, but one friend sees an old
number."

The system detects:

- Caller ID works for multiple recipients.
- Only one recipient sees incorrect information.

AI assessment:

LIKELY RECIPIENT-SIDE OR CALLER-ID DATABASE ISSUE

Human action:

Verify the customer's number assignment before escalating the provider
line as defective.

## Source Basis

This article is a normalized knowledge article based on publicly
available caller ID, number provisioning, number porting, SIM/eSIM, and
telecommunications customer-support practices from US network providers
and FCC consumer guidance.

Provider-specific caller ID features, caller-name policies, number
assignment, routing, porting procedures, caller ID database practices,
supported settings, incident information, and escalation procedures
should be maintained separately as provider-specific policy documents.