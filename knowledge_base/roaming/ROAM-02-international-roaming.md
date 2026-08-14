# ROAM-02: International Roaming

## Category
Roaming

## Subcategory
International Roaming Availability

## Problem

The customer wants to use their mobile service while traveling outside
their home country or reports that international roaming is unavailable
at their destination.

## Common Scenarios

- Customer is traveling internationally.
- Customer wants to activate international roaming.
- Customer wants to know whether roaming is supported in a destination.
- Customer has arrived in another country and has no service.
- Customer can connect to a foreign network but cannot use calls, SMS,
  or mobile data.
- Customer's international roaming worked previously but is unavailable
  at the current destination.
- Customer wants to use their existing mobile number while abroad.

## Possible Causes

- International roaming is not enabled.
- Customer's plan does not include international roaming.
- Destination country is not supported.
- Provider does not have a roaming agreement with an available local
  network.
- Account restriction.
- SIM/eSIM provisioning issue.
- Device compatibility issue.
- Network registration problem.
- Partner-network outage.
- Incorrect device roaming settings.
- Roaming service has been suspended or blocked.

## Initial Diagnosis

Determine:

1. Customer's home country.
2. Current destination country.
3. Current city or region, when available.
4. Date and time the issue started.
5. Which services are affected.
6. Whether the customer is currently abroad or planning to travel.
7. Whether international roaming is enabled.
8. Whether the customer's plan supports international roaming.
9. Whether the destination is supported.
10. Whether the device detects a local network.
11. Whether the SIM/eSIM is active and properly provisioned.
12. Whether a known roaming or partner-network incident exists.

## Before Travel

When a customer is planning international travel, determine whether:

- The account supports international roaming.
- The customer's plan supports the destination.
- The required roaming feature is enabled.
- The device is compatible with supported networks at the destination.
- Any provider-specific roaming package or feature is required.

Provider-specific eligibility and pricing must come from current
provider policy information.

The AI must not invent roaming availability or pricing.

## Destination Support

International roaming availability depends on provider agreements and
destination-specific policies.

A provider may support roaming in one country but not another.

The system should verify destination support using authoritative
provider information.

Do not infer support solely from geographic proximity or the existence
of a local mobile network.

## Troubleshooting Procedure

### 1. Verify Destination

Confirm the country where the customer is currently located or plans to
travel.

### 2. Check Roaming Eligibility

Through authorized provider systems, verify:

- Account eligibility
- Plan eligibility
- International roaming status
- Destination support
- Mobile-line status

### 3. Check Device Compatibility

Verify that the device can operate on supported networks at the
destination.

Consider:

- Network technology
- Supported frequency bands
- Device regional variant
- SIM/eSIM capability

Use authoritative provider or manufacturer information.

### 4. Check Roaming Settings

Verify that the device allows the required roaming services.

For mobile data, data roaming may need to be enabled.

Customers should be informed that roaming data may be subject to
provider-specific charges or plan conditions.

### 5. Check Network Registration

Determine whether the device:

- Detects available networks.
- Connects automatically.
- Shows a roaming indicator.
- Allows supported manual network selection.

Do not instruct the customer to connect to an unknown or unsupported
network.

### 6. Restart the Device

Restart the device and allow it to reconnect to a supported roaming
network.

### 7. Check SIM/eSIM

Verify that the SIM/eSIM:

- Is active.
- Is correctly provisioned.
- Belongs to the correct mobile line.

If the SIM/eSIM is not detected, route to the appropriate Account/SIM
workflow.

### 8. Check Provider Status

Check available information for:

- Destination-specific roaming incidents
- Partner-network outages
- Planned maintenance
- Provider roaming-system issues

## Diagnosis Guidance

### Customer is traveling to an unsupported country

The issue is an eligibility limitation rather than a network outage.

Provide only current provider-approved information.

### Roaming is supported but not enabled

Follow the provider's authorized activation process.

### Roaming is enabled but no network is detected

Possible causes:

- No supported partner network available
- Device compatibility issue
- Network selection issue
- Partner-network outage
- Provisioning problem

### Network is detected but service does not work

Possible causes:

- Roaming provisioning
- Account restriction
- Partner-network compatibility
- Service-specific roaming restriction

### Calls work but data does not

Possible causes:

- Data roaming disabled
- Data roaming not included
- Account restriction
- Incorrect device configuration
- Partner-network issue

