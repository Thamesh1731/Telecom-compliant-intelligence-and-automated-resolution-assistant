# CALL-02: Incoming Calls

## Category
Number & Calling Services

## Subcategory
Incoming Calls Not Working

## Problem

The customer reports that they cannot receive incoming calls on their
mobile number, while the mobile line may otherwise remain active.

The problem may affect all incoming calls or only calls from specific
numbers.

## Common Symptoms

- Incoming calls do not reach the customer
- Callers hear an error message
- Callers are sent directly to voicemail
- Phone does not ring
- Incoming calls work intermittently
- Some callers can reach the customer while others cannot
- Incoming calls stopped after a SIM/eSIM change
- Incoming calls stopped after number porting
- Incoming calls stopped after a plan or account change
- Customer can make outgoing calls but cannot receive calls

## Possible Causes

- Incoming-call routing problem
- Call forwarding configuration
- Call blocking configuration
- Number provisioning issue
- SIM/eSIM provisioning problem
- Account or line restriction
- Network registration problem
- Network outage
- Number porting or routing issue
- Device configuration problem
- Caller-specific network issue
- Temporary provider-side calling-service issue

The AI must not assume the cause without sufficient evidence.

## Initial Diagnosis

Determine:

1. Whether outgoing calls work.
2. Whether incoming calls fail for all callers.
3. Whether incoming calls fail only for specific callers.
4. Whether SMS works.
5. Whether mobile data works.
6. Whether the phone has cellular signal.
7. Whether the device is registered on the network.
8. Whether calls go directly to voicemail.
9. Whether call forwarding is enabled.
10. Whether call blocking is enabled.
11. Whether the customer recently changed SIM/eSIM.
12. Whether the customer recently changed devices.
13. Whether the number was recently ported.
14. Whether the customer recently changed plans or account settings.
15. Whether a known calling or network incident exists.

## Incoming vs General Calling Problem

### Incoming-Only Problem

More likely when:

- Outgoing calls work normally.
- Mobile data works.
- SMS works.
- Only incoming calls are affected.

Continue with this workflow.

### General Calling Problem

More likely when:

- Both incoming and outgoing calls fail.

Route to:

`CALL-01: Phone Number Not Working`

### General Network Problem

More likely when:

- No cellular signal is available.
- Calls, SMS, and mobile data all fail.
- Device cannot register on the mobile network.

Route to the appropriate Mobile Service or Network Coverage workflow.

## Troubleshooting Procedure

### 1. Check Account and Line Status

Through authorized provider systems, verify:

- Account status
- Mobile-line status
- Calling-service status
- Service restrictions
- Suspension status

Do not disclose sensitive account information before completing
required authentication.

### 2. Test Outgoing Calls

Ask the customer to make an outgoing call.

If outgoing calls work, the issue is more likely limited to incoming-call
routing or configuration.

### 3. Test From Another Number

Have another phone attempt to call the customer's mobile number.

Determine whether:

- All callers are affected.
- Only one caller is affected.
- Calls go directly to voicemail.
- The caller receives an error message.
- The customer's device rings.

### 4. Check Call Forwarding

Review supported call-forwarding settings.

Unexpected forwarding may prevent calls from reaching the customer's
device.

Do not change provider-controlled forwarding settings without following
the authorized process.

### 5. Check Call Blocking

Review device and provider-supported call-blocking settings.

A blocked caller should not automatically be interpreted as a network
failure.

### 6. Check Network Registration

Determine whether the device:

- Has cellular signal.
- Shows a network name.
- Is registered on the provider network.
- Can make outgoing calls.

### 7. Check SIM/eSIM

Verify that the SIM/eSIM is:

- Detected
- Active
- Correctly provisioned
- Associated with the correct mobile line

### 8. Restart the Device

Restart the device and allow it to reconnect to the mobile network.

### 9. Check Number Provisioning

If incoming calls still fail while outgoing calls work, verify
authorized provider records for:

- Number provisioning
- Incoming-call routing
- Number status
- Porting status when relevant

### 10. Check Provider Status

Check available information for:

- Calling outages
- Incoming-call incidents
- Routing incidents
- Number-porting incidents
- Maintenance
- Network issues

## Diagnosis Guidance

### All Incoming Calls Fail

Possible causes:

- Incoming-call routing issue
- Number provisioning issue
- Account restriction
- SIM/eSIM provisioning problem
- Network issue
- Call-forwarding configuration

### Only One Caller Cannot Reach the Number

Possible causes:

- Caller-side network issue
- Caller-side blocking
- Incorrect number
- Destination routing issue
- Inter-carrier routing problem

Do not automatically classify the customer's number as defective.

### Calls Go Directly to Voicemail

Possible causes:

- Call forwarding
- Device unavailable
- Network registration issue
- Do Not Disturb or call-screening configuration
- Provider routing issue

Check whether the customer's device is connected to the network.

### Phone Rings but Call Cannot Be Answered

Possible causes:

