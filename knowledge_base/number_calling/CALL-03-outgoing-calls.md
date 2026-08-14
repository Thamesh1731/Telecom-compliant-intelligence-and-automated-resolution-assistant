# CALL-03: Outgoing Calls

## Category
Number & Calling Services

## Subcategory
Outgoing Calls Not Working

## Problem

The customer reports that they cannot make outgoing calls from their
mobile number, while incoming calls or other mobile services may still
work.

## Common Symptoms

- Outgoing calls fail immediately
- Calls cannot be initiated
- Call attempt produces an error
- Calls connect but immediately disconnect
- Some numbers can be called while others cannot
- International calls fail
- Calls to certain area codes fail
- Outgoing calls stopped after a SIM/eSIM change
- Outgoing calls stopped after a plan or account change
- Outgoing calls work intermittently

## Possible Causes

- Outgoing-call restriction
- Account or line restriction
- Service suspension
- SIM/eSIM provisioning problem
- Network registration problem
- Calling-service provisioning issue
- Number configuration issue
- Device configuration problem
- Network outage
- International calling restriction
- Destination-specific routing issue
- Number porting or routing issue
- Temporary provider-side calling-service issue

The AI must not assume the cause without sufficient evidence.

## Initial Diagnosis

Determine:

1. Whether incoming calls work.
2. Whether all outgoing calls fail.
3. Whether only specific numbers fail.
4. Whether local calls work.
5. Whether international calls work.
6. Whether SMS works.
7. Whether mobile data works.
8. Whether the device has cellular signal.
9. Whether the device is registered on the network.
10. Whether the account and mobile line are active.
11. Whether the customer recently changed SIM/eSIM.
12. Whether the customer recently changed devices.
13. Whether the customer recently changed plans.
14. Whether the customer recently ported the number.
15. Whether a known calling or network incident exists.

## Outgoing vs General Calling Problem

### Outgoing-Only Problem

More likely when:

- Incoming calls work normally.
- Mobile data works.
- SMS works.
- Only outgoing calls are affected.

Continue with this workflow.

### Incoming and Outgoing Calls Both Fail

Route to:

`CALL-01: Phone Number Not Working`

### General Network Problem

More likely when:

- No cellular signal is available.
- Calls, SMS, and mobile data all fail.
- Device cannot register on the network.

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

### 2. Test Different Numbers

Determine whether the customer can call:

- A local number
- A different mobile number
- A landline
- An emergency number when appropriate

Do not repeatedly place unnecessary test calls.

### 3. Identify Destination-Specific Failure

Determine whether:

- Every outgoing call fails.
- Only one number fails.
- Only certain area codes fail.
- Only international calls fail.
- Only premium or special numbers fail.

A failure affecting only one destination does not necessarily indicate a
problem with the customer's mobile line.

### 4. Check Network Registration

Determine whether the device:

- Has cellular signal.
- Shows a network name.
- Is registered on the provider network.
- Can receive incoming calls.

### 5. Check SIM/eSIM

Verify that the SIM/eSIM is:

- Detected
- Active
- Correctly provisioned
- Associated with the correct mobile line

### 6. Restart the Device

Restart the device and allow it to reconnect to the mobile network.

### 7. Check Calling Settings

Review supported device settings such as:

- Airplane mode
- Call blocking
- Fixed dialing restrictions when supported
- Network selection
- Preferred network settings

Do not change provider-controlled restrictions without authorization.

### 8. Check Calling Restrictions

Through authorized provider systems, verify whether outgoing calling is
restricted because of:

- Account status
- Service suspension
- Plan configuration
- International-calling restrictions
- Other provider policies

### 9. Check Number Provisioning

If outgoing calls remain unavailable, verify authorized provider records
for:

- Mobile-line provisioning
- Calling-service provisioning
- Number status
- Number-porting status when relevant

### 10. Check Provider Status

Check available information for:

- Calling outages
- Outgoing-call incidents
- Routing incidents
- Network maintenance
- Number-porting incidents

## Diagnosis Guidance

### All Outgoing Calls Fail

Possible causes:

- Outgoing-call restriction
- Account suspension
- Calling-service provisioning problem
- SIM/eSIM provisioning issue
- Network registration issue
- Network outage
- Number configuration issue

### Incoming Calls Work but Outgoing Calls Fail

This strongly suggests that the issue is limited to outgoing calling,
account restrictions, routing, or calling-service provisioning.

### Only One Number Cannot Be Called

Possible causes:

- Incorrect number
- Destination-number problem
- Call blocking
- Receiving-network issue
- Inter-carrier routing problem

Do not automatically classify the customer's line as defective.

### Only International Calls Fail

Possible causes:

- International calling restriction
- Plan limitation
- Destination restriction
- International routing issue
- Provider policy

Verify current provider policy before giving a definitive explanation.

### Calls Connect but Immediately Drop

Possible causes:

- Network instability
- Network registration problem
- Device issue
- Partner-network issue
- Provider routing issue

