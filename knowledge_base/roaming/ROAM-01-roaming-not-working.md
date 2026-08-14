# ROAM-01: Roaming Not Working

## Category
Roaming

## Subcategory
Roaming Service Unavailable

## Problem

The customer reports that mobile service does not work while roaming
outside their normal home network coverage area.

The issue may affect voice calls, SMS, mobile data, or all roaming
services.

## Common Symptoms

- No cellular service while roaming
- Phone shows no network
- Cannot make or receive calls while roaming
- Cannot send or receive SMS while roaming
- Mobile data does not work while roaming
- Device cannot connect to a partner network
- Roaming works intermittently
- Roaming worked previously but has stopped
- Service works normally on the customer's home network but not while
  roaming
- Device connects to a network but services remain unavailable

## Possible Causes

- Roaming is not enabled on the account
- International roaming is not supported for the customer's plan
- Destination country is not covered by the provider's roaming
  agreements
- Device cannot connect to a supported partner network
- Network selection problem
- SIM/eSIM provisioning problem
- Account restriction
- Roaming service suspended or blocked
- Device compatibility problem
- Partner-network outage
- Temporary roaming-network issue
- Incorrect device network settings
- Roaming data setting is disabled

## Initial Diagnosis

Determine:

1. Customer's current country or roaming location.
2. Date and time the problem started.
3. Which services are affected.
4. Whether the device shows a network name or signal.
5. Whether the device can connect to any available network.
6. Whether the customer is using physical SIM or eSIM.
7. Whether roaming is enabled on the account.
8. Whether the customer's plan supports roaming in the destination.
9. Whether the destination country is supported by the provider.
10. Whether the problem occurs continuously or intermittently.
11. Whether other services work normally on the customer's home network.
12. Whether a known roaming or partner-network incident exists.

## Roaming vs Home Network Service

### Roaming Problem

More likely when:

- Home-network service works normally.
- Service fails only outside the home network area.
- The customer is connected to or attempting to connect to a partner
  network.
- The destination requires roaming.
- Other account and SIM functions are normal.

### Home Network Problem

If the customer is actually within the provider's normal coverage area,
do not automatically classify the issue as roaming.

Route the complaint to the appropriate Mobile Service or Network
Coverage workflow.

## Initial Troubleshooting

### 1. Check Roaming Eligibility

Verify through authorized provider systems whether the customer's:

- Account supports roaming.
- Plan supports roaming.
- Destination is supported.
- Mobile line is enabled for roaming.

Do not assume that every plan includes roaming.

### 2. Check Device Roaming Settings

Verify that the device allows the required roaming services.

For mobile data, confirm that data roaming is enabled when required.

Do not instruct customers to enable roaming data without explaining
that provider-specific charges or plan conditions may apply.

### 3. Check Network Selection

If supported by the device:

- Use automatic network selection.
- If automatic selection fails, check whether manual selection of an
  available supported partner network is permitted.

Do not instruct customers to connect to an unknown or unsupported
network.

### 4. Restart the Device

Restart the device and allow it to reconnect to an available roaming
network.

### 5. Check Signal and Network Registration

Determine whether the device:

- Detects a network.
- Displays a network name.
- Shows cellular signal.
- Indicates roaming status.

### 6. Check SIM/eSIM Status

Verify that the SIM/eSIM is:

- Active
- Correctly provisioned
- Associated with the correct mobile line

If the SIM/eSIM is not detected, route to the appropriate Account/SIM
workflow.

### 7. Check Provider Status

Check available provider information for:

- Roaming incidents
- Partner-network outages
- Destination-specific service issues
- Maintenance events

## Diagnosis Guidance

### No Network Detected

Possible causes:

- No supported partner network available
- Roaming not enabled
- Destination not supported
- Device compatibility problem
- Temporary partner-network issue
- SIM/eSIM provisioning problem

### Network Detected but Calls Do Not Work

Possible causes:

- Voice roaming restriction
- Partner-network compatibility
- Account provisioning
- Network registration problem
- Partner-network issue

### Network Detected but SMS Does Not Work

Possible causes:

- SMS roaming restriction
- Network registration issue
- Partner-network problem
- Account provisioning issue

### Network Detected but Data Does Not Work

Possible causes:

- Data roaming disabled
- Roaming data not included or enabled
- Account restriction
- Incorrect device configuration
- Partner-network issue
- Provisioning problem

