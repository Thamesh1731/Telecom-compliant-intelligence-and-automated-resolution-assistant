# COV-02: Poor Network Coverage

## Category
Network Coverage & Outage

## Subcategory
Poor or Weak Network Coverage

## Problem

The customer reports weak, inconsistent, or unavailable network coverage
in a specific location, even though the provider does not have a
confirmed network outage.

## Common Symptoms

- Weak cellular signal
- One or two signal bars
- Calls frequently drop
- Calls have poor audio quality
- Mobile data is slow in a specific location
- Mobile data disconnects intermittently
- Network signal disappears indoors
- Network works outdoors but poorly indoors
- Network works in some areas but not others
- Customer reports a dead zone
- 4G/5G signal is unavailable in a specific area
- Service quality changes depending on location

## Possible Causes

- Limited network coverage
- Distance from network infrastructure
- Indoor signal attenuation
- Buildings or other physical obstructions
- Terrain
- Network congestion
- Local interference
- Device or antenna limitations
- SIM/eSIM provisioning problem
- Temporary network issue
- Network technology availability in the area
- Provider coverage limitations

## Initial Diagnosis

Determine:

1. Customer city.
2. State.
3. ZIP code.
4. Exact general area where the problem occurs.
5. Date and time when the problem occurs.
6. Whether the problem occurs indoors, outdoors, or both.
7. Which services are affected.
8. Whether calls, SMS, mobile data, or all services are affected.
9. Whether the problem occurs consistently or intermittently.
10. Whether the customer has normal service in another nearby location.
11. Whether other customers using the same provider experience the same
    problem in the area.
12. Whether a known outage exists.

Do not request an exact residential address unless it is required by an
authorized provider workflow.

## Coverage vs Outage

### Poor Coverage

More likely when:

- The problem consistently occurs in a specific location.
- Signal is weak rather than completely unavailable.
- Service improves after moving to another location.
- Other areas have normal service.
- No provider outage is confirmed.

### Network Outage

More likely when:

- Service suddenly stops working.
- Multiple customers are affected.
- Complaints are concentrated in the same area and time period.
- A provider outage is confirmed.

Route confirmed or suspected outage cases through:

`COV-01: Network Outage`

## Geographic Analysis

The complaint dataset contains:

- City
- State
- ZIP code
- Date
- Time

These fields can help identify recurring coverage problems.

Example:

Customer A
ZIP 10001
"Very weak signal at home"

Customer B
ZIP 10001
"Calls keep dropping"

Customer C
ZIP 10001
"Almost no mobile data signal"

Customer D
ZIP 10002
"Signal is normal"

This may indicate a localized coverage problem around ZIP 10001.

Geographic concentration alone does not prove a coverage deficiency.

The system should compare:

- Complaint count
- Complaint similarity
- ZIP-code concentration
- Time patterns
- Affected services
- Known network incidents

## Troubleshooting Procedure

### 1. Check Location

Determine where the problem occurs.

Ask whether the issue occurs:

- At home
- At work
- Inside buildings
- Outdoors
- On roads or highways
- In a specific public location
- Across a wider geographic area

### 2. Check Signal Conditions

Ask the customer to check the device's cellular signal indicator.

A weak signal can affect:

- Calls
- Mobile data
- SMS

Signal indicators are approximate and should not be treated as precise
network measurements.

### 3. Test in Another Nearby Location

If practical, ask the customer to move to another nearby location and
check whether service improves.

If service improves significantly, location-specific coverage may be
involved.

### 4. Check Whether All Services Are Affected

Determine whether the problem affects:

- Voice calls
- SMS
- Mobile data
- All cellular services

If only one service is affected, route to the relevant service
workflow when appropriate.

### 5. Check for a Known Outage

Before performing extensive troubleshooting, check available provider
outage information.

If an outage is confirmed, use the outage workflow.

### 6. Check SIM/eSIM and Account Status

If the problem occurs across multiple locations, verify:

- Account status
- Mobile-line status
- SIM/eSIM status
- Provisioning status

## Diagnosis Guidance

### Weak signal only in one location

Possible coverage limitation.

Check the provider's coverage information and existing complaints in
the area.

### Weak signal across many locations

Possible causes include:

- Device problem
- SIM/eSIM problem
- Account/provisioning problem
- Broader network issue

Route to the relevant workflow.

### Calls drop in one geographic area

Possible causes:

