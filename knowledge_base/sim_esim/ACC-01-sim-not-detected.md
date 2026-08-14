# ACC-01: SIM Card Not Detected

## Category
Account / SIM

## Subcategory
SIM Not Detected

## Problem

The customer reports that their mobile device does not detect, recognize,
or connect using the installed physical SIM card.

## Common Symptoms

- "No SIM" message
- "SIM not detected" message
- "Invalid SIM" message
- Device cannot connect to the mobile network
- SIM works intermittently
- Calls, SMS, and mobile data are unavailable
- SIM is detected after restarting but disappears again
- SIM works in another device but not the customer's device

## Possible Causes

- SIM card is not inserted correctly
- SIM card is damaged
- SIM tray or SIM slot problem
- SIM card is incompatible with the device
- SIM is inactive or not properly provisioned
- Device software problem
- Network configuration problem
- Device hardware problem
- SIM has been deactivated
- Carrier-side provisioning problem

## Initial Diagnosis

Determine:

1. Whether the device displays a SIM-related error.
2. Whether the SIM is physically installed.
3. Whether the device previously recognized the SIM.
4. Whether the problem started after changing devices.
5. Whether the SIM works in another compatible device, when available.
6. Whether another compatible SIM works in the customer's device, when
   available.
7. Whether calls, SMS, and mobile data are all affected.
8. Whether the customer's mobile account and line are active.

## Troubleshooting Procedure

### 1. Check SIM Installation

Verify that the physical SIM is correctly positioned in the SIM tray.

The SIM should be inserted according to the device manufacturer's
instructions.

Do not force the SIM or tray into the device.

### 2. Restart the Device

Restart the device.

After restarting, allow the device to initialize the SIM and connect
to the mobile network.

Check whether the SIM is detected.

### 3. Check SIM Status

Check the device's SIM or cellular settings.

Determine whether the device recognizes:

- SIM presence
- Mobile line
- Carrier information
- Cellular network

### 4. Inspect the SIM

When appropriate, inspect the physical SIM for:

- Visible damage
- Cracks
- Scratches
- Contamination
- Incorrect positioning

Do not use damaged SIM cards.

### 5. Test the SIM in Another Compatible Device

When practical and authorized, test the SIM in another compatible
device.

If the SIM is not detected in another compatible device, the SIM or
carrier provisioning may be the problem.

If the SIM works normally in another device, the original device or SIM
slot may require investigation.

### 6. Test Another Compatible SIM

When practical, test another known-working compatible SIM in the
customer's device.

If another SIM works normally, the original SIM may be faulty or
incorrectly provisioned.

If no SIM is detected, the device or SIM slot may be the problem.

### 7. Check Account and Line Status

Verify through authorized carrier systems that:

- The account is active.
- The mobile line is active.
- The SIM is associated with the correct line.
- The line has not been suspended or deactivated.
- The SIM is properly provisioned.

Account information must be verified through authorized carrier
systems.

### 8. Check Device Software

Check for applicable device software or carrier settings updates.

Install supported updates when appropriate and restart the device.

## Diagnosis Guidance

### SIM is not detected in any device

Possible causes:

- Damaged SIM
- Deactivated SIM
- Incorrect provisioning
- SIM compatibility problem

The SIM may require replacement or carrier-side investigation.

### SIM works in another device

Possible causes:

- Device SIM slot problem
- Device configuration problem
- Device software problem
- Device compatibility issue

Investigate the customer's device.

### Another SIM works in the customer's device

Possible causes:

- Original SIM failure
- Original SIM provisioning issue
- SIM compatibility problem

The original SIM may require replacement or carrier-side investigation.

### No SIM works in the customer's device

Possible causes:

- SIM slot problem
- Device hardware problem
- Device compatibility problem
- Device configuration problem

Escalation or device service may be required.

### SIM is detected but there is no cellular service

Do not automatically classify this as a SIM-detection problem.

If the device recognizes the SIM but cannot connect to the mobile
network, use the appropriate Mobile Service workflow.

## Resolution

If the SIM was incorrectly inserted, reinstall it correctly and test
the device.

If restarting the device restores SIM detection, verify that the SIM
remains stable after reconnection.

If the SIM is damaged or defective, follow the provider's SIM
replacement process.

If the SIM is not correctly provisioned, escalate to the appropriate
carrier support process.

If the device or SIM slot appears faulty, escalate for technical or
device support.

## Escalation Conditions

Escalate when:

- The SIM remains undetected after standard troubleshooting.
- The SIM is damaged or defective.
- SIM provisioning appears incorrect.
- The SIM works in another device but cannot be used correctly on the
  customer's device.
- No compatible SIM is detected by the customer's device.
- The mobile line or account status is inconsistent.
- SIM replacement is required.
- Carrier-side investigation is required.
- The problem repeatedly returns after temporary recovery.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Device type, when available
- SIM type
- SIM detection status
- Error message
- Mobile line
- Account status
- SIM provisioning status
- Whether the SIM was tested in another device
- Whether another SIM was tested in the device
- Device restart result
- Software/update status
- Troubleshooting completed
- Action taken
- Escalation reason

Do not store unnecessary authentication credentials or SIM security
credentials.

## Agent Guidance

Do not assume that a "No SIM" message means the SIM itself is defective.

First distinguish between:

- SIM installation problem
- SIM failure
- SIM provisioning problem
- Device problem
- SIM-slot problem
- Account/line problem

Do not ask the customer to repeatedly remove and insert the SIM.

Do not force the SIM tray or SIM card.

Do not promise that replacing the SIM will resolve the issue until the
cause has been reasonably established.

Provider-specific SIM replacement procedures, fees, activation
requirements, and supported devices should be maintained separately in
provider-specific policy documents.

## Example Scenarios

### Scenario 1: SIM Not Detected

Customer:

"My phone says No SIM."

Action:

1. Check SIM installation.
2. Restart the device.
3. Check SIM status.
4. Inspect the SIM.
5. Test another compatible device when available.
6. Escalate if the SIM remains undetected.

### Scenario 2: SIM Works in Another Phone

Customer:

"My SIM works in my old phone but not my new phone."

Action:

1. Verify device compatibility.
2. Check SIM slot and device configuration.
3. Check carrier provisioning.
4. Escalate if the device cannot recognize the SIM.

### Scenario 3: SIM Is Detected but No Service

Customer:

"My phone recognizes the SIM, but I have no network."

Action:

Do not continue using the SIM-detection workflow.

Route the complaint to the appropriate Mobile Service workflow.

## Source Basis

This article is a normalized knowledge article based on publicly
available technical support guidance from:

- Apple Support
- Verizon Wireless Support
- AT&T Wireless Support
- T-Mobile Wireless Support

Provider-specific SIM replacement procedures, fees, device
compatibility rules, and activation processes have been excluded so
that this article remains provider-neutral.