# MOB-06: Mobile Service Escalation

## Category
Mobile Service

## Subcategory
Escalation

## Purpose

This article defines when a mobile-service complaint should be
transferred from automated support to a human agent or specialized
technical team.

The AI should resolve routine, well-understood issues when sufficient
information is available.

The AI must escalate when the issue requires carrier-side investigation,
account changes, provisioning, fraud investigation, manual intervention,
or a decision that cannot safely be made using the available
information.

## Mobile Service Issues Covered

This escalation workflow applies to:

- No mobile service
- Poor mobile signal
- Dropped calls
- Mobile data problems
- SMS or messaging problems

## When AI Can Handle the Complaint

The AI may provide an automated resolution when:

- The problem is clearly identified.
- Standard troubleshooting is available.
- The required information is available.
- The recommended action does not require human authorization.
- The issue can be resolved through normal device-level
  troubleshooting.
- No account-level investigation is required.
- No carrier-side technical investigation is required.

## When Human Escalation Is Required

### 1. Persistent Service Failure

Escalate when:

- Mobile service remains unavailable after standard troubleshooting.
- Calls continue to drop after troubleshooting.
- Mobile data remains unavailable after troubleshooting.
- SMS continues to fail after troubleshooting.
- The issue repeatedly returns after temporary recovery.

### 2. Carrier-Side Investigation Required

Escalate when:

- A network-side problem is suspected.
- A service outage is suspected but cannot be confirmed automatically.
- The customer's device and account appear normal but service remains
  unavailable.
- Multiple customers appear to experience the same problem.
- A geographic concentration of similar complaints suggests a potential
  network issue.

### 3. SIM/eSIM or Provisioning Problem

Escalate when:

- The SIM is not recognized.
- The eSIM appears incorrectly provisioned.
- The cellular line cannot be activated normally.
- Carrier-side provisioning appears incorrect.
- SIM replacement or carrier-side configuration is required.

### 4. Account or Service Restriction

Escalate when:

- The customer's account appears inactive.
- The mobile service has been restricted.
- A plan or service change requires manual investigation.
- The device or line appears blocked or barred.
- Account-level changes are required.

### 5. Device Hardware Problem

Escalate when:

- The device appears to have a hardware failure.
- Cellular connectivity fails across multiple locations despite normal
  account and SIM/eSIM status.
- The device repeatedly loses service after standard troubleshooting.

The AI should not diagnose a hardware failure with certainty unless
sufficient evidence exists.

### 6. Geographic Network Pattern

Escalate for network-level investigation when:

- Multiple similar complaints occur in the same geographic area.
- Complaints occur within a similar time period.
- The affected service type is similar.
- The pattern is significantly higher than the normal complaint level,
  when baseline information is available.

Geographic concentration is a signal for investigation, not proof of a
network fault.

## Geographic Escalation

Customer location fields may be used to identify potential network
patterns.

Relevant fields include:

- City
- State
- ZIP code
- Date
- Time

Example:

Customer complaints:

- Same ZIP code
- Similar mobile-service complaint
- Same afternoon
- Multiple customers

Potential interpretation:

Potential local network issue.

The system should flag the pattern for human/network review rather than
automatically declaring an outage.

## Escalation Priority

### High Priority

Consider high priority when:

- Complete mobile service loss is affecting multiple customers.
- A widespread network outage is suspected.
- Emergency or critical communication may be affected.
- A significant geographic cluster is detected.
- Suspected fraud or unauthorized account activity is involved.
- The issue has major service impact.

### Medium Priority

Consider medium priority when:

- Persistent individual service failure remains unresolved.
- SIM/eSIM provisioning requires investigation.
- Carrier-side technical diagnostics are required.
- Repeated dropped calls or mobile-data failures continue.

### Low Priority

Consider low priority when:

- The issue is isolated and non-critical.
- Standard troubleshooting has been exhausted but there is no immediate
  service-wide impact.
- Additional information is required before investigation.

Final priority should follow the provider's applicable operational
policies.

## Information Required Before Escalation

The AI should send the human agent:

- Ticket ID
- Original customer complaint
- Complaint category
- Complaint subcategory
- Customer city
- State
- ZIP code
- Date
- Time
- Services affected
- Device information, when available
- SIM/eSIM status, when available
- Signal information, when available
- Troubleshooting already performed
- Known outage information
- Previous complaint information
- AI diagnosis
- Reason for escalation
- Recommended next action

## AI Escalation Output

The AI should generate a structured escalation record.

### Decision

`ESCALATE`

### Category

Example:

`Mobile Service`

### Subcategory

Example:

`Dropped Calls`

### Priority

`LOW | MEDIUM | HIGH`

### Reason

A concise explanation of why human intervention is required.

### Customer Summary

A short summary of the customer's problem.

### Troubleshooting Completed

List the troubleshooting steps already attempted.

### AI Assessment

State the most likely category of problem without presenting an
uncertain diagnosis as fact.

### Recommended Action

State what the human agent should investigate next.

### Evidence

List relevant information from the complaint and knowledge base.

## Example Escalation

### Customer Complaint

"My calls keep dropping at home and my wife has the same problem. We
both use the same carrier and this started this morning."

### AI Decision

`ESCALATE`

### Priority

`HIGH`

### Reason

Multiple customers are experiencing similar dropped-call problems in
the same location and time period, indicating a possible local network
issue.

### AI Assessment

Potential local cellular network or coverage issue.

### Recommended Action

Review network status for the customer's geographic area and determine
whether a network incident is active.

## Human Agent Workflow

When a mobile-service complaint is escalated:

1. Review the AI-generated summary.
2. Review the original customer complaint.
3. Review troubleshooting already completed.
4. Verify account and service status.
5. Review available network/outage information.
6. Review geographic complaint patterns when available.
7. Perform carrier-side diagnostics when authorized.
8. Resolve the complaint if the cause is identified.
9. Request additional information when necessary.
10. Escalate to a specialized technical/network team if required.
11. Record the final resolution.

## Human Agent Actions

The human agent may:

- Resolve the complaint.
- Provide additional troubleshooting.
- Correct an account or service configuration.
- Initiate SIM/eSIM provisioning.
- Create a network investigation.
- Escalate to a network operations team.
- Request additional customer information.
- Mark the ticket as pending.
- Close the complaint after resolution.

## AI Limitations

The AI must not:

- Claim that a network outage exists without supporting evidence.
- Promise a specific restoration time without an authoritative source.
- Guarantee improved network coverage.
- Declare a device defective without sufficient evidence.
- Make account changes without authorization.
- Approve refunds or credits without the applicable process.
- Diagnose fraud with certainty.
- Request unnecessary sensitive account information.

## Regulatory Escalation

For US telecommunications service complaints, the FCC encourages
customers to contact their provider before filing an FCC complaint.

For qualifying service complaints submitted to the FCC, the complaint
may be served on the provider, and the provider is generally required
to respond in writing within 30 days.

The AI should not automatically direct every unresolved mobile-service
complaint to the FCC.

External regulatory escalation is a later option after the applicable
provider support process has been attempted.

## Agent Guidance

The purpose of escalation is to transfer useful context to a human
agent.

The customer should not have to repeat the entire troubleshooting
history simply because the AI could not resolve the issue.

The escalation record should contain:

- What happened
- What was checked
- What was ruled out
- What remains uncertain
- Why human intervention is required
- What the human agent should investigate next

## Source Basis

This article is a normalized knowledge article based on publicly
available information from:

- Federal Communications Commission (FCC) consumer complaint guidance
- FCC phone complaint issue classifications
- Verizon mobile troubleshooting documentation
- Public US wireless carrier support procedures

Provider-specific escalation queues, SLAs, restoration targets,
contact information, and internal network procedures should be
maintained separately as provider-specific policy documents.