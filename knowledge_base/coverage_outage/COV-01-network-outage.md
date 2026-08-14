# COV-01: Network Outage

## Category
Network Coverage & Outage

## Subcategory
Network Outage

## Problem

The customer reports that network service is unavailable or significantly
degraded in their area, potentially due to a provider-side network
outage.

## Common Symptoms

- Mobile service suddenly stops working
- Calls cannot be made or received
- SMS cannot be sent or received
- Mobile data stops working
- Internet service becomes unavailable
- Multiple customers in the same area experience similar problems
- Service works normally outside the affected area
- Service was working previously and suddenly stopped
- Customer reports a widespread local service disruption

## Possible Causes

- Temporary network outage
- Network equipment failure
- Backhaul or transport failure
- Power failure at network infrastructure
- Fiber or cable damage
- Planned maintenance
- Severe weather or environmental event
- Network congestion
- Regional network incident
- Configuration or software problem
- Third-party infrastructure failure

## Initial Diagnosis

Determine:

1. Which service is affected.
2. Customer city.
3. State.
4. ZIP code.
5. Date and time the problem started.
6. Whether the problem affects one customer or multiple customers.
7. Whether the problem occurs in one location or multiple locations.
8. Whether calls, SMS, mobile data, or Internet service are affected.
9. Whether the customer previously had normal service.
10. Whether a known provider outage exists in the area.

## Outage Detection

The system should first check available provider outage information.

Possible sources include:

- Provider outage-status system
- Network operations information
- Service-status dashboard
- Confirmed maintenance information
- Existing incident records

If a confirmed outage exists, the AI should not repeat unnecessary
device troubleshooting.

## Geographic Outage Detection

Customer complaints can be analyzed using:

- City
- State
- ZIP code
- Date
- Time
- Complaint category
- Complaint similarity

A potential outage pattern may appear when multiple customers report
similar problems in the same geographic area within a similar time
period.

Example:

Customer complaints
        ↓
Same ZIP / nearby ZIPs
        ↓
Similar complaint
        ↓
Similar time period
        ↓
Complaint concentration increases
        ↓
Potential network outage

A cluster does not automatically prove that an outage exists.

The system should classify it as:

`POTENTIAL NETWORK INCIDENT`

until confirmed by authoritative network information or a human agent.

## Individual Complaint vs Network Outage

### Individual Complaint

More likely when:

- Only one customer is affected.
- Other customers in the same area have normal service.
- The problem follows the customer's device.
- The issue is account-specific.
- SIM/eSIM problems are present.

Route to the relevant individual troubleshooting workflow.

### Potential Local Outage

More likely when:

- Multiple customers report the same problem.
- Complaints are geographically concentrated.
- Complaints occur within a short time period.
- Similar services are affected.

Generate a potential network incident for human review.

### Confirmed Outage

A confirmed outage requires authoritative provider information or
confirmation from an authorized human/network operations team.

The AI must not declare an outage solely from customer complaints.

## Troubleshooting

If no outage is confirmed, the AI may perform basic troubleshooting
appropriate to the affected service.

Examples:

- Check device connectivity.
- Check SIM/eSIM status.
- Check network signal.
- Restart the device.
- Check whether the problem occurs in another location.

Do not perform unnecessary troubleshooting when a confirmed outage
already explains the complaint.

## Resolution

If a confirmed outage exists:

- Inform the customer that a network issue is affecting the reported
  area.
- Provide the available provider status information.
- Associate the complaint with the existing incident when possible.
- Avoid requesting unnecessary troubleshooting.

If no outage is confirmed:

- Continue normal service troubleshooting.
- Escalate when the problem remains unresolved.

## Escalation Conditions

Escalate when:

- Multiple customers report similar service failures in the same area.
- A potential outage cluster is detected.
- A confirmed outage requires human communication or case management.
- Network-side investigation is required.
- The outage status is unclear but complaint volume is increasing.
- The issue affects a large geographic area.
- The provider's outage system and customer complaints disagree.
- The incident appears to be expanding geographically.

## Incident Correlation

When multiple complaints appear related, the system should attempt to
associate them with a common incident.

Example:

Ticket 1001 ─┐
Ticket 1002 ─┤
Ticket 1003 ─┼──> Potential Incident
Ticket 1004 ─┤
Ticket 1005 ─┘

The incident should contain:

- Incident ID
- Affected service
- Geographic area
- First detected time
- Number of related complaints
- Complaint categories
- Current status
- Confidence level
- Human confirmation status

## Confidence Levels

### Low

Limited complaints or weak geographic/time correlation.

### Medium

Several similar complaints with clear geographic or temporal
concentration.

### High

Strong complaint concentration combined with supporting provider
network information.

### Confirmed

Provider or authorized network operations personnel confirm the
incident.

## Human Agent Workflow

When a potential outage is escalated:

1. Review the AI-generated incident summary.
2. Review related customer complaints.
3. Verify geographic concentration.
4. Check available outage information.
5. Check known maintenance or network incidents.
6. Determine whether the incident is genuine.
7. Associate related tickets with the incident.
8. Escalate to network operations when required.
9. Update the incident status.
10. Ensure affected customer tickets receive the appropriate response.

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
- Troubleshooting completed
- Related ticket IDs
- Potential incident ID
- Incident status
- Escalation reason

## Agent Guidance

Do not declare an outage based only on one complaint.

Do not tell customers that a network outage exists unless the provider
has confirmed it or the system has an authorized incident source.

Do not promise a restoration time unless an authoritative provider
source provides one.

Do not expose internal network infrastructure information to customers.

Do not create duplicate incidents when an existing confirmed incident
already covers the affected area.

## Scalability Requirements

For a large network provider, outage detection should not require a
human to manually compare every complaint.

The system should support:

- Automatic complaint clustering
- Geographic aggregation
- Time-window analysis
- Similarity detection
- Incident creation
- Related-ticket association
- Incident status updates
- Human confirmation
- Large numbers of simultaneous complaints

The architecture should allow multiple customers to be associated with
one network incident.

## Example

Customer complaints:

Ticket 101
"No mobile data since 10:30 AM"
ZIP: 10001

Ticket 102
"Calls and data stopped working"
ZIP: 10001

Ticket 103
"Cannot make calls"
ZIP: 10002

Ticket 104
"No network on my phone"
ZIP: 10001

The system detects:

- Similar service complaints
- Same geographic region
- Similar time period

AI assessment:

`POTENTIAL NETWORK INCIDENT`

Human action:

Review provider network status and confirm or reject the incident.

## Source Basis

This article is a normalized knowledge article based on publicly
available telecommunications outage and service-status practices from
US network providers and FCC consumer guidance.

Provider-specific outage systems, incident identifiers, restoration
estimates, internal network architecture, and escalation procedures
should be maintained separately as provider-specific policy documents.