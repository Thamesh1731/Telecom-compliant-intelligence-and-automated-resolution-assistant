# COV-03: Local Network Issue

## Category
Network Coverage & Outage

## Subcategory
Localized Network Problem

## Problem

The customer reports a network problem that appears to be limited to a
specific geographic location, while no confirmed provider-wide outage
has been identified.

The issue may affect a neighborhood, building, street, facility, or
small geographic area.

## Common Symptoms

- Network service is unavailable at a specific location
- Calls fail only in one area
- Calls frequently drop in one area
- Mobile data becomes unavailable in one area
- Mobile data becomes significantly slower in one area
- Signal disappears in a particular building or location
- Service works normally outside the affected area
- Multiple customers report similar problems nearby
- Problem occurs repeatedly at the same location
- Network quality changes significantly within a small geographic area

## Possible Causes

- Local network equipment problem
- Small-area network outage
- Local coverage gap
- Network congestion
- Backhaul or transport issue
- Fiber or cable damage
- Infrastructure maintenance
- Physical obstruction
- Indoor coverage limitation
- Local interference
- Network configuration problem
- Temporary network degradation
- Third-party infrastructure problem

## Initial Diagnosis

Determine:

1. Customer city.
2. State.
3. ZIP code.
4. General location where the problem occurs.
5. Date and time the problem occurs.
6. Whether the issue is continuous or intermittent.
7. Which services are affected.
8. Whether the issue occurs indoors, outdoors, or both.
9. Whether the customer has normal service in another nearby location.
10. Whether other customers in the same area report similar problems.
11. Whether a known outage or maintenance event exists.
12. Whether the issue is limited to one device or affects multiple
    devices.

Do not request an exact residential address unless required by an
authorized provider workflow.

## Local Issue vs Individual Issue

### Individual Issue

More likely when:

- Only one customer is affected.
- Other nearby customers have normal service.
- The problem follows the customer's device.
- SIM/eSIM or account problems are present.
- Service works normally in the same location for other customers.

Route to the appropriate individual troubleshooting workflow.

### Local Network Issue

More likely when:

- Multiple customers are affected.
- Complaints are geographically concentrated.
- Complaints occur during a similar time period.
- Similar network services are affected.
- Customers report normal service outside the affected area.

Create or associate the complaints with a potential local network
incident.

### Confirmed Local Network Issue

A local network issue should only be treated as confirmed when supported
by:

- Provider network information
- Existing incident information
- Authorized network operations confirmation
- Other authoritative provider data

Customer complaints alone should not be treated as definitive proof
of a network fault.

## Geographic Analysis

The system should use available complaint metadata:

- City
- State
- ZIP code
- Date
- Time
- Complaint category
- Complaint similarity
- Affected service

The system should identify geographic and temporal concentration.

Example:

Ticket 301
ZIP 10001
"No service near my workplace"
10:05 AM

Ticket 302
ZIP 10001
"Calls keep dropping"
10:20 AM

Ticket 303
ZIP 10001
"Mobile data stopped working"
10:35 AM

Ticket 304
ZIP 10003
"Everything works normally"
10:40 AM

The pattern suggests a localized issue around ZIP 10001.

AI assessment:

`POTENTIAL LOCAL NETWORK INCIDENT`

## Local Incident Detection

A local incident may be generated when:

- Complaint similarity is high.
- Geographic concentration is high.
- Time concentration is high.
- The affected services are similar.
- The number of related complaints exceeds the configured threshold.

The threshold should be configurable rather than hard-coded.

Example:

similar complaints
        +
geographic proximity
        +
time proximity
        ↓
Local incident candidate

## Troubleshooting Procedure

### 1. Identify the Location

Determine the general location where the problem occurs.

Examples:

- Home
- Workplace
- Shopping area
- Campus
- Road
- Neighborhood
- Public facility

### 2. Check Whether the Problem Moves With the Customer

If practical, determine whether the customer experiences normal service
after moving to another nearby location.

If service immediately improves, a location-specific issue becomes more
likely.

### 3. Check Affected Services

Determine whether the problem affects:

- Voice calls
- SMS
- Mobile data
- All cellular services

### 4. Check Provider Incident Information

Check available provider outage and maintenance information.

If an existing incident covers the location, associate the complaint
with that incident rather than creating a duplicate incident.

### 5. Check Related Complaints

Search for complaints with:

- Similar wording
- Same category
- Same ZIP code
- Nearby ZIP codes
- Similar date/time

### 6. Rule Out Account and SIM Problems

If the complaint appears isolated to one customer, check:

- Account status
- Mobile-line status
- SIM/eSIM status
- Device/network configuration

Do not perform unnecessary account troubleshooting when a confirmed
local network incident already explains the complaint.

## Diagnosis Guidance

### Problem occurs only at one location

