# ACC-03: eSIM Problem

## Category
Account / SIM

## Subcategory
eSIM Activation, Transfer, or Connectivity Problem

## Problem

The customer reports that their eSIM cannot be activated, transferred,
downloaded, recognized, or used for mobile service.

## Common Symptoms

- eSIM activation fails
- eSIM cannot be downloaded
- eSIM QR code does not work
- eSIM profile is not installed
- eSIM shows as inactive
- eSIM is installed but cellular service is unavailable
- eSIM disappeared after a device reset
- Customer cannot transfer eSIM to a new device
- Customer cannot switch between physical SIM and eSIM
- Device reports an eSIM or cellular-plan error

## Possible Causes

- Device does not support eSIM
- Device is not compatible with the provider
- eSIM activation information is incorrect or expired
- QR code or activation method is invalid
- eSIM profile was already installed or used
- Carrier provisioning problem
- Account or mobile-line problem
- Device software problem
- Device is locked or otherwise restricted
- Poor Internet connection during eSIM setup
- Incorrect cellular settings
- Previous eSIM profile remains active or conflicts with the new profile

## Initial Diagnosis

Determine:

1. Whether the device supports eSIM.
2. Whether the device is compatible with the provider.
3. Whether the customer is activating a new eSIM or transferring an
   existing line.
4. Whether the eSIM profile has already been downloaded.
5. Whether the activation process displays an error.
6. Whether the eSIM appears in the device's cellular settings.
7. Whether the account and mobile line are active.
8. Whether the device has an Internet connection during setup.
9. Whether another SIM/eSIM is currently active on the device.

## Troubleshooting Procedure

### 1. Verify eSIM Support

Confirm that the customer's device supports eSIM.

Device and regional variants may differ, so use the device
manufacturer's or provider's current compatibility information.

### 2. Check Internet Connection

eSIM setup may require an Internet connection.

When supported:

- Connect to Wi-Fi.
- Retry the activation process.
- Ensure the connection remains available during setup.

### 3. Check Cellular Settings

Open the device's cellular/mobile-network settings and determine
whether the eSIM profile is:

- Installed
- Active
- Inactive
- Pending activation
- Missing

Do not delete an existing working eSIM merely as a troubleshooting
step unless the provider's procedure specifically requires it.

### 4. Restart the Device

Restart the device after installing or activating the eSIM.

Allow the device to reconnect to the cellular network.

### 5. Check Device Software

Check for applicable operating-system and carrier/network settings
updates.

Install supported updates when appropriate and retry activation.

### 6. Verify Activation Information

If the provider uses a QR code or activation code:

- Verify that the correct activation information is being used.
- Check whether the code has already been used.
- Verify that the activation information belongs to the intended mobile
  line.

Do not request or store activation credentials unnecessarily.

### 7. Verify Account and Mobile Line

Through authorized carrier systems, verify:

- Account status
- Mobile line status
- eSIM provisioning status
- Device association
- Activation status

### 8. Check Device Compatibility or Lock Status

If the eSIM profile installs but service cannot be activated, check
whether the device is compatible with the provider and whether any
device restrictions prevent activation.

Do not assume the device is carrier-locked without supporting
information.

## Diagnosis Guidance

### eSIM cannot be installed

Possible causes:

- Device does not support eSIM
- Incorrect activation information
- Invalid or previously used activation code
- Provider provisioning problem
- Device software issue

### eSIM is installed but inactive

Possible causes:

- Activation still processing
- Incorrect provisioning
- Account or line problem
- Device configuration problem

### eSIM is active but there is no cellular service

Do not automatically classify this as an eSIM installation problem.

If the device recognizes the eSIM but cannot connect to the network,
route the issue to the appropriate Mobile Service workflow.

### eSIM transfer to a new device fails

Check:

- New device compatibility
- Account and mobile-line status
- Transfer eligibility
- eSIM provisioning
- Previous device/eSIM status

Escalate if carrier-side transfer or provisioning is required.

### QR code or activation code does not work

Check whether:

- The code is correct.
- The code has already been used.
- The code belongs to the correct mobile line.
- The provider requires a new activation code.

Do not repeatedly attempt activation with an invalid or already-used
code.

## Resolution

The issue may be resolved by:

- Connecting the device to a suitable Internet connection.
- Correcting cellular settings.
- Installing supported software updates.
- Completing the provider's supported eSIM activation process.
- Installing the correct eSIM profile.
- Completing an authorized eSIM transfer.
- Correcting carrier-side provisioning.

After activation, verify:

- eSIM is active
- Cellular signal is available
- Calls work
- SMS works
- Mobile data works

## Escalation Conditions

Escalate when:

- The eSIM cannot be provisioned.
- Activation repeatedly fails with valid information.
- The eSIM profile is installed but the carrier cannot activate the mobile line.
- Account and eSIM records are inconsistent.
- eSIM transfer requires carrier-side intervention.
- The activation code appears invalid or already used and a new code must be issued.
- The device and account appear compatible but activation still fails.
- Multiple activation attempts fail.
- Manual account or line correction is required.

## Agent Information to Record

Record:

- Ticket ID
- Customer complaint
- Device model, when available
- eSIM support status
- Mobile line
- eSIM activation status
- Error message
- Activation method
- Account status
- Provisioning status
- Transfer status, when applicable
- Device software status
- Troubleshooting completed
- Action taken
- Escalation reason

Do not store:

- Full QR-code contents
- Activation credentials
- Account passwords
- Security codes
- Other unnecessary authentication information

## Agent Guidance

Do not tell the customer to delete a working eSIM without confirming
that the provider's recovery or replacement process is available.

Deleting an eSIM can remove the active cellular profile and may require
a new activation process.

Do not assume that installing an eSIM automatically activates service.

These are separate states:

eSIM profile installed
→ Profile exists on the device

eSIM activated
→ Carrier has activated the mobile line

Cellular service available
→ Device successfully connects to the mobile network

Do not promise a specific activation time unless the provider's current
policy confirms it.

Provider-specific eSIM compatibility, activation methods, transfer
rules, QR-code procedures, and supported devices should be maintained
separately in provider-specific policy documents.

## Example Scenarios

### Scenario 1: eSIM Installation Failed

Customer:

"My phone won't install the eSIM."

Action:

1. Verify device eSIM support.
2. Check Internet connection.
3. Verify activation information.
4. Check account and line status.
5. Retry supported activation.
6. Escalate if provisioning remains unsuccessful.

### Scenario 2: eSIM Installed but No Service

Customer:

"My eSIM is installed but I have no network."

Action:

Do not automatically classify this as an eSIM installation problem.

Verify the eSIM is active, then route the connectivity problem to the
appropriate Mobile Service workflow.

### Scenario 3: eSIM Transfer Failed

Customer:

"I moved to a new phone and my eSIM won't transfer."

Action:

1. Verify device compatibility.
2. Verify mobile-line status.
3. Check transfer eligibility.
4. Check eSIM provisioning.
5. Escalate if carrier-side transfer is required.

### Scenario 4: QR Code Already Used

Customer:

"My eSIM QR code says it can't be used."

Action:

1. Verify whether the eSIM was previously installed.
2. Verify the intended mobile line.
3. Follow the provider's process for obtaining replacement activation
   information.
4. Escalate when carrier-side action is required.

## Source Basis

This article is a normalized knowledge article based on publicly
available eSIM and wireless support guidance from:

- Apple Support
- Verizon Wireless Support
- AT&T Wireless Support
- T-Mobile Wireless Support

Provider-specific eSIM activation methods, QR-code procedures, transfer
rules, compatibility lists, and activation requirements have been
excluded so that this article remains provider-neutral.