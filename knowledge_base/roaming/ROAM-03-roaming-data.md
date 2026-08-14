# ROAM-03: Roaming Data

## Category
Roaming

## Subcategory
International Roaming Data

## Problem

The customer reports that mobile data does not work, is extremely slow,
or repeatedly disconnects while the customer is roaming outside their
home network.

The issue may be caused by account eligibility, roaming configuration,
device settings, partner-network availability, network conditions, or a
provider-side roaming problem.

## Common Symptoms

- Mobile data does not work while roaming
- Mobile data works intermittently
- Internet connection repeatedly disconnects
- Data is extremely slow while roaming
- Device shows a roaming network but applications cannot access the
  Internet
- 4G/5G is unavailable while roaming
- Data works in one country but not another
- Calls and SMS work but mobile data does not
- Mobile data worked previously but stopped after entering another
  country
- Data works after connecting to Wi-Fi but not through cellular roaming

## Possible Causes

- Data roaming is disabled on the device
- International data roaming is not enabled
- Customer's plan does not include roaming data
- Destination country is not supported
- Roaming data allowance has been exhausted
- Account restriction
- SIM/eSIM provisioning problem
- Incorrect APN or network configuration
- Device compatibility problem
- Partner-network problem
- Network congestion
- Temporary roaming outage
- Weak or unavailable roaming coverage
- Network technology incompatibility

## Initial Diagnosis

Determine:

1. Customer's current country.
2. City or region, when available.
3. Date and time the problem started.
4. Whether calls and SMS work.
5. Whether mobile data works intermittently or not at all.
6. Whether the device shows a roaming network.
7. Whether data roaming is enabled.
8. Whether the customer's plan supports roaming data.
9. Whether the destination is supported.
10. Whether the customer's roaming data allowance has been exhausted,
    when applicable.
11. Device model, when available.
12. SIM/eSIM status.
13. Whether another nearby location provides data service.
14. Whether a known roaming or partner-network incident exists.

## Roaming Data vs General Roaming Failure

### Data-Only Problem

More likely when:

- Calls and SMS work normally.
- The device is registered on a roaming network.
- Mobile data does not work.
- The issue is limited to Internet access.

Route to the roaming-data workflow.

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
- International roaming status
- Data roaming availability

Do not assume that all plans include international data roaming.

### 2. Check Data Roaming Setting

Verify that mobile data roaming is enabled on the customer's device
when required.

The customer should be informed that roaming data may result in charges
or consume an included roaming allowance according to the provider's
current policy.

### 3. Check Cellular Data

Confirm that:

- Mobile data is enabled.
- The device is connected to a cellular network.
- Airplane mode is disabled.
- The device is not restricted to Wi-Fi-only connectivity.

### 4. Check Network Registration

Determine whether the device:

- Shows a roaming network.
- Has cellular signal.
- Displays 4G/LTE/5G or another supported network indicator.
- Remains registered consistently.

### 5. Check Network Selection

If supported:

- Use automatic network selection.
- If automatic selection fails, check available supported partner
  networks.

Do not instruct customers to connect to unsupported networks.

### 6. Restart the Device

Restart the device and allow it to reconnect to the roaming network.

### 7. Check SIM/eSIM Status

Verify that the SIM/eSIM is:

- Active
- Correctly provisioned
- Associated with the correct mobile line

### 8. Check Data Allowance

When the provider's system supports this information, verify whether
the customer's included roaming data allowance has been consumed.

Do not invent remaining allowances or charges.

### 9. Check Provider and Partner Status

Check available information for:

- Roaming-data incidents
- Partner-network outages
- Destination-specific issues
- Network maintenance
- Provider-side roaming problems

## Diagnosis Guidance

### Calls and SMS Work but Data Does Not

Possible causes:

- Data roaming disabled
- Roaming data not included
- Data allowance exhausted
- Account restriction
- Device configuration problem
- Partner-network data issue

### No Network at All

Possible causes:

- Roaming eligibility problem
- Destination not supported
- Partner-network issue
- Device compatibility issue
- SIM/eSIM provisioning issue

Route to `ROAM-01` when appropriate.

### Data Works in One Location but Not Another

Possible causes:

- Local roaming coverage
- Partner-network availability
- Network congestion
- Local network issue

### Data Works on Wi-Fi but Not Cellular

This confirms that Internet access itself may work, but does not prove
that the roaming cellular service is functioning.

Check cellular registration and roaming-data settings.