Possible causes:

- Local coverage limitation
- Local network issue
- Indoor coverage limitation
- Physical obstruction
- Local congestion

### Problem affects multiple customers nearby

A local network incident becomes more likely.

Use geographic and temporal clustering.

### Problem affects one customer but works elsewhere

Possible causes:

- Device issue
- SIM/eSIM issue
- Account issue
- Location-specific coverage limitation

Route to the appropriate workflow.

### Problem occurs across a large area

This may be a regional outage rather than a localized issue.

Route to:

`COV-01: Network Outage`

when the geographic scope is sufficiently broad.

### Problem occurs only inside one building

Possible causes include:

- Building materials
- Indoor coverage limitations
- Local signal attenuation
- Network availability inside the structure

Do not automatically classify this as a network outage.

## Resolution

If an existing local network incident is confirmed:

- Associate the customer complaint with the incident.
- Provide the available provider status information.
- Avoid unnecessary troubleshooting.
- Route the complaint according to the provider's incident process.

If no confirmed incident exists:

- Continue individual troubleshooting when appropriate.
- Record the location and symptoms.
- Create a potential local incident if complaint clustering supports
  it.
- Escalate for human/network review when required.

## Escalation Conditions

Escalate when:

- Multiple customers report similar problems in the same area.
- A local incident candidate is detected.
- Complaint volume is increasing rapidly.
- Provider status information conflicts with customer reports.
- Network engineering investigation may be required.
- The problem repeatedly occurs at the same location.
- A confirmed network issue requires human incident management.
- The issue cannot be explained by account, SIM, device, or known
  coverage limitations.
- The geographic scope appears to be expanding.

## Incident Information

A local network incident should contain:

- Incident ID
- Geographic area
- City
- State
- ZIP code or affected ZIP-code group
- Affected services
- First detected date/time
- Last detected date/time
- Number of related complaints
- Complaint similarity score
- Geographic concentration
- Temporal concentration
- Confidence level
- Current status
- Human confirmation status
- Related ticket IDs

## Confidence Levels

### Low

Few related complaints or weak geographic/time correlation.

### Medium

Several similar complaints with clear geographic concentration.

### High

Strong geographic and temporal concentration with supporting provider
network information.

### Confirmed

Provider or authorized network operations confirms the issue.

## Human Agent Workflow

When a local network issue is escalated:

1. Review the AI-generated incident summary.
2. Review related customer complaints.
3. Verify geographic concentration.
4. Check provider outage information.
5. Check scheduled maintenance.
6. Check existing network incidents.
7. Determine whether the issue is local or part of a larger incident.
8. Associate related tickets with the correct incident.
9. Escalate to network operations when required.
10. Update incident status.
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
- Affected service
- Complaint text
- Related ticket IDs
- Incident ID
- Incident status
- Troubleshooting completed
- Escalation reason
- Final resolution

## Agent Guidance

Do not declare a network incident based on a single complaint.

Do not claim that a local network issue has been confirmed unless
authoritative provider information or authorized human confirmation
supports the conclusion.

Do not promise a restoration time unless an authoritative provider
source provides one.

Do not expose internal network infrastructure information.

Do not create duplicate incidents when an existing incident covers the
same geographic area and service.

Do not request unnecessary precise location information.

## Scalability Requirements

For a large network provider, local issue detection should operate
automatically across large numbers of complaints.

The architecture should support:

- Geographic clustering
- ZIP-code aggregation
- Nearby-area correlation
- Complaint similarity analysis
- Time-window analysis
- Configurable incident thresholds
- Automatic incident candidates
- Related-ticket association
- Incident confidence scoring
- Human confirmation
- Incident status updates
- Network operations escalation

The system should allow thousands or millions of customer complaints
to be analyzed without requiring agents to manually compare every
ticket.

## Example

Customer complaints:

Ticket 401
"No service near my office"
ZIP: 10001
Time: 09:45

Ticket 402
"Calls keep dropping around the same area"
ZIP: 10001
Time: 10:05

Ticket 403
"Mobile data is extremely slow"
ZIP: 10001
Time: 10:15

Ticket 404
"My service works normally outside this area"
ZIP: 10003
Time: 10:20

The system detects:

- Similar network complaints
- Strong geographic concentration
- Similar time period
- Normal service reported outside the affected area

AI assessment:

`POTENTIAL LOCAL NETWORK INCIDENT`

Human action:

Review provider network information and determine whether the issue
should be confirmed and escalated to network operations.

## Source Basis

This article is a normalized knowledge article based on publicly
available telecommunications network-support and outage-management
practices from US network providers and FCC consumer guidance.

Provider-specific network monitoring systems, incident thresholds,
coverage maps, engineering procedures, restoration estimates, and
escalation processes should be maintained separately as
provider-specific policy documents.