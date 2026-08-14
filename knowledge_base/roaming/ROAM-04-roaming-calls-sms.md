# ROAM-04: Roaming Calls and SMS

## Category
Roaming

## Subcategory
Roaming Voice Calls and SMS

## Problem

The customer reports that voice calls or SMS do not work while roaming
outside their home network.

The issue may affect outgoing calls, incoming calls, outgoing SMS,
incoming SMS, or all voice and messaging services.

## Common Symptoms

- Cannot make outgoing calls while roaming
- Cannot receive incoming calls while roaming
- Calls fail immediately
- Calls connect and then drop
- Cannot send SMS
- Cannot receive SMS
- SMS delivery is delayed
- Calls work but SMS does not
- SMS works but calls do not
- Voice and SMS worked previously but stopped while roaming
- Mobile data works while voice or SMS does not
- Device is connected to a roaming network but voice services are
  unavailable

## Possible Causes

- Voice roaming is not enabled
- SMS roaming is not supported in the destination
- Customer's plan does not support roaming voice or SMS
- Destination country is unsupported
- Provider does not have a compatible roaming agreement
- Partner-network compatibility issue
- Account restriction
- SIM/eSIM provisioning problem
- Device compatibility issue
- Network registration problem
- Temporary partner-network outage
- Network technology limitation
- Incorrect network selection
- Temporary network congestion

## Initial Diagnosis

Determine:

1. Customer's current country.
2. City or region, when available.
3. Date and time the issue started.
4. Whether outgoing calls work.
5. Whether incoming calls work.
6. Whether outgoing SMS works.
7. Whether incoming SMS works.
8. Whether mobile data works.
9. Whether the device shows a roaming network.
10. Whether the SIM/eSIM is active.
11. Whether roaming voice and SMS are supported by the account and plan.
12. Whether the destination is supported.
13. Whether the issue is continuous or intermittent.
14. Whether a known roaming or partner-network incident exists.

## Voice and SMS vs General Roaming Failure

### Voice/SMS-Only Problem

More likely when:

- The device is registered on a roaming network.
- Mobile data works.
- Only calls or SMS are affected.

Route to this workflow.

### Complete Roaming Failure

More likely when:

- No network is detected.
- Calls, SMS, and data all fail.
- The device cannot register on a supported partner network.

Route to:

`ROAM-01: Roaming Not Working`

### Account or SIM Problem

More likely when:

- Roaming should be enabled but provisioning is incorrect.
- SIM/eSIM is not detected.
- Account restrictions are present.

Route to the appropriate Account/SIM workflow.

## Troubleshooting Procedure

### 1. Verify Roaming Eligibility

Through authorized provider systems, verify:

- Account eligibility
- Plan eligibility
- Destination support
- Voice roaming availability
- SMS roaming availability
- Mobile-line status

Do not assume that every plan supports roaming voice or SMS.

### 2. Check Network Registration

Determine whether the device:

- Detects a roaming network.
- Displays a network name.
- Shows cellular signal.
- Indicates roaming status.

If no network is detected, investigate the general roaming workflow.

### 3. Check Network Selection

If supported:

- Use automatic network selection.
- If automatic selection fails, check available supported partner
  networks.

Do not instruct customers to connect to unsupported or unknown networks.

### 4. Restart the Device

Restart the device and allow it to reconnect to the roaming network.

### 5. Check SIM/eSIM Status

Verify that the SIM/eSIM is:

- Active
- Correctly provisioned
- Associated with the correct mobile line

### 6. Test Calls

Determine whether:

- Outgoing calls work.
- Incoming calls work.
- Calls fail immediately.
- Calls connect but drop.
- Only specific numbers are affected.

### 7. Test SMS

Determine whether:

- Outgoing SMS works.
- Incoming SMS works.
- Messages are delayed.
- Messages fail completely.

### 8. Check Provider Status

Check available information for:

- Roaming voice incidents
- Roaming SMS incidents
- Partner-network outages
- Destination-specific service issues
- Network maintenance

## Diagnosis Guidance

### Calls and SMS Both Fail

Possible causes:

- Roaming voice/SMS not enabled
- Destination unsupported
- Partner-network issue
- Account restriction
- SIM/eSIM provisioning
- Network registration problem

### Calls Work but SMS Does Not

Possible causes:

- SMS roaming restriction
- Partner-network compatibility
- Messaging provisioning problem
- Temporary SMS service issue

### SMS Works but Calls Do Not

Possible causes:

- Voice roaming restriction
- Partner-network voice compatibility
- Network technology limitation
- Account provisioning problem
- Partner-network issue

### Incoming Calls Do Not Work but Outgoing Calls Work

Possible causes:

- Incoming roaming restriction
- Partner-network routing problem
- Temporary network issue
- Account configuration issue