Route to the appropriate roaming-data workflow when applicable.

### Data works but calls do not

Possible causes:

- Voice roaming restriction
- Partner-network compatibility
- Account provisioning
- Network registration problem

Route to the appropriate roaming-calls workflow when applicable.

## Resolution

The issue may be resolved by:

- Enabling eligible international roaming.
- Correcting supported device roaming settings.
- Connecting to an authorized partner network.
- Correcting SIM/eSIM provisioning.
- Resolving an account restriction.
- Resolving a confirmed partner-network issue.

After service is restored, verify:

- Network registration
- Calls
- SMS
- Mobile data, when applicable

## Escalation Conditions

Escalate when:

- The destination is supported but roaming cannot be established.
- Roaming is enabled and eligible but the customer cannot connect.
- Account and plan records indicate eligibility but service remains
  unavailable.
- SIM/eSIM provisioning appears incorrect.
- Multiple customers report international roaming failure in the same
  destination.
- A partner-network outage is suspected.
- Provider information conflicts with the customer's experience.
- Manual account intervention is required.
- The issue persists after standard troubleshooting.

## Destination-Based Incident Detection

For a large network provider, international roaming complaints can be
grouped by:

- Country
- City or region, when available
- Date
- Time
- Affected service
- Complaint similarity

Example:

Customer A
Destination: Japan
"No roaming service"

Customer B
Destination: Japan
"Cannot connect to a network"

Customer C
Destination: Japan
"International roaming stopped working"

Same destination
+
Similar time
+
Similar complaint
=
Potential destination-specific roaming incident

The system should not automatically declare an incident without
authoritative confirmation.

## Human Agent Workflow

When an international roaming complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify the account and mobile line.
4. Verify international roaming eligibility.
5. Verify destination support.
6. Verify SIM/eSIM provisioning.
7. Verify device compatibility when relevant.
8. Check available partner-network information.
9. Check known roaming incidents.
10. Review related complaints from the same destination.
11. Determine whether the issue is account-specific, destination-specific,
    or provider/partner-network related.
12. Perform authorized corrective action.
13. Escalate to the roaming or network team when required.
14. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Home country
- Roaming country
- City/region, when available
- Date
- Time
- Affected service
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Plan eligibility
- Destination support
- Roaming provisioning status
- Partner network, when available
- Network registration status
- Troubleshooting completed
- Related ticket IDs
- Incident ID, when applicable
- Escalation reason
- Final resolution

Do not record unnecessary authentication credentials or security
information.

## Agent Guidance

Do not assume international roaming is available in every country.

Do not promise international roaming availability without authoritative
provider information.

Do not invent roaming packages, prices, allowances, or destination
eligibility.

Do not instruct customers to connect to unsupported or unknown networks.

Do not promise that roaming charges will not apply unless the
provider's current policy confirms this.

Do not expose internal roaming agreements or network infrastructure
information.

Do not create duplicate incidents when an existing destination-specific
roaming incident already covers the problem.

Provider-specific destination lists, roaming agreements, prices, plans,
activation procedures, data allowances, supported networks, and
customer communication policies should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, international roaming complaints should
be processed using automated classification and destination-based
correlation.

The architecture should support:

- Country-based clustering
- City/region aggregation
- Complaint similarity analysis
- Time-window analysis
- Partner-network correlation
- Destination-specific incident detection
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Roaming-team escalation
- Large numbers of simultaneous roaming complaints

The system should allow thousands or millions of international roaming
complaints to be analyzed without requiring agents to manually compare
every ticket.

## Example

Customer complaints:

Ticket 1001
"I landed in Japan and have no network."
Time: 08:15

Ticket 1002
"International roaming isn't connecting."
Time: 08:25

Ticket 1003
"My phone cannot connect to any network in Japan."
Time: 08:40

The system detects:

- Same destination
- Similar time period
- Similar roaming complaints

AI assessment:

POTENTIAL DESTINATION-SPECIFIC ROAMING INCIDENT

Human action:

Verify destination eligibility, supported partner networks, and
provider roaming status before confirming an incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available international roaming and wireless-support practices from US
network providers and FCC consumer guidance.

Provider-specific destination availability, roaming agreements,
partner networks, pricing, plan eligibility, activation procedures,
data allowances, incident information, and escalation procedures should
be maintained separately as provider-specific policy documents.