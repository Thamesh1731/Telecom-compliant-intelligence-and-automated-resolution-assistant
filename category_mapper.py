CATEGORY_MAP = {
    "Account / Subscription": "account_subscription",
    "Billing / Payment": "billing",
    "Cable / TV": "cable_tv",
    "Calling / SMS": "number_calling",
    "Customer Service": "customer_service",
    "Device / Handset": "device_handset",
    "Installation / Technician": "installation_technician",
    "Internet / Broadband": "internet",
    "Network / Outage": "coverage_outage",
    "Number Porting": "number_porting",
    "Plans / Recharge": "plans_recharge",
    "Roaming / International": "roaming",
    "SIM / Mobile Service": "sim_esim",
    "Security / Fraud": "security_fraud",
    "Speed / Performance": "internet",
}


def map_category(classifier_category):
    return CATEGORY_MAP.get(classifier_category)