### Outgoing Calls Do Not Work but Incoming Calls Work

Possible causes:

- Outgoing roaming restriction
- Account restriction
- Partner-network routing problem
- Number-dialing or network compatibility issue

### Data Works but Voice and SMS Do Not

Possible causes:

- Voice/SMS roaming restriction
- Partner-network compatibility
- Network technology limitation
- Account provisioning issue

Do not assume that working data means all roaming services should
automatically work.

## Resolution

The issue may be resolved by:

- Enabling eligible roaming voice/SMS services.
- Connecting to an authorized partner network.
- Correcting account or SIM/eSIM provisioning.
- Correcting network selection.
- Resolving a confirmed partner-network issue.
- Resolving a provider-side roaming incident.

After service is restored, verify:

- Network registration
- Outgoing calls
- Incoming calls
- Outgoing SMS
- Incoming SMS

## Escalation Conditions

Escalate when:

- Roaming is enabled and eligible but calls or SMS remain unavailable.
- The device is registered on a supported partner network but voice/SMS
  services fail.
- Account and plan records indicate that voice/SMS roaming should work.
- SIM/eSIM provisioning appears incorrect.
- Multiple customers report the same voice/SMS issue in the same
  destination.
- A partner-network outage is suspected.
- Provider information conflicts with the customer's experience.
- Manual account intervention is required.
- The issue persists after standard troubleshooting.

## Destination-Based Incident Detection

Roaming voice and SMS complaints can be grouped using:

- Country
- City or region, when available
- Date
- Time
- Affected service
- Complaint category
- Complaint similarity

Example:

Customer A
Destination: Italy
"Cannot make calls"

Customer B
Destination: Italy
"Calls are failing"

Customer C
Destination: Italy
"SMS stopped working"

Same destination
+
Similar time
+
Similar roaming complaints
=
Potential roaming voice/SMS incident

The system should not automatically declare an incident without
authoritative confirmation.

## Human Agent Workflow

When a roaming calls/SMS complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify the customer's account and mobile line.
4. Verify roaming eligibility.
5. Verify destination support.
6. Verify voice and SMS roaming availability.
7. Verify SIM/eSIM provisioning.
8. Check device compatibility when relevant.
9. Check network registration.
10. Check partner-network information.
11. Check known roaming incidents.
12. Review related complaints from the same destination.
13. Determine whether the issue is account-specific, device-specific,
    destination-specific, or provider/partner-network related.
14. Perform authorized corrective action.
15. Escalate to the roaming or network team when required.
16. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Roaming country
- City/region, when available
- Date
- Time
- Affected service
- Incoming/outgoing status
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Plan eligibility
- Destination support
- Voice roaming status
- SMS roaming status
- Partner network, when available
- Network registration status
- Troubleshooting completed
- Related ticket IDs
- Incident ID, when applicable
- Escalation reason
- Final resolution

Do not record unnecessary passwords, authentication codes, or security
credentials.

## Agent Guidance

Do not assume that international voice or SMS roaming is included in
every plan.

Do not invent roaming prices, destination eligibility, supported
networks, or service availability.

Do not promise that roaming calls or SMS are free unless the provider's
current policy confirms this.

Do not instruct customers to connect to unsupported or unknown networks.

Do not declare a roaming incident based only on a single complaint.

Do not create duplicate incidents when an existing roaming incident
already covers the same destination and service.

Provider-specific roaming destinations, supported partner networks,
pricing, plan eligibility, voice/SMS policies, activation procedures,
and escalation procedures should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, roaming voice and SMS complaints should be
processed using automated classification and destination-based
correlation.

The architecture should support:

- Destination-based clustering
- City/region aggregation
- Voice/SMS classification
- Complaint similarity analysis
- Time-window analysis
- Partner-network correlation
- Roaming incident detection
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Roaming-team escalation
- Large numbers of simultaneous complaints

The system should allow thousands or millions of roaming complaints to
be analyzed without requiring agents to manually compare every ticket.

## Example

Customer complaints:

Ticket 1201
"Cannot make calls after arriving in Italy."
Time: 09:10

Ticket 1202
"Calls keep failing on roaming."
Time: 09:20

Ticket 1203
"SMS isn't working either."
Time: 09:35

The system detects:

- Same destination
- Similar time period
- Similar roaming voice/SMS complaints

AI assessment:

POTENTIAL ROAMING VOICE/SMS INCIDENT

Human action:

Verify roaming eligibility, supported partner networks, and current
provider status before confirming an incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available international roaming, voice, SMS, and wireless-support
practices from US network providers and FCC consumer guidance.

Provider-specific roaming destinations, partner networks, pricing,
voice/SMS eligibility, supported technologies, activation procedures,
incident information, and escalation procedures should be maintained
separately as provider-specific policy documents.