### Data Is Extremely Slow

Possible causes:

- Weak roaming signal
- Network congestion
- Partner-network limitations
- Network technology limitations
- Data policy or allowance restrictions

Do not automatically classify slow roaming data as an outage.

### Data Works in One Country but Not Another

Possible causes:

- Destination-specific roaming agreement
- Different partner networks
- Plan restrictions
- Destination-specific service issue

Roaming availability in one country does not guarantee availability in
another.

## Resolution

The issue may be resolved by:

- Enabling eligible roaming data.
- Enabling data roaming on the device.
- Connecting to an authorized partner network.
- Correcting account or SIM/eSIM provisioning.
- Resolving a device configuration issue.
- Resolving a confirmed partner-network problem.
- Informing the customer when the roaming allowance or plan limitation
  explains the issue.

After restoration, verify:

- Cellular registration
- Mobile data connectivity
- Network technology
- Basic Internet access

## Escalation Conditions

Escalate when:

- Roaming data is enabled and eligible but remains unavailable.
- Calls and SMS work but data consistently fails after troubleshooting.
- Account and plan records indicate that roaming data should work.
- SIM/eSIM provisioning appears incorrect.
- Multiple customers report roaming-data failures in the same destination.
- A partner-network data outage is suspected.
- Provider information conflicts with the customer's experience.
- Manual account intervention is required.
- The problem persists after standard troubleshooting.
- The issue appears to affect a large number of roaming customers.

## Destination-Based Data Incident Detection

Roaming-data complaints can be grouped using:

- Country
- City or region, when available
- Date
- Time
- Affected network technology
- Complaint category
- Complaint similarity

Example:

Customer A
Destination: Germany
"No mobile data"

Customer B
Destination: Germany
"Roaming Internet stopped"

Customer C
Destination: Germany
"Calls work but mobile data doesn't"

Same destination
+
Similar time
+
Similar data complaints
=
Potential roaming-data incident

The system should not declare an incident without authoritative
confirmation.

## Human Agent Workflow

When a roaming-data complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify the customer's account and mobile line.
4. Verify roaming eligibility.
5. Verify destination support.
6. Verify roaming-data eligibility.
7. Check data allowance information when available.
8. Verify SIM/eSIM provisioning.
9. Check device compatibility and settings when relevant.
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
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Plan eligibility
- Destination support
- Data roaming status
- Data allowance status, when available
- Partner network, when available
- Network registration status
- Network technology
- Troubleshooting completed
- Related ticket IDs
- Incident ID, when applicable
- Escalation reason
- Final resolution

Do not record unnecessary passwords, authentication codes, or security
credentials.

## Agent Guidance

Do not assume that international data roaming is included in every
plan.

Do not invent roaming data prices, allowances, or destination
eligibility.

Do not promise that roaming data is free.

Do not tell customers to connect to unsupported or unknown networks.

Do not expose internal partner-network agreements or infrastructure
information.

Do not declare a roaming-data outage based only on a single complaint.

Do not create duplicate incidents when an existing roaming incident
already covers the destination and service.

Provider-specific roaming data pricing, allowances, destination
eligibility, partner networks, activation procedures, fair-use
policies, and escalation procedures should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, roaming-data complaints should be
processed using automated classification and destination-based
correlation.

The architecture should support:

- Destination-based clustering
- City/region aggregation
- Complaint similarity analysis
- Time-window analysis
- Partner-network correlation
- Data-specific incident detection
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Roaming-team escalation
- Large numbers of simultaneous complaints

The system should allow thousands or millions of roaming-data
complaints to be analyzed without requiring agents to manually compare
every ticket.

## Example

Customer complaints:

Ticket 1101
"Roaming data stopped working after I arrived in Germany."
Time: 09:10

Ticket 1102
"Phone has signal but there is no Internet."
Time: 09:20

Ticket 1103
"Calls work but mobile data doesn't work."
Time: 09:35

The system detects:

- Same destination
- Similar time period
- Similar roaming-data complaints

AI assessment:

POTENTIAL ROAMING-DATA INCIDENT

Human action:

Verify roaming-data eligibility, supported partner networks, and
current provider status before confirming an incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available international roaming, mobile-data, and wireless-support
practices from US network providers and FCC consumer guidance.

Provider-specific roaming data pricing, allowances, destination
availability, partner networks, supported technologies, activation
procedures, fair-use policies, incident information, and escalation
procedures should be maintained separately as provider-specific policy
documents.