### Roaming Works in One Country but Not Another

Possible causes:

- Destination-specific roaming agreement
- Partner-network availability
- Plan restrictions
- Destination-specific service issue

Do not assume that roaming availability in one country guarantees
availability in another.

## Resolution

The issue may be resolved by:

- Enabling supported roaming service through the provider's authorized
  process.
- Correcting supported device roaming settings.
- Connecting to an authorized partner network.
- Correcting account or SIM/eSIM provisioning.
- Resolving a known partner-network issue.
- Waiting for a confirmed roaming incident to be resolved.

After service is restored, verify:

- Network registration
- Calls
- SMS
- Mobile data, when applicable

## Escalation Conditions

Escalate when:

- Roaming is enabled but the customer cannot connect to a supported
  partner network.
- Account and plan records indicate roaming should work but service
  remains unavailable.
- SIM/eSIM provisioning appears incorrect.
- Multiple customers report roaming failures in the same destination.
- A partner-network outage is suspected.
- The provider's roaming information conflicts with the customer's
  experience.
- Manual account intervention is required.
- The destination appears supported but roaming cannot be established.
- The problem persists after standard troubleshooting.

## Geographic and Destination Analysis

Roaming complaints can be analyzed using:

- Customer's roaming country
- City or region, when available
- Date
- Time
- Complaint category
- Complaint similarity
- Affected roaming service

For large network providers, multiple complaints from the same
destination during the same period may indicate a partner-network or
provider-side roaming incident.

Example:

Customer A
Destination: France
"No roaming service"

Customer B
Destination: France
"Can't connect to network"

Customer C
Destination: France
"Roaming data stopped working"

Same destination
+
Similar time
+
Similar complaint
=
Potential roaming incident

The system should not declare an incident without authoritative
confirmation.

## Human Agent Workflow

When a roaming complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify the customer's account and mobile line.
4. Verify roaming eligibility.
5. Verify destination support.
6. Verify roaming provisioning.
7. Check available partner-network information.
8. Check known roaming incidents.
9. Review related complaints from the same destination.
10. Determine whether the issue is account-specific, destination-specific,
    or provider/partner-network related.
11. Resolve the issue when authorized.
12. Escalate to the appropriate roaming or network team when required.
13. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Customer roaming country
- City/region when available
- Date
- Time
- Affected service
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Roaming provisioning status
- Partner network, when available
- Network registration status
- Troubleshooting completed
- Related ticket IDs
- Incident ID, when applicable
- Escalation reason
- Final resolution

Do not record unnecessary authentication credentials or sensitive
account security information.

## Agent Guidance

Do not assume roaming is included in every customer plan.

Do not promise roaming availability in a destination without
authoritative provider information.

Do not instruct customers to connect to unsupported or unknown networks.

Do not promise that roaming charges will not apply unless the provider's
current policy confirms this.

Do not expose internal partner-network agreements or network
infrastructure information.

Do not create duplicate incidents when an existing roaming incident
already covers the same destination and service.

Provider-specific roaming destinations, supported partner networks,
pricing, plan eligibility, data allowances, activation procedures, and
roaming policies should be maintained separately as provider-specific
policy documents.

## Scalability Requirements

For a large network provider, roaming complaints should be processed
using automated classification and destination-based correlation.

The architecture should support:

- Destination-based clustering
- Complaint similarity analysis
- Time-window analysis
- Partner-network correlation
- Roaming incident detection
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Roaming-team escalation
- Large numbers of simultaneous roaming complaints

The system should allow thousands or millions of complaints to be
analyzed without requiring agents to manually compare every roaming
ticket.

## Example

Customer complaints:

Ticket 901
"No service after landing in France."
Time: 09:10

Ticket 902
"Phone won't connect to any network in France."
Time: 09:25

Ticket 903
"Roaming data stopped working."
Time: 09:40

The system detects:

- Same destination
- Similar time period
- Similar roaming complaints

AI assessment:

POTENTIAL ROAMING INCIDENT

Human action:

Review roaming eligibility, supported partner-network information, and
current provider status before confirming an incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available roaming and international wireless-support practices from US
network providers and FCC consumer guidance.

Provider-specific roaming destinations, partner networks, pricing,
eligibility rules, activation procedures, data allowances, roaming
agreements, incident information, and escalation procedures should be
maintained separately as provider-specific policy documents.