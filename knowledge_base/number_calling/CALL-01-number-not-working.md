# CALL-01: Phone Number Not Working

## Category
Number & Calling Services

## Subcategory
Mobile Number Not Working

## Problem

The customer reports that their mobile number is not functioning
correctly for calling services.

The issue may affect incoming calls, outgoing calls, or both.

## Common Symptoms

- Cannot make calls using the mobile number
- Cannot receive calls
- Both incoming and outgoing calls fail
- Calls fail immediately
- Number appears inactive
- Phone displays an error when making a call
- Other people cannot reach the customer's number
- Customer's number appears unavailable
- Calling stopped after a SIM/eSIM change
- Calling stopped after changing plans or account settings
- Number works intermittently

## Possible Causes

- Account or line restriction
- Service suspension
- SIM/eSIM provisioning problem
- Network registration problem
- Calling-service configuration issue
- Number provisioning issue
- Device configuration problem
- Network outage
- Roaming restriction
- Number porting or transfer issue
- Call-blocking configuration
- Temporary provider-side service issue

The AI must not assume the cause without sufficient evidence.

## Initial Diagnosis

Determine:

1. Whether incoming calls work.
2. Whether outgoing calls work.
3. Whether SMS works.
4. Whether mobile data works.
5. When the problem started.
6. Whether the issue is continuous or intermittent.
7. Whether the customer recently changed SIM/eSIM.
8. Whether the customer recently changed devices.
9. Whether the customer recently changed their plan.
10. Whether the account is active.
11. Whether the mobile line is active.
12. Whether the device detects the SIM/eSIM.
13. Whether the device is registered on the mobile network.
14. Whether the customer is currently roaming.
15. Whether a known calling or network incident exists.

## Calling vs General Network Problem

### Calling-Specific Problem

More likely when:

- Mobile signal is present.
- SMS works.
- Mobile data works.
- Only voice calls are affected.

Continue with this workflow.

### General Network Problem

More likely when:

- No cellular signal is available.
- Calls, SMS, and mobile data all fail.
- Device cannot register on the network.

Route to the appropriate Mobile Service or Network Coverage workflow.

### SIM/eSIM Problem

More likely when:

- SIM/eSIM is not detected.
- Calling stopped immediately after SIM/eSIM replacement.
- Account records show provisioning problems.

Route to the appropriate Account/SIM workflow.

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

### 2. Check Network Registration

Determine whether the device:

- Has cellular signal.
- Shows a network name.
- Is registered on the provider network.
- Displays an appropriate cellular connection.

### 3. Test Outgoing Calls

Determine whether:

- All outgoing calls fail.
- Only one number fails.
- Calls fail immediately.
- Calls connect and then disconnect.

If only one destination number is affected, the problem may not be with
the customer's mobile number.

### 4. Test Incoming Calls

Ask whether another phone can successfully call the customer's number.

Determine whether:

- All callers are affected.
- Only one caller is affected.
- Calls go directly to voicemail.
- Calls produce an error message.

### 5. Check SIM/eSIM

Verify that the SIM/eSIM is:

- Detected
- Active
- Correctly provisioned
- Associated with the correct mobile line

### 6. Restart the Device

Restart the device and allow it to reconnect to the mobile network.

### 7. Check Device Calling Settings

Review relevant device settings such as:

- Airplane mode
- Call blocking
- Call forwarding
- Network selection
- Preferred network settings

Do not change settings that require provider authorization without
following the approved process.

### 8. Check Provider Status

Check available information for:

- Calling outages
- Network incidents
- Maintenance
- Number-service incidents
- Provisioning issues

## Diagnosis Guidance

### Incoming and Outgoing Calls Both Fail

Possible causes:

- Line inactive
- Account restriction
- SIM/eSIM provisioning
- Network registration problem
- Network outage
- Number provisioning issue

### Incoming Calls Fail but Outgoing Calls Work

Possible causes:

- Incoming-call routing problem
- Call-forwarding configuration
- Network routing issue
- Number provisioning problem
- Caller-specific issue

### Outgoing Calls Fail but Incoming Calls Work

Possible causes:

- Outgoing-call restriction
- Account restriction
- Network registration issue
- Calling-service provisioning
- Device configuration

### Only One Number Cannot Be Called

Possible causes:

- Incorrect number
- Call blocking
- Destination-number problem
- Other party's network issue

Do not automatically classify this as a problem with the customer's
mobile number.

### Calls Fail After SIM/eSIM Replacement