Check whether the problem affects all destinations or only specific
numbers.

### Outgoing Calls Stopped After SIM/eSIM Replacement

Possible causes:

- SIM/eSIM provisioning problem
- Incorrect line association
- Activation issue
- Temporary provisioning problem

Route to the appropriate SIM/eSIM workflow when applicable.

### Outgoing Calls Stopped After Number Porting

Possible causes:

- Porting not completed
- Number-routing issue
- Inter-carrier routing problem
- Incorrect provisioning

Route to the appropriate number-porting process when applicable.

## Resolution

The issue may be resolved by:

- Removing an authorized outgoing-call restriction.
- Restoring the mobile line.
- Correcting SIM/eSIM provisioning.
- Correcting calling-service provisioning.
- Correcting supported device settings.
- Resolving a confirmed network or routing incident.
- Completing an outstanding number-porting process.
- Enabling an eligible calling feature through the authorized process.

After resolution, verify:

- Outgoing calls
- Incoming calls
- SMS when relevant
- Mobile data when relevant

## Escalation Conditions

Escalate when:

- Incoming calls work but outgoing calls consistently fail.
- Account and service records indicate outgoing calling should work.
- SIM/eSIM provisioning appears incorrect.
- Number provisioning or routing appears incorrect.
- The problem persists after standard troubleshooting.
- Multiple customers report similar outgoing-call failures.
- A network or routing incident is suspected.
- Manual provider-side intervention is required.
- The issue began after a number transfer or porting event.
- Destination-specific failures cannot be explained by current provider
  policy.

## Potential Outgoing-Call Incident

Multiple similar complaints may indicate a broader calling or routing
incident.

Example:

Ticket 8201
"All outgoing calls are failing."

Ticket 8202
"I can't make any calls."

Ticket 8203
"Calls stopped working this morning."

Same service
+
Similar time period
+
Similar symptoms
=
Potential Outgoing-Call Incident

The AI must not declare a confirmed incident without authoritative
provider confirmation.

## Human Agent Workflow

When an outgoing-call complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify customer identity through the authorized process.
4. Verify account status.
5. Verify mobile-line status.
6. Verify calling-service status.
7. Check SIM/eSIM provisioning.
8. Check network registration.
9. Check outgoing-call restrictions.
10. Check number provisioning and routing when relevant.
11. Check number-porting status when relevant.
12. Check current provider incidents.
13. Review related complaints.
14. Determine whether the issue is account-specific, device-specific,
    number-specific, destination-specific, or systemic.
15. Perform authorized corrective action.
16. Escalate to the appropriate calling/network team.
17. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Date
- Time
- Outgoing-call status
- Incoming-call status
- SMS status
- Data status
- Affected destination
- Local/international status
- Call restriction status
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

Do not assume that every failed outgoing call indicates a problem with
the customer's number.

Do not assume that a single failed call proves a provider outage.

Do not assume that international calling is included in every plan.

Do not expose internal routing or network infrastructure information.

Do not promise a specific restoration time without authoritative
provider information.

Do not make account or service changes without required authorization.

Do not create duplicate incidents when an existing outgoing-call
incident already covers the same problem.

Provider-specific calling features, international calling policies,
number provisioning, routing procedures, porting processes, service
restrictions, troubleshooting procedures, incident information, and
escalation policies should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, outgoing-call complaints should support
automated classification and correlation.

The architecture should support:

- Outgoing-call classification
- Destination-based failure detection
- Local/international classification
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

The system should allow large numbers of outgoing-call complaints to be
analyzed without requiring agents to manually compare every ticket.

## Example

Customer complaint:

"My phone has signal and I can receive calls, but every time I try to
make an outgoing call it fails immediately."

The system detects:

- Network registration available
- Incoming calls work
- Outgoing calls fail
- Problem affects multiple destinations

AI assessment:

POTENTIAL OUTGOING-CALL RESTRICTION OR CALLING-SERVICE PROVISIONING ISSUE

Human action:

Verify account status, outgoing-call restrictions, calling-service
provisioning, SIM/eSIM status, and current provider incidents.

## Example of Destination-Specific Failure

Customer complaint:

"I can call local numbers, but every international number I try to
call fails."

The system detects:

- Local outgoing calling works.
- International calling fails consistently.

AI assessment:

POTENTIAL INTERNATIONAL-CALLING RESTRICTION OR ROUTING ISSUE

Human action:

Verify the customer's plan and current international-calling policy
before escalating to the appropriate provider team.

## Source Basis

This article is a normalized knowledge article based on publicly
available mobile calling, outgoing-call, number provisioning, SIM/eSIM,
international calling, and telecommunications customer-support
practices from US network providers and FCC consumer guidance.

Provider-specific calling features, international calling policies,
number provisioning, routing procedures, porting processes, supported
network technologies, service restrictions, troubleshooting procedures,
incident information, and escalation procedures should be maintained
separately as provider-specific policy documents.