- Weak coverage
- Local network issue
- Network congestion
- Coverage gap

Check whether similar complaints exist in the same area.

### Mobile data is slow only in one area

Possible causes:

- Weak signal
- Network congestion
- Limited local coverage
- Technology availability

Do not automatically classify slow data as an outage.

### Indoor coverage is poor but outdoor coverage is normal

Buildings and physical structures can weaken radio signals.

This may be a coverage limitation rather than a provider outage.

## Resolution

If the issue is caused by known coverage limitations:

- Inform the customer that coverage may be limited in the reported
  location.
- Provide available provider coverage information.
- Record the complaint for network planning or coverage analysis when
  supported.

If the issue appears to be an individual account, SIM, or device
problem, route it to the appropriate workflow.

If multiple customers report similar poor coverage in the same area,
create or associate the complaints with a potential coverage incident.

## Escalation Conditions

Escalate when:

- Multiple customers report poor coverage in the same geographic area.
- A significant coverage gap is identified.
- Coverage complaints are increasing over time.
- The provider's coverage information conflicts with customer reports.
- Network engineering investigation may be required.
- The customer reports persistent service loss in an area that should
  have coverage.
- The issue cannot be explained by account, SIM, device, or known
  coverage limitations.
- A potential network incident is detected.

## Coverage Incident

When multiple complaints appear related, the system should create or
associate them with a coverage incident.

The incident should contain:

- Incident ID
- Geographic area
- City
- State
- ZIP code
- Affected services
- First detected date/time
- Number of related complaints
- Complaint similarity
- Current status
- Confidence level
- Human confirmation status

## Confidence Levels

### Low

One or very few complaints with limited geographic evidence.

### Medium

Several similar complaints concentrated in a geographic area.

### High

Large number of similar complaints with strong geographic
concentration and supporting network information.

### Confirmed

Provider/network operations confirms the coverage issue.

## Human Agent Workflow

When a coverage complaint is escalated:

1. Review the customer complaint.
2. Review the AI-generated summary.
3. Check customer location information.
4. Review related complaints.
5. Check provider coverage information.
6. Check known network incidents.
7. Determine whether the issue is isolated or geographically
   concentrated.
8. Determine whether network investigation is required.
9. Associate the ticket with an existing incident when appropriate.
10. Escalate to network operations when necessary.
11. Record the final outcome.

## Agent Information to Record

Record:

- Ticket ID
- Customer city
- State
- ZIP code
- Date
- Time
- Affected service
- Complaint text
- Indoor/outdoor condition
- Coverage observations
- Related ticket IDs
- Incident ID, when applicable
- Troubleshooting completed
- Escalation reason
- Final resolution

## Agent Guidance

Do not promise that network coverage will be improved at a specific
location or by a specific date.

Do not claim that an area has a coverage problem based solely on one
customer complaint.

Do not confuse poor coverage with a confirmed network outage.

Do not expose internal network infrastructure details.

Do not request unnecessary precise location information.

Provider-specific coverage maps, network expansion plans, engineering
procedures, and coverage commitments should be maintained separately as
provider-specific policy documents.

## Scalability Requirements

For a large network provider, the system should support automated
analysis of coverage complaints across large geographic areas.

The architecture should support:

- ZIP-code aggregation
- Geographic clustering
- Complaint similarity analysis
- Time-based trend analysis
- Coverage incident creation
- Related-ticket association
- Incident confidence scoring
- Human confirmation
- Network engineering escalation

The same architecture should support thousands or millions of
complaints without requiring agents to manually compare individual
tickets.

## Example

Customer complaints:

Ticket 201
"Very weak signal at my house"
ZIP: 10001

Ticket 202
"Calls keep dropping in my neighborhood"
ZIP: 10001

Ticket 203
"Mobile data barely works here"
ZIP: 10001

Ticket 204
"Network is completely fine downtown"
ZIP: 10003

The system detects:

- Similar complaints
- Geographic concentration
- Different location with normal service

AI assessment:

`POTENTIAL COVERAGE ISSUE`

Human action:

Review provider coverage information and determine whether network
engineering investigation is required.

## Source Basis

This article is a normalized knowledge article based on publicly
available wireless coverage and network-support practices from US
network providers and FCC consumer guidance.

Provider-specific coverage maps, network engineering processes,
coverage commitments, expansion plans, and escalation procedures should
be maintained separately as provider-specific policy documents.