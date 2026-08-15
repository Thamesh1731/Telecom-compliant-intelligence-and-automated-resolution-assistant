# IT-01: Installation Request

## Category

installation_technician

## Subcategory

New Service Installation Request

## Problem

The customer wants to request installation of a telecom service or provider-supplied equipment at their location.

The request may involve a new service connection, installation of equipment, or arranging an initial technician visit.

## Example Customer Complaints

- "I want to get a new service installed."
- "I need an installation at my home."
- "Can someone come and install my connection?"
- "I need a technician to set up my service."
- "How can I request an installation?"
- "I ordered the service and need it installed."
- "I need my cable connection installed."
- "Can you arrange installation at my address?"

## AI Assessment

NEW SERVICE INSTALLATION REQUEST

The customer is requesting physical installation or technician assistance to establish a telecom service or install provider equipment.

## Recommended Human Action

Determine:

- Service requiring installation.
- Installation address or service location.
- Whether an order already exists.
- Whether the location is eligible for installation.
- Required equipment.
- Whether a technician visit is necessary.
- Any available appointment options.

## Information to Collect

Where applicable, collect:

- Customer account information.
- Service address.
- Requested service.
- Existing order or reference number.
- Contact information.
- Preferred appointment availability.
- Access requirements for the installation location.

## Human Action

The support agent should:

1. Verify the customer's account where required.
2. Identify the service being installed.
3. Check installation eligibility and service availability.
4. Confirm whether an existing order is present.
5. Create or update the installation request through the authorized system.
6. Arrange a technician appointment when required.
7. Provide the customer with the applicable request or appointment reference.

## Routing

Route to `cable_tv` when the request specifically concerns cable television service.

Route to `device_handset` when the request concerns device setup rather than physical service installation.

Route to `account_subscription` when the customer is only asking about subscription eligibility or activation without requiring installation.

## Escalation

Escalate when:

- Installation eligibility cannot be determined.
- The service requires a site assessment.
- The installation requires specialist equipment.
- The requested location has an infrastructure limitation.
- The installation request cannot be created through the standard process.
- The customer has an existing installation order with unresolved issues.

## Important Notes

Do not promise installation dates or technician availability unless confirmed by the authorized scheduling system.

Do not assume that a service is available at a location without checking applicable service availability.

Do not provide unsupported installation fees, requirements, or appointment times.

## Source Basis

This knowledge article is based on standardized telecom installation workflows for handling new service installation requests, verifying service availability, collecting installation information, creating technician requests, scheduling visits, and escalating cases requiring site assessment or specialist intervention.