- Device software issue
- Temporary network issue
- Call-handling configuration
- Device hardware issue

If the problem appears device-specific, route to the appropriate device
workflow.

### Incoming Calls Stopped After SIM/eSIM Replacement

Possible causes:

- SIM/eSIM provisioning problem
- Incorrect mobile-line association
- Activation issue
- Temporary provisioning delay

Check the SIM/eSIM workflow.

### Incoming Calls Stopped After Number Porting

Possible causes:

- Porting not completed
- Number-routing issue
- Inter-carrier routing problem
- Incorrect provisioning

Route to the appropriate number-porting process when applicable.

## Resolution

The issue may be resolved by:

- Correcting incoming-call routing.
- Correcting call-forwarding configuration.
- Correcting authorized call-blocking settings.
- Correcting SIM/eSIM provisioning.
- Correcting number provisioning.
- Completing an outstanding porting process.
- Resolving a confirmed network or routing incident.
- Correcting supported device settings.

After resolution, verify:

- Incoming call from another number
- Outgoing call
- SMS when relevant
- Mobile data when relevant

## Escalation Conditions

Escalate when:

- Outgoing calls work but all incoming calls fail.
- Account and service records indicate incoming calling should work.
- Number provisioning or routing appears incorrect.
- SIM/eSIM provisioning appears incorrect.
- The problem persists after standard troubleshooting.
- Multiple customers report similar incoming-call failures.
- A carrier-routing issue is suspected.
- A number-porting issue is suspected.
- Manual provider-side intervention is required.

## Potential Incoming-Call Incident

Multiple similar complaints may indicate a broader routing or calling
incident.

Example:

Ticket 8101
"Nobody can call my number."

Ticket 8102
"Incoming calls are going directly to voicemail."

Ticket 8103
"People cannot reach my mobile number."

Same service
+
Similar time period
+
Similar symptoms
=
Potential Incoming-Call Incident

The AI must not declare a confirmed incident without authoritative
provider confirmation.

## Human Agent Workflow

When an incoming-call complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Verify account status.
5. Verify mobile-line status.
6. Verify calling-service status.
7. Check SIM/eSIM provisioning.
8. Check network registration.
9. Check call-forwarding and blocking configuration.
10. Check number provisioning and routing when relevant.
11. Check porting status when relevant.
12. Check current provider incidents.
13. Review related complaints.
14. Determine whether the issue is account-specific, device-specific,
    number-specific, caller-specific, or systemic.
15. Perform authorized corrective action.
16. Escalate to the appropriate calling/network team.
17. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Incoming-call status
- Outgoing-call status
- SMS status
- Data status
- Caller-specific or all-call failure
- Call-forwarding status
- Call-blocking status
- SIM/eSIM status
- Network registration status
- Number provisioning status
- Number-porting status when relevant
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

Do not assume that every failed incoming call indicates a problem with
the customer's number.

Do not assume that calls going to voicemail automatically indicate a
network outage.

Do not expose internal routing or network infrastructure information.

Do not promise a specific restoration time without authoritative
provider information.

Do not make account or service changes without required authorization.

Do not create duplicate incidents when an existing incoming-call
incident already covers the same problem.

Provider-specific call-forwarding features, blocking rules, number
provisioning, routing procedures, porting processes, troubleshooting
procedures, incident information, and escalation policies should be
maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, incoming-call complaints should support
automated classification and correlation.

The architecture should support:

- Incoming-call classification
- Caller-specific failure detection
- Number-based issue classification
- Complaint similarity analysis
- Time-window analysis
- Geographic aggregation when relevant
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

The system should allow large numbers of incoming-call complaints to be
analyzed without requiring agents to manually compare every ticket.

## Example

Customer complaint:

"My phone has signal and I can make outgoing calls, but nobody can call
me. Every caller says the call goes directly to voicemail."

The system detects:

- Network registration available
- Outgoing calls work
- Incoming calls fail
- Multiple callers affected

AI assessment:

POTENTIAL INCOMING-CALL ROUTING OR PROVISIONING ISSUE

Human action:

Verify incoming-call routing, call-forwarding configuration,
number provisioning, SIM/eSIM status, and current provider incidents.

## Example of Caller-Specific Failure

Customer complaint:

"Everyone can call me except my brother. His calls do not reach my
phone."

The system detects:

- Incoming calls generally work
- One caller is affected

AI assessment:

LIKELY CALLER-SPECIFIC OR DESTINATION-ROUTING ISSUE

Human action:

Do not immediately classify the customer's number as defective.
Investigate the affected caller or routing path if necessary.

## Source Basis

This article is a normalized knowledge article based on publicly
available mobile calling, incoming-call routing, number provisioning,
SIM/eSIM, and telecommunications customer-support practices from US
network providers and FCC consumer guidance.

Provider-specific call-forwarding features, blocking rules, number
provisioning, routing procedures, porting processes, supported network
technologies, troubleshooting procedures, incident information, and
escalation procedures should be maintained separately as
provider-specific policy documents. 