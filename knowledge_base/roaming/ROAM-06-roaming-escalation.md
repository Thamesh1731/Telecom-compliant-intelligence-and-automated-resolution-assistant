# ROAM-06: Roaming Escalation

## Category
Roaming

## Subcategory
Roaming Issue Escalation

## Purpose

This article defines when a roaming complaint must be transferred from
automated support to a human agent, roaming specialist, billing team, or
network operations team.

The AI should resolve routine roaming questions when the issue is clearly
understood and authoritative provider information is available.

The AI must escalate when the issue requires account intervention,
billing review, partner-network investigation, incident confirmation,
manual provisioning, or other provider-side action.

## Issues Covered

This escalation workflow applies to:

- Roaming service unavailable
- International roaming problems
- Roaming data problems
- Roaming calls and SMS problems
- Roaming charges
- Destination-specific roaming incidents
- Partner-network problems
- Roaming provisioning problems
- Large-scale roaming incidents
- Disputed roaming charges

## When AI Can Handle the Complaint

The AI may resolve the complaint when:

- A confirmed provider incident already explains the problem.
- Authoritative roaming information is available.
- The customer only needs information about an existing roaming service.
- The issue can be resolved through standard troubleshooting.
- No account modification is required.
- No billing adjustment is required.
- No provider-side investigation is required.

The AI should provide approved information and associate the complaint
with an existing incident when supported.

## When Human Escalation Is Required

### 1. Roaming Service Failure

Escalate when:

- Roaming is enabled but the customer cannot connect to a supported
  partner network.
- Account and plan records indicate that roaming should work.
- SIM/eSIM provisioning appears incorrect.
- The destination is supported but roaming remains unavailable.
- Multiple customers report the same roaming failure.

### 2. Roaming Data Failure

Escalate when:

- Eligible roaming data remains unavailable after standard
  troubleshooting.
- Calls and SMS work but data consistently fails.
- Account records indicate that roaming data should work.
- Partner-network data failure is suspected.
- Multiple customers report the same data problem in a destination.

### 3. Roaming Calls or SMS Failure

Escalate when:

- Voice or SMS roaming is enabled but unavailable.
- The device is registered on a supported partner network.
- Calls or SMS consistently fail.
- Multiple customers report similar voice/SMS problems.
- Partner-network routing or compatibility problems are suspected.

### 4. Roaming Charge Dispute

Escalate when:

- The customer disputes recorded roaming usage.
- The charge does not match available pricing information.
- A roaming package appears to have been applied incorrectly.
- Duplicate charges are suspected.
- A billing adjustment is requested.
- Usage records conflict with billing records.
- A systemic billing issue is suspected.

Route billing-specific cases to the appropriate billing workflow when
required.

### 5. Destination-Specific Incident

Escalate when:

- Multiple customers report roaming problems in the same country.
- Similar complaints occur within a short time period.
- A partner-network outage is suspected.
- Provider roaming information conflicts with customer reports.
- A large number of customers appear to be affected.

## Incident Detection

The system should correlate roaming complaints using:

- Country
- City or region, when available
- Date
- Time
- Complaint category
- Complaint subcategory
- Complaint similarity
- Affected service
- Partner network, when available

Potential incident pattern:

Similar complaints
+
Same destination
+
Similar time
+
Same affected service
↓
Potential Roaming Incident
↓
Human confirmation
↓
Confirmed Roaming Incident

The AI must not automatically declare a confirmed incident solely from
customer complaints.

## Destination Clustering

Roaming complaints should be grouped by destination.

The system should support:

- Country-level aggregation
- City-level aggregation
- Region-level aggregation
- Partner-network aggregation
- Service-level aggregation
- Time-window analysis
- Complaint similarity

Example:

Destination: Germany

Ticket 2001
"No roaming service"

Ticket 2002
"Roaming data stopped working"

Ticket 2003
"Calls fail while roaming"

Ticket 2004
"Cannot connect to partner network"

Similar destination
+
Similar time
+
Multiple affected services
↓
Potential Roaming Incident

The clustering threshold should be configurable.

## Temporal Analysis

The system should consider when roaming complaints occur.

Examples:

- Multiple complaints within 15 minutes
- Increasing complaints within one hour
- Repeated complaints over several hours
- Complaints beginning after a provider or partner-network event

Time thresholds should be configurable.

The system should not use one fixed threshold for every provider,
country, or partner network.

## Incident Confidence

### Low

Few complaints or weak destination/time correlation.

### Medium

Several similar complaints with clear destination or temporal
concentration.

### High

Strong destination and temporal concentration with supporting provider
or partner-network information.

### Confirmed

Provider or authorized roaming/network operations personnel confirm the
incident.

## Escalation Priority

### High Priority

Consider high priority when:

- Large numbers of roaming customers are affected.
- Multiple services are unavailable.
- A major destination is affected.
- A confirmed partner-network outage is expanding.
- Customers cannot make emergency or critical communications.
- A widespread provider-side roaming failure is suspected.

### Medium Priority

Consider medium priority when:

- Multiple customers are affected in one destination.
- Persistent roaming data problems are reported.
- Voice/SMS roaming is unavailable.
- Manual account or provisioning intervention is required.
- A roaming incident requires specialist investigation.

### Low Priority

Consider low priority when:

- The issue is isolated.
- No immediate widespread service impact exists.
- Additional information is required.
- The problem appears to be a plan or destination limitation.

Final priority should follow provider operational policies.

## Billing Escalation

Roaming charge complaints should be separated from technical roaming
incidents.

The system should distinguish:

TECHNICAL ROAMING ISSUE

from:

ROAMING BILLING ISSUE

Technical examples:

- Cannot connect to network
- Data unavailable
- Calls fail

Billing examples:

- Unexpected roaming charge
- Incorrect package application
- Disputed usage
- Duplicate charge

Billing issues should be routed to the appropriate billing process when
manual financial review is required.

## Information Required Before Escalation

The AI should provide the human agent with:

- Ticket ID
- Original customer complaint
- Complaint category
- Complaint subcategory
- Roaming country
- City or region, when available
- Date
- Time
- Affected service
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Plan eligibility
- Destination support
- Network registration status
- Partner network, when available
- Data allowance, when applicable
- Usage information, when applicable
- Related ticket IDs
- Existing incident ID
- Provider incident information
- Troubleshooting completed
- AI assessment
- Incident confidence
- Escalation reason
- Recommended next action

Do not include unnecessary passwords, authentication codes, payment
credentials, or security information.

## AI Escalation Output

The system should generate a structured escalation record.

### Decision

ESCALATE

### Category

Roaming

### Subcategory

Example: Potential Destination-Specific Roaming Incident

### Priority

LOW | MEDIUM | HIGH

### Incident Status

POTENTIAL | CONFIRMED | UNKNOWN

### Reason

A concise explanation of why human intervention is required.

### Customer Summary

A short summary of the customer's reported issue.

### Destination Summary

Include:

- Country
- City/region
- Partner network, when available

### Service Summary

Include:

- Voice
- SMS
- Mobile data
- Multiple services

### Related Complaints

List relevant ticket IDs.

### AI Assessment

State the likely issue without presenting uncertain conclusions as facts.

### Recommended Action

State what the human agent, roaming specialist, billing team, or
network operations team should investigate next.

## Example Technical Escalation

### Customer Complaint

"I have roaming enabled and my plan supports Germany, but my phone has
no service after I arrived."

### AI Decision

ESCALATE

### Priority

MEDIUM

### Incident Status

POTENTIAL

### Reason

Customer is eligible for roaming and the destination is supported, but
the device cannot register on a supported partner network.

### AI Assessment

Potential roaming registration or partner-network issue.

### Recommended Action

Verify roaming provisioning, supported partner networks, and current
network status.

## Example Billing Escalation

### Customer Complaint

"I had an active roaming package but received an unexpected data charge."

### AI Decision

ESCALATE

### Priority

MEDIUM

### Incident Status

UNKNOWN

### Reason

The customer disputes the charge and the final billing decision
requires verification of usage records and package rules.

### AI Assessment

Potential roaming billing discrepancy.

### Recommended Action

Verify usage records, package activation time, included allowance, and
applicable provider pricing.

## Human Agent Workflow

When a roaming complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Verify the account and mobile line.
4. Verify roaming eligibility.
5. Verify destination support.
6. Verify the affected service.
7. Check SIM/eSIM provisioning.
8. Check device compatibility when relevant.
9. Check partner-network information.
10. Check current roaming incidents.
11. Review related complaints.
12. Determine whether the issue is individual or systemic.
13. Perform authorized corrective action.
14. Associate the ticket with an existing incident when appropriate.
15. Escalate to the appropriate specialist when required.
16. Record the final outcome.

## Human Agent Actions

The human agent may:

- Verify roaming eligibility.
- Correct authorized account settings.
- Correct authorized SIM/eSIM provisioning.
- Associate tickets with an existing incident.
- Confirm a roaming incident.
- Reject a false incident candidate.
- Provide approved roaming information.
- Initiate a billing review.
- Apply authorized billing corrections.
- Escalate to roaming specialists.
- Escalate to network operations.
- Escalate to network engineering.
- Mark tickets as resolved or pending.

## AI Limitations

The AI must not:

- Invent roaming availability.
- Invent destination eligibility.
- Invent roaming prices or packages.
- Guarantee roaming service.
- Guarantee network restoration.
- Promise a specific restoration time without authoritative information.
- Approve refunds or credits without authorization.
- Declare a roaming incident without sufficient evidence.
- Expose internal partner-network agreements.
- Expose internal network infrastructure information.
- Modify account or SIM settings without an authorized process.
- Treat every destination-based complaint cluster as a confirmed
  incident.

## Duplicate Incident Prevention

Before creating a new roaming incident, the system should check
whether an existing incident covers:

- The same country
- The same region
- The same affected service
- The same partner network, when known
- A similar time period
- Similar complaint symptoms

If a matching incident exists:

ASSOCIATE TICKET WITH EXISTING INCIDENT

instead of creating a duplicate incident.

## Incident Lifecycle

A roaming incident should follow a controlled lifecycle:

POTENTIAL
↓
UNDER REVIEW
↓
CONFIRMED
↓
IN PROGRESS
↓
MONITORING
↓
RESOLVED

Alternative path:

POTENTIAL
↓
REJECTED

The exact lifecycle can be configured according to provider operations.

## Scalability Requirements

For a large network provider, the system must support potentially
thousands or millions of roaming complaints.

The architecture should support:

- Automated roaming classification
- Destination clustering
- Geographic aggregation
- Temporal aggregation
- Semantic complaint similarity
- Partner-network correlation
- Incident candidate generation
- Duplicate incident prevention
- Related-ticket association
- Configurable thresholds
- Incident confidence scoring
- Human confirmation
- Roaming-team escalation
- Billing-team escalation
- Network operations escalation
- Incident lifecycle management
- Large numbers of concurrent incidents
- Horizontal scaling of AI and processing services

Human agents should handle incidents and exceptions rather than
manually comparing every individual roaming complaint.

## Example Large-Scale Workflow

Customer Complaints
↓
AI Classification
↓
Roaming Destination Detection
↓
Complaint Similarity
↓
Destination + Temporal Analysis
↓
Potential Incident Detection
↓
Existing Incident Check
↓
YES → Associate Ticket With Existing Incident
NO → Create Potential Incident
↓
Human Review
↓
Confirm / Reject
↓
Roaming or Network Operations
↓
Incident Resolution
↓
Related Tickets Updated

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Roaming country
- City/region
- Date
- Time
- Affected service
- Device type, when available
- SIM/eSIM type
- Roaming eligibility
- Plan eligibility
- Destination support
- Partner network, when available
- Network registration status
- Usage information, when applicable
- Billing information, when applicable
- Related ticket IDs
- Incident ID
- Incident status
- Incident confidence
- Troubleshooting completed
- Escalation reason
- Final action
- Final resolution

## Agent Guidance

Do not process every roaming complaint as a separate incident when
multiple complaints clearly belong to the same incident.

Do not declare a roaming incident solely because several customers are
traveling in the same country.

Use complaint similarity, destination concentration, temporal
concentration, affected service, and authoritative provider information
together.

Do not promise restoration times without an authorized provider source.

Do not expose internal partner-network or network infrastructure
information to customers.

Do not request unnecessary personal or location information.

Do not create duplicate incidents when an existing incident already
covers the same problem.

Separate technical roaming problems from billing disputes.

Provider-specific roaming destinations, partner networks, pricing,
plans, allowances, incident thresholds, escalation queues, SLAs,
billing policies, network monitoring systems, and customer
communication policies should be maintained separately as
provider-specific policy documents.

## Example Routing

### Roaming Service Failure

Customer Complaint
↓
Roaming Eligibility Check
↓
Eligible?
↓
YES → Check Network Registration
NO → Explain Eligibility Limitation
↓
Network Available?
↓
YES → Check Service-Specific Problem
NO → Escalate Roaming Investigation

### Roaming Data Failure

Customer Complaint
↓
Check Roaming Eligibility
↓
Check Data Roaming Setting
↓
Check Data Allowance
↓
Check Partner Network
↓
Resolved?
↓
NO → Escalate

### Roaming Calls/SMS Failure

Customer Complaint
↓
Check Roaming Eligibility
↓
Check Network Registration
↓
Check Voice/SMS Availability
↓
Resolved?
↓
NO → Escalate

### Roaming Charge Dispute

Customer Complaint
↓
Identify Charge
↓
Check Usage Record
↓
Check Active Package
↓
Check Allowance
↓
Check Pricing
↓
Valid?
↓
YES → Explain Charge
NO / UNCERTAIN → Billing Review

## Source Basis

This article is a normalized knowledge article based on publicly
available international roaming, mobile service, billing, and
wireless-support practices from US network providers and FCC consumer
guidance.

Provider-specific roaming destinations, partner networks, pricing,
plans, allowances, billing rules, incident thresholds, network
monitoring systems, escalation procedures, SLAs, and customer
communication policies should be maintained separately as
provider-specific policy documents.