Possible causes:

- SIM/eSIM provisioning delay
- Incorrect line association
- Activation problem
- Account provisioning issue

Check the SIM/eSIM workflow.

### Calls Fail After Number Porting

Possible causes:

- Porting not completed
- Routing propagation issue
- Incorrect line provisioning
- Temporary number-routing issue

Route to the appropriate number-porting process when applicable.

## Resolution

The issue may be resolved by:

- Restoring the mobile line.
- Removing an authorized service restriction.
- Correcting SIM/eSIM provisioning.
- Correcting calling-service provisioning.
- Correcting supported device settings.
- Resolving a confirmed network or routing issue.
- Completing an outstanding number-porting process.

After resolution, verify:

- Outgoing calls
- Incoming calls
- SMS when relevant
- Mobile data when relevant

## Escalation Conditions

Escalate when:

- The mobile line is active but calls remain unavailable.
- Account and service records indicate calling should work.
- SIM/eSIM provisioning appears incorrect.
- Number routing or provisioning appears incorrect.
- The problem persists after standard troubleshooting.
- Multiple customers report similar calling failures.
- A network or routing incident is suspected.
- Manual provider-side intervention is required.
- The issue began after a number transfer or porting event.

## Potential Calling Incident

Multiple similar complaints may indicate a broader provider or routing
incident.

Example:

Ticket 8001
"Cannot make calls."

Ticket 8002
"Incoming calls aren't reaching my number."

Ticket 8003
"Calls are failing since this morning."

Same service
+
Similar time period
+
Similar symptoms
=
Potential Calling Incident

The AI must not declare a confirmed incident without authoritative
provider confirmation.

## Human Agent Workflow

When a number-not-working complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Verify account status.
5. Verify mobile-line status.
6. Verify calling-service status.
7. Check SIM/eSIM provisioning.
8. Check network registration.
9. Check number provisioning or routing when relevant.
10. Check current provider incidents.
11. Review related complaints.
12. Determine whether the issue is account-specific, device-specific,
    number-specific, or systemic.
13. Perform authorized corrective action.
14. Escalate to the appropriate network or calling-service team.
15. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Mobile-line status
- Incoming-call status
- Outgoing-call status
- SMS status
- Data status
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

Do not assume that every failed call indicates a problem with the
customer's number.

Do not assume that a single failed call proves a provider outage.

Do not expose internal routing or network infrastructure information.

Do not promise a specific restoration time without authoritative
provider information.

Do not make account or service changes without the required
authorization.

Do not create duplicate incidents when an existing calling incident
already covers the same problem.

Provider-specific calling features, number provisioning rules, routing
procedures, porting processes, service restrictions, troubleshooting
procedures, incident information, and escalation policies should be
maintained separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, number-related calling complaints should
support automated classification and correlation.

The architecture should support:

- Incoming/outgoing call classification
- Number-based issue classification
- Complaint similarity analysis
- Time-window analysis
- Geographic aggregation when relevant
- Number-routing correlation
- SIM/eSIM correlation
- Incident detection
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Network-team escalation
- Large numbers of simultaneous complaints

The system should allow large numbers of calling complaints to be
analyzed without requiring agents to manually compare every ticket.

## Example

Customer complaint:

"My phone has signal and mobile data works, but I cannot make or
receive any calls."

The system detects:

- Network registration appears available.
- Data works.
- Calling service is unavailable.
- Both incoming and outgoing calls are affected.

AI assessment:

POTENTIAL CALLING-SERVICE OR LINE-PROVISIONING ISSUE

Human action:

Verify mobile-line status, calling-service provisioning, SIM/eSIM
status, and current provider incidents.

## Example of Destination-Specific Failure

Customer complaint:

"I can call most numbers, but calls to one particular number always
fail."

The system detects:

- General outgoing calling works.
- Failure is limited to one destination.

AI assessment:

LIKELY DESTINATION-SPECIFIC CALLING ISSUE

Human action:

Do not immediately classify the customer's mobile number as defective.
Investigate the destination number or receiving network if necessary.

## Source Basis

This article is a normalized knowledge article based on publicly
available mobile calling, number-service, SIM/eSIM, and
telecommunications customer-support practices from US network providers
and FCC consumer guidance.

Provider-specific calling features, number provisioning, routing,
porting, service restrictions, supported network technologies,
troubleshooting procedures, incident information, and escalation
procedures should be maintained separately as provider-specific policy
documents.