# COV-04: 4G/5G Availability Problem

## Category
Network Coverage & Outage

## Subcategory
4G/5G Availability

## Problem

The customer reports that 4G or 5G service is unavailable, unexpectedly
switches to a different network technology, or does not provide the
expected connectivity in a particular location.

## Common Symptoms

- 5G is not available
- Device remains connected to 4G/LTE when 5G is expected
- Device repeatedly switches between 4G and 5G
- 4G/LTE is unavailable
- Mobile data works on 4G but not 5G
- 5G signal is weak or intermittent
- Customer reports that 5G works in some locations but not others
- Device shows a lower network technology than expected
- Network technology changes while moving between locations
- Customer reports reduced performance after switching between network
  technologies

## Possible Causes

- 5G coverage is unavailable in the customer's location
- 4G/5G network availability varies geographically
- Device does not support the required network technology or bands
- Device settings do not permit the expected network mode
- SIM/eSIM or account provisioning issue
- Temporary network issue
- Network congestion
- Indoor coverage limitations
- Device software or carrier-settings issue
- Provider has not deployed the expected network technology in the area
- Network technology is temporarily unavailable

## Initial Diagnosis

Determine:

1. Customer city.
2. State.
3. ZIP code.
4. General location where the problem occurs.
5. Date and time of the issue.
6. Device model, when available.
7. Current network technology displayed by the device.
8. Whether 4G/LTE works.
9. Whether 5G works in another location.
10. Whether the problem is continuous or intermittent.
11. Whether the device supports the expected network technology.
12. Whether the account and SIM/eSIM are active and properly
    provisioned.
13. Whether a known outage exists.

## 4G/5G Availability vs Network Outage

### Network Technology Not Available

More likely when:

- 5G is unavailable only in a particular location.
- 4G/LTE continues to work normally.
- The provider does not advertise 5G coverage in the location.
- The device connects normally using another supported technology.

This is not necessarily an outage.

### Network Outage

More likely when:

- Previously available network service suddenly stops.
- Multiple customers are affected.
- Similar complaints occur in the same area and time period.
- Provider outage information supports the issue.

Route confirmed or suspected outages through:

`COV-01: Network Outage`

### Individual Device or Account Problem

More likely when:

- Other customers have normal 5G in the same location.
- The customer's device cannot connect to 5G anywhere.
- Another compatible device works normally.
- SIM/eSIM or account provisioning is incorrect.

Route to the appropriate Account/SIM or Mobile Service workflow.

## Geographic Analysis

The system should analyze:

- City
- State
- ZIP code
- Date
- Time
- Complaint category
- Complaint similarity
- Affected network technology

The system can identify geographic clusters of 4G/5G complaints.

Example:

Ticket 501
"No 5G around my neighborhood"
ZIP: 10001

Ticket 502
"5G keeps disappearing"
ZIP: 10001

Ticket 503
"5G not available in the same area"
ZIP: 10001

This may indicate a localized 5G availability or network issue.

The system should not automatically conclude that 5G should be available
at a specific location without authoritative coverage information.

## Troubleshooting Procedure

### 1. Identify Current Network Technology

Ask the customer to check what network technology the device currently
shows.

Examples:

- 5G
- 5G+
- 4G
- LTE
- Other provider-specific indicators

Device indicators vary by manufacturer.

### 2. Check 5G/Network Settings

When supported, verify that the device is configured to allow the
expected network technology.

Do not instruct the customer to change advanced settings unnecessarily.

### 3. Check Device Compatibility

Verify whether the device supports the provider's required network
technology and supported frequency bands.

Use authoritative provider or manufacturer information.

### 4. Check Another Location

If practical, ask the customer to test service in another nearby
location.

If 5G becomes available elsewhere, location-specific coverage becomes
more likely.

### 5. Check 4G/LTE Service

Determine whether 4G/LTE continues to provide service.

If 4G works while 5G is unavailable, this may indicate limited 5G
availability rather than a complete network outage.

### 6. Check SIM/eSIM and Account Status

If the device should support the expected network technology but cannot
connect, verify:

- Account status
- Mobile-line status
- SIM/eSIM status
- Provisioning status

### 7. Check Software and Carrier Settings

Check for applicable device software or carrier/network settings
updates.

Install supported updates when appropriate.

### 8. Check Provider Network Information

Check available:

- Coverage information
- Network-status information
- Maintenance information
- Known incidents

## Diagnosis Guidance

### 5G unavailable but 4G works

Possible causes:

- 5G not available in the location
- 5G coverage limitation
- Device configuration
- Device compatibility
- Temporary 5G network issue

Do not classify automatically as an outage.

### 5G works elsewhere

Possible causes:

- Location-specific coverage
- Indoor coverage
- Local network conditions
- Network availability

### 5G unavailable everywhere

Possible causes:

- Device compatibility
- Device configuration
- SIM/eSIM provisioning
- Account eligibility
- Device software
- Provider-side issue

Investigate the customer's device, account, and line before declaring a
network problem.

### 4G and 5G both unavailable

This is more likely to indicate:

- Network outage
- Account/SIM issue
- Device issue
- Local network problem

Use the appropriate troubleshooting and outage workflows.

### Device repeatedly switches between 4G and 5G

Network technology switching can occur when coverage or signal conditions
change.

Determine whether:

- The behavior occurs only in one location.
- Service quality is actually affected.
- Other customers experience the same behavior.
- A provider incident exists.

Do not automatically treat normal technology switching as a fault.

## Resolution

If 5G is not available in the customer's location:

- Explain that network technology availability varies by location.
- Provide available provider coverage information.
- Avoid promising future 5G availability.

If the issue is caused by device configuration:

- Guide the customer through supported settings.
- Verify connectivity after the change.

If the device or account is not compatible or provisioned for the
expected network technology:

- Route to the appropriate device, account, or SIM workflow.

If a confirmed network incident affects 4G/5G availability:

- Associate the complaint with the incident.
- Provide available provider status information.
- Avoid unnecessary troubleshooting.

## Escalation Conditions

Escalate when:

- 4G/5G service unexpectedly disappears from an area where it was
  previously available.
- Multiple customers report the same network-technology problem.
- A geographic cluster of complaints is detected.
- Provider coverage information conflicts with customer reports.
- A compatible device cannot access expected network technology despite
  correct account and SIM/eSIM status.
- Network engineering investigation may be required.
- A provider-side provisioning problem is suspected.
- The issue cannot be explained by device, account, SIM/eSIM, or known
  coverage limitations.

## Incident Information

A 4G/5G availability incident should contain:

- Incident ID
- Geographic area
- City
- State
- ZIP code or affected ZIP-code group
- Affected network technology
- Affected services
- First detected date/time
- Number of related complaints
- Complaint similarity
- Geographic concentration
- Temporal concentration
- Confidence level
- Current status
- Human confirmation status
- Related ticket IDs

## Confidence Levels

### Low

Few complaints or weak geographic/time correlation.

### Medium

Several similar complaints with clear geographic concentration.

### High

Strong geographic and temporal concentration with supporting provider
network information.

### Confirmed

Provider or authorized network operations confirms the issue.

## Human Agent Workflow

When a 4G/5G availability complaint is escalated:

1. Review the AI-generated summary.
2. Review related complaints.
3. Verify the affected location.
4. Check provider coverage information.
5. Check current network incidents.
6. Check maintenance information.
7. Verify device compatibility when relevant.
8. Verify account and SIM/eSIM provisioning when relevant.
9. Determine whether the issue is coverage, outage, provisioning, or
   device-related.
10. Escalate to network operations when required.
11. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer city
- State
- ZIP code
- Date
- Time
- General location
- Device model, when available
- Network technology affected
- Current network technology
- Affected service
- Complaint text
- Related ticket IDs
- Incident ID
- Coverage information
- Troubleshooting completed
- Escalation reason
- Final resolution

## Agent Guidance

Do not promise 5G availability at a location unless supported by
authoritative provider information.

Do not assume that a device showing 4G instead of 5G means there is a
network failure.

Do not classify normal switching between supported network technologies
as a fault without evidence of degraded service.

Do not expose internal network infrastructure information.

Do not request unnecessary precise location information.

Provider-specific coverage maps, supported devices, frequency bands,
network-technology policies, and rollout plans should be maintained
separately as provider-specific policy documents.

## Scalability Requirements

For a large network provider, the system should support automated
analysis of 4G/5G complaints across large geographic areas.

The architecture should support:

- Network-technology classification
- Geographic clustering
- ZIP-code aggregation
- Complaint similarity analysis
- Time-window analysis
- Coverage comparison
- Incident candidate creation
- Related-ticket association
- Confidence scoring
- Human confirmation
- Network operations escalation

The system should support large complaint volumes without requiring
agents to manually compare individual tickets.

## Example

Customer complaints:

Ticket 601
"My phone only shows LTE now."
ZIP: 10001
Time: 10:10

Ticket 602
"5G disappeared in my area."
ZIP: 10001
Time: 10:15

Ticket 603
"5G is not working around here."
ZIP: 10001
Time: 10:20

Ticket 604
"5G works normally when I travel downtown."
ZIP: 10003
Time: 10:30

The system detects:

- Similar 5G complaints
- Geographic concentration
- Similar time period
- 5G working normally in another location

AI assessment:

`POTENTIAL LOCAL 5G AVAILABILITY ISSUE`

Human action:

Review provider coverage and network information and determine whether
the issue is a coverage limitation or a network incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available wireless network and coverage-support practices from US
network providers and FCC consumer guidance.

Provider-specific coverage maps, supported devices, frequency bands,
network technology availability, rollout plans, incident information,
and escalation procedures should be maintained separately as
provider-specific policy documents.