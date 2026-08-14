# MOB-05: SMS / Text Messaging Problem

## Category
Mobile Service

## Subcategory
SMS / Text Messaging

## Problem
The customer reports that SMS or text messages cannot be sent,
cannot be received, are delayed, or are not functioning correctly.

## Common Symptoms

- Cannot send text messages
- Cannot receive text messages
- Messages are delayed
- Messages fail intermittently
- Messages work with some contacts but not others
- Group messages fail
- Picture or multimedia messages fail
- Messages fail while other mobile services continue working
- Messages are not received because device storage is full

## Possible Causes

- Weak or unavailable cellular service
- Temporary network problem
- Device messaging configuration
- Messaging application problem
- Blocked contact or number
- SIM/eSIM or cellular-line problem
- Device storage is full
- Outdated device software
- Network settings problem
- Carrier messaging-service problem
- Problem specific to one recipient or sender
- Group messaging configuration problem

## Initial Diagnosis

Determine:

1. Whether the customer cannot send, receive, or both.
2. Whether the problem affects all contacts or only specific contacts.
3. Whether SMS, MMS, and group messages are affected differently.
4. Whether calls and mobile data are working.
5. Whether the device has cellular service.
6. Whether the problem occurs continuously or intermittently.
7. Whether the messaging application displays an error.
8. Whether the device has sufficient available storage.

## Troubleshooting Procedure

### 1. Check Cellular Service

Verify that the device has an active cellular connection.

If the device has no cellular service, follow the appropriate
no-mobile-service workflow before troubleshooting SMS separately.

### 2. Restart the Device

Restart the mobile device.

After restarting, verify cellular service and attempt to send a test
message.

### 3. Test Mobile Connectivity

If appropriate, temporarily disconnect from Wi-Fi and verify that
cellular data and network connectivity are functioning.

If cellular connectivity is unavailable, investigate the underlying
mobile-service problem.

### 4. Check the Messaging Application

Verify that the correct messaging application is being used and that
its messaging features are enabled.

For devices supporting multiple messaging technologies, check the
relevant messaging settings.

### 5. Check Blocked Contacts

If messages fail only with a particular person or number, check whether
that contact or number has been blocked.

If appropriate, remove the block and test messaging again.

### 6. Check Device Storage

Check available device storage.

A device with insufficient storage may have problems receiving or
storing new messages.

Free storage when necessary and test messaging again.

### 7. Check Software Updates

Check for available device software updates.

Install applicable updates and test messaging again.

### 8. Check Network Settings

If standard troubleshooting does not resolve the issue, consider
resetting network settings when supported by the device and provider.

Warn the customer that resetting network settings may remove saved
network configurations.

### 9. Test Different Recipients

Send a test message to another contact.

If messages work with other contacts but fail with one recipient,
investigate a contact-specific or destination-related problem instead
of immediately treating it as a network outage.

### 10. Check Group Messaging

If only group messages fail:

- Verify group messaging is enabled.
- Check the relevant messaging settings.
- Test ordinary one-to-one SMS.
- Determine whether the problem occurs only with a specific group.

## Diagnosis Guidance

### Cannot send or receive any messages

Possible causes:

- No cellular service
- SIM/eSIM problem
- Account/service problem
- Messaging configuration
- Network-side messaging problem
- Device problem

### Cannot send but can receive

Possible causes:

- Outgoing messaging configuration
- Device messaging application
- Account/service restriction
- Network-side problem

### Can send but cannot receive

Possible causes:

- Device storage
- Messaging application
- Blocked contacts
- Network/service problem
- Device configuration

### Messages fail only with one contact

Possible causes:

- Incorrect number
- Blocked contact
- Recipient-side problem
- Destination network issue

Do not automatically classify this as a provider-wide problem.

### Group messages fail but individual SMS works

Investigate:

- Group messaging settings
- Messaging technology compatibility
- Messaging application configuration

### SMS fails while calls and mobile data work

The underlying cellular connection may be functional.

Investigate the messaging service, messaging settings, device
configuration, or carrier messaging system separately.

## Resolution

If the problem is caused by device settings, correct the applicable
setting and verify messaging with a test message.

If a blocked contact caused the problem, remove the block when
appropriate and retest.

If insufficient device storage caused the problem, free storage and
verify message delivery.

If restarting or reconnecting the device restores messaging, confirm
successful sending and receiving.

If the issue persists after standard troubleshooting, escalate for
technical investigation.

## Escalation Conditions

Escalate when:

- SMS remains unavailable after standard troubleshooting.
- Multiple messaging functions fail.
- Multiple customers appear to experience the same messaging problem.
- The issue persists across different locations.
- SIM/eSIM provisioning appears incorrect.
- Account or carrier-side investigation is required.
- Messages repeatedly fail despite normal cellular service.
- The problem cannot be resolved using available device-level
  troubleshooting.

## Agent Information to Record

Record:

- Ticket ID
- Customer city
- State
- ZIP code
- Whether sending or receiving is affected
- SMS/MMS/group messaging affected
- Affected contacts, without storing unnecessary personal information
- Cellular service status
- Signal condition
- Whether calls work
- Whether mobile data works
- Device storage condition
- Messaging settings checked
- Whether the device was restarted
- Whether network settings were reset
- Known outage status
- Troubleshooting completed
- Escalation reason

## Geographic Analysis

For network-level monitoring, aggregate similar SMS complaints by:

- City
- State
- ZIP code
- Date
- Time
- Complaint type

A sudden concentration of similar SMS complaints across a geographic
area may indicate a potential carrier-side messaging problem.

Geographic concentration alone is not proof of a network fault.

The system should consider:

- Number of complaints
- Geographic concentration
- Time concentration
- Whether calls are also affected
- Whether mobile data is also affected
- Known network incidents

before generating a network-level escalation.

## Agent Guidance

Do not assume every SMS failure is a carrier outage.

First distinguish between:

- Device problem
- Messaging application problem
- Blocked contact
- Storage problem
- SIM/eSIM problem
- Account/service problem
- Contact-specific problem
- Carrier/network problem

Do not request or store the content of private text messages unless
it is strictly necessary and authorized for the support process.

Do not promise a specific restoration time without an authoritative
provider source.

## Source Basis

This article is a normalized knowledge article based on publicly
available technical support guidance from:

- AT&T Wireless Support
- Verizon Wireless Support
- Federal Communications Commission (FCC) consumer guidance

Provider-specific messaging limits, retention periods, device menus,
and carrier-specific procedures have been excluded so that this
article can be used by a provider-neutral telecom complaint assistant.