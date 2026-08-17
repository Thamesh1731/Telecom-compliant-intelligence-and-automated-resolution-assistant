import re
# URGENCY RULE ENGINE V2
# 1. EMERGENCY / SAFETY
EMERGENCY_PATTERNS = [
    r"\b911\b",
    r"\bemergency\b",
    r"\bemergencies\b",
    r"\bsafety\b",
    r"\bdangerous?\b",
    r"\blife[- ]?threatening\b",
    r"\bcannot call emergency services\b",
    r"\bcan't call emergency services\b",
    r"\bunable to call emergency services\b",
        r"\bon fire\b",
    r"\bdevice.*fire\b",
    r"\brouter.*fire\b",
    r"\bmodem.*fire\b",

    r"\boverheating\b",
    r"\boverheated\b",
    r"\boverheat\b",

    r"\bdevice.*overheat",
    r"\brouter.*overheat",
    r"\bmodem.*overheat",

    r"\bsmoke\b",
    r"\bsmoking\b",
    r"\b(device|router|modem|phone|mobile|charger|adapter|equipment).{0,30}\bburning\b",
    r"\bburning\b.{0,30}\b(device|router|modem|phone|mobile|charger|adapter|equipment)\b",

    r"\b(device|router|modem|phone|mobile|charger|adapter|equipment).{0,30}\bburnt\b",
    
    r"\bburnt\b.{0,30}\b(device|router|modem|phone|mobile|charger|adapter|equipment)\b",

    r"\bexplod(?:e|ed|ing|es)\b",
    r"\bexplosion\b",
    r"\bblasted\b",
    r"\bburst\b",
]
# 2. COMPLETE SERVICE FAILURE
SERVICE_FAILURE_PATTERNS = [
    # INTERNET / NETWORK DOWN
    r"\bno service\b",
    r"\bno internet\b",
    r"\bno internet connection\b",
    r"\bno network\b",
    r"\bno network connection\b",

    r"\binternet.*\bdown\b",
    r"\bnetwork.*\bdown\b",
    r"\bconnection.*\bdown\b",
    r"\bservice.*\bdown\b",

    r"\binternet outage\b",
    r"\bnetwork outage\b",
    r"\bservice outage\b",
    r"\boutage\b",
    r"\boutages\b",
    r"\b(?:network|internet|connection|service).*stopped working\b",
    r"\binternet problem\b",
    r"\bnetwork problem\b",
    r"\bconnection problem\b",
    r"\bservice problem\b",
    # SERVICE UNAVAILABLE
    r"\bservice.*unavailable\b",
    r"\binternet.*unavailable\b",
    r"\bnetwork.*unavailable\b",
    # CONNECTION FAILURE
    r"\bunable to connect\b",
    r"\bcannot connect\b",
    r"\bcan't connect\b",

    r"\bconnection.*fail(?:s|ed|ing|ure)?\b",
    r"\binternet.*fail(?:s|ed|ing|ure)?\b",
    r"\bnetwork.*fail(?:s|ed|ing|ure)?\b",
    # NOT WORKING
    r"\binternet.*not working\b",
    r"\bnetwork.*not working\b",
    r"\bservice.*not working\b",

    # Keep generic "not working" ONLY when it refers
    # to telecom/network/service context
    r"\b(?:internet|network|service|connection|wifi|wi-fi).*"
    r"\bdoes not work\b",

    r"\b(?:internet|network|service|connection|wifi|wi-fi).*"
    r"\bdoesn't work\b",
    # CALLING / PHONE SERVICE
    # Calling / phone service failures
    r"\bcannot make calls?\b",
    r"\bcan't make calls?\b",
    r"\bunable to make calls?\b",

    r"\bcannot make any calls?\b",
    r"\bcan't make any calls?\b",
    r"\bunable to make any calls?\b",

    r"\bcannot receive calls?\b",
    r"\bcan't receive calls?\b",
    r"\bunable to receive calls?\b",

    r"\bcannot receive any calls?\b",
    r"\bcan't receive any calls?\b",
    r"\bunable to receive any calls?\b",

    # Mobile data / data service failures
    r"\bmobile data stopped working\b",
    r"\bmobile data is not working\b",
    r"\bmobile data isn't working\b",
    r"\bmobile data not working\b",

    r"\bdata connection stopped working\b",
    r"\bdata connection is not working\b",
    r"\bdata connection isn't working\b",
    r"\bdata connection unavailable\b",

    r"\bno mobile data\b",
    r"\bmobile data unavailable\b",

    r"\bcall drops?\b",
    r"\bcall drop\b",

    r"\bkeeps disconnecting\b",
    r"\bkeeps dropping\b",

    r"\binternet.*disconnect",
    r"\bnetwork.*disconnect",
    r"\bservice.*disconnect",
    r"\bconnection.*disconnect",
]
# 3. NETWORK / INTERNET QUALITY
QUALITY_PATTERNS = [
    r"\bspeed\b",
    r"\bslow\b",
    r"\bslowness\b",

    r"\bpoor network\b",
    r"\bbad network\b",
    r"\bterrible network\b",

    r"\bpoor connection\b",
    r"\bbad connection\b",
    r"\bterrible connection\b",

    r"\bpoor service\b",
    r"\bbad service\b",
    r"\bterrible service\b",

    r"\bpoor quality\b",
    r"\bbad quality\b",
    r"\bpoor quality service\b",

    r"\bthrottl(?:e|ed|ing)\b",
    r"\bbandwidth\b",
    r"\bdata speed\b",

    r"\bslow internet\b",
    r"\bslow network\b",
    r"\bslow connection\b",

    r"\bspeed sucks\b",
    r"\bspeed is terrible\b",
    r"\bspeed is awful\b",

    r"\bbarely ever works\b",
    r"\bbarely works\b",

    r"\bnot as advertised\b",
    r"\bnot as promised\b",

    r"\bfluctuating\s+(?:speed|speeds|connection|service)\b",

    r"\bnetwork.*(?:bad|poor|terrible|slow|awful)\b",
    r"\binternet.*(?:bad|poor|terrible|slow|awful)\b",
    r"\bconnection.*(?:bad|poor|terrible|slow|awful)\b",

    r"\binternet speeds?\b",
    r"\bnetwork speeds?\b",
]
# 4. DATA CAP / DATA LIMIT
DATA_CAP_PATTERNS = [
    r"\bdata cap\b",
    r"\bdata caps\b",
    r"\bdata limit\b",
    r"\bdata limits\b",
    r"\bdata allowance\b",
    r"\bdata allowances\b",
    r"\bdata usage\b",
    r"\bdata plan\b",
    r"\bmonthly data\b",
    r"\b\d+\s*gb\b",
    r"\bbandwidth limit\b",
    r"\busage cap\b",
]
# 5. DURATION
DURATION_PATTERNS = [
    r"\b\d+\s*(?:minute|minutes)\b",
    r"\b\d+\s*(?:hour|hours)\b",
    r"\b\d+\s*(?:day|days)\b",
    r"\b\d+\s*(?:week|weeks)\b",
    r"\b\d+\s*(?:month|months)\b",
    r"\b\d+\s*(?:year|years)\b",

    r"\bsince yesterday\b",
    r"\bsince today\b",
    r"\bsince last night\b",
    r"\bsince last week\b",
    r"\bsince last month\b",

    r"\bfor a while\b",
    r"\bfor quite a while\b",
    r"\bfor some time\b",
    r"\bfor several days\b",
    r"\bfor several weeks\b",
    r"\bfor weeks\b",
    r"\bfor days\b",
    r"\bfor months\b",
    r"\bfor years\b",

        # Natural language durations
    r"\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+"
    r"(?:day|days|week|weeks|month|months|year|years)\b",

    r"\bfor\s+the\s+past\s+"
    r"(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+"
    r"(?:day|days|week|weeks|month|months|year|years)\b",

    r"\bfor\s+the\s+past\s+\d+\s+"
    r"(?:day|days|week|weeks|month|months|year|years)\b",
]
# 6. REPEATED SUPPORT
REPEATED_SUPPORT_PATTERNS = [

    # Explicit repeated support interactions
    r"\b\d+\s*(?:calls|attempts|appointments|visits)\b",

    r"\bmultiple\s+(?:calls|attempts|appointments|visits)\b",
    r"\bseveral\s+(?:calls|attempts|appointments|visits)\b",
    r"\brepeated\s+(?:calls|attempts|appointments|visits)\b",
    r"\bnumerous\s+(?:calls|attempts|appointments|visits)\b",

    # Explicit customer support contact
    r"\bcontacted support\b",
    r"\bcalled support\b",
    r"\bcontacted customer service\b",
    r"\bcalled customer service\b",

    # Previous support interactions
    r"\bprevious support contacts?\b",
    r"\bprevious calls?\b",

    # Repeated complaints
    r"\bmultiple complaints\b",
    r"\bprevious complaints\b",

    # Natural language support-contact patterns
    r"\bcomplained.*several times\b",
    r"\bcomplained.*multiple times\b",
    r"\bcontacted.*several times\b",
    r"\bcontacted.*multiple times\b",
]
# 7. UNRESOLVED / PERSISTENT
UNRESOLVED_PATTERNS = [
    r"\bstill not fixed\b",
    r"\bstill not working\b",
    r"\bstill unresolved\b",
    r"\bstill having\b",

    r"\bnot fixed\b",
    r"\bnot resolved\b",
    r"\bunresolved\b",

    r"\bongoing\b",
    r"\bcontinues\b",
    r"\bcontinued\b",
    r"\bcontinuing\b",

    r"\bkeeps happening\b",
    r"\bkeeps occurring\b",
    r"\bkeeps disconnecting\b",

    r"\bnobody fixed\b",
    r"\bnobody has fixed\b",

    r"\bhasn't fixed\b",
    r"\bhas not fixed\b",

    r"\bhasn't been fixed\b",
    r"\bhas not been fixed\b",

    r"\bunable to resolve\b",
    r"\bno resolution\b",

    r"\brefuses to help\b",
    r"\bwill not help\b",

    r"\brefusal to rectify\b",

    r"\bnobody helped\b",
    r"\bnobody has helped\b",
    r"\bnobody is helping\b",
    r"\bstill having this problem\b",
    r"\bstill have this problem\b",
    r"\bstill experiencing\b",
    r"\bissue remains\b",
    r"\bproblem remains\b",

    r"\bnobody has fixed\b",
    r"\bnobody fixed\b",
    r"\bnot fixed\b",
    r"\bstill not fixed\b",
    r"\bhasn't fixed\b",
    r"\bhas not fixed\b",
    r"\bnot resolved\b",
    r"\bstill unresolved\b",
]
# 8. BILLING / PAYMENT
BILLING_PATTERNS = [
    r"\bbill\b",
    r"\bbilling\b",
    r"\bbillingissues?\b",

    r"\bcharge\b",
    r"\bcharges\b",
    r"\bcharged\b",

    r"\bover billing\b",
    r"\boverbilling\b",
    r"\bovercharged\b",

    r"\bdouble billing\b",
    r"\bdouble billed\b",
    r"\bdouble bill\b",
    r"\bcharged twice\b",
    r"\bdouble charged\b",

    r"\bwrong bill\b",
    r"\bincorrect bill\b",
    r"\bimproper billing\b",

    r"\bbilling problem\b",
    r"\bbilling problems\b",
    r"\bbilling issue\b",
    r"\bbilling issues\b",

    r"\bwrong charge\b",
    r"\bincorrect charge\b",

    r"\bunauthorized charge\b",
    r"\bunauthorized changes?\b",

    r"\brefund\b",
    r"\bcredit back\b",
    r"\bcredit not processed\b",

    r"\bpayment problem\b",
    r"\bpayment issue\b",
    r"\bpayment.*doubled\b",

    r"\bdiscount\b",
    r"\bprice\b",
    r"\bpricing\b",
    r"\bprices\b",
    r"\bfees?\b",

    r"\bcharged after cancellation\b",
    r"\bbilling after service\b",
    r"\bcharged after service\b",

    r"\bunfair bill\b",
    r"\bunfair billing\b",
    r"\bbilling practices?\b",

    r"\bwill not honor discount\b",
    r"\bwont honor discount\b",
    r"\bwon't honor discount\b",

    r"\bbilled\b",
    r"\bbilling\b",
    r"\bcharged\b",
    r"\bcharge\b",
    r"\bbilled after\b",
    r"\bbilled.*cancel",
    r"\bcharged.*cancel",
    r"\bbilling.*cancel",
]
# 9. ACCOUNT / CONTRACT / CANCELLATION
ACCOUNT_PATTERNS = [
    r"\bcancel my account\b",
    r"\bcancel account\b",
    r"\bcancellation\b",
    r"\bcancelled\b",
    r"\bcanceled\b",

    r"\bwill not cancel\b",
    r"\bwont cancel\b",
    r"\bwon't cancel\b",
    r"\brefuses? to cancel\b",

    r"\btermination fee\b",
    r"\btermination fees\b",
    r"\bearly termination\b",

    r"\bcontract cancellation\b",
    r"\baccount cancellation\b",
    r"\bcontract\b",
    r"\brenewed contract\b",

    r"\bunauthorized account change\b",
    r"\bunauthorized changes?\b",

    r"\bwithout my permission\b",
    r"\bwithout my consent\b",
    r"\bwithout permission\b",
    r"\bwithout consent\b",

    r"\bservice termination\b",
    r"\binternet service termination\b",

    r"\baccount password\b",
    r"\bpassword.*account\b",
    r"\bpassword is not working\b",
    r"\bpassword.*not working\b",
    r"\bforgot.*password\b",
    r"\breset.*password\b",
]
# 10. SERIOUS / UNFAIR / DECEPTIVE COMPLAINT
SERIOUS_COMPLAINT_PATTERNS = [
    r"\bunfair\b",
    r"\bunfair practices?\b",

    r"\bfraud\b",
    r"\bfraudulent\b",
    r"\bfraudolent\b",

    r"\bscam\b",
    r"\bscam(?:ming|med)?\b",

    r"\bdeceptive\b",
    r"\bdeception\b",
    r"\bdeceptive business practices\b",

    r"\bbait and switch\b",

    r"\bbroken promises?\b",

    r"\brefusing to\b",
    r"\brefused to\b",
    r"\brefusal\b",

    r"\bwill not\b",
    r"\bwont\b",
    r"\bwon't\b",

    r"\bmonopoly\b",
    r"\bmonopolies\b",

    r"\btheft\b",
    r"\bthieves\b",
    r"\bcorporate theft\b",

    r"\bpoor customer service\b",
    r"\bdisrespectful customer service\b",

    r"\bforcing me\b",
]
# 11. ACCESS / AVAILABILITY
ACCESS_PATTERNS = [
    r"\binternet availability\b",
    r"\bservice availability\b",
    r"\bcable availability\b",

    r"\bnot available\b",
    r"\bunavailable\b",

    r"\brefusing to run lines\b",
    r"\bwont run lines\b",
    r"\bwon't run lines\b",

    r"\bcannot get service\b",
    r"\bcan't get service\b",

    r"\bemail access\b",
    r"\bemail acess\b",

    r"\bblocking\b",
    r"\bblocked\b",
   
    r"\bcannot access my account\b",
    r"\bcan't access my account\b",
    r"\bunable to access my account\b",
    r"\baccount access\b",
    r"\baccount login\b",
    r"\bcannot login\b",
    r"\bcan't login\b",
    r"\bunable to login\b",
]
# 12. SUPPORT / TECHNICAL ISSUE
SUPPORT_PATTERNS = [
    r"\btechnical support\b",
    r"\bcustomer service\b",
    r"\btech support\b",
    r"\bsupport issue\b",
    r"\bsupport problem\b",
]
# HELPER
def matches_any(text, patterns):

    return int(
        any(
            re.search(
                pattern,
                text,
                re.IGNORECASE
            )
            for pattern in patterns
        )
    )
# DESCRIPTION
def get_description(score):

    if score < -0.50:
        return "LOW"

    elif score < 0.25:
        return "NEUTRAL"

    else:
        return "HIGH"
# RULE ENGINE
def calculate_rule_urgency(
    complaint,
    status="Open"
):

    text = str(complaint).lower()
    # DETECT SIGNALS
    emergency = matches_any(
        text,
        EMERGENCY_PATTERNS
    )

    service_failure = matches_any(
        text,
        SERVICE_FAILURE_PATTERNS
    )

    quality_problem = matches_any(
        text,
        QUALITY_PATTERNS
    )

    data_cap = matches_any(
        text,
        DATA_CAP_PATTERNS
    )

    duration = matches_any(
        text,
        DURATION_PATTERNS
    )

    repeated_support = matches_any(
        text,
        REPEATED_SUPPORT_PATTERNS
    )

    unresolved = matches_any(
        text,
        UNRESOLVED_PATTERNS
    )

    billing = matches_any(
        text,
        BILLING_PATTERNS
    )

    account_problem = matches_any(
        text,
        ACCOUNT_PATTERNS
    )

    serious_complaint = matches_any(
        text,
        SERIOUS_COMPLAINT_PATTERNS
    )

    access_problem = matches_any(
        text,
        ACCESS_PATTERNS
    )

    support_problem = matches_any(
        text,
        SUPPORT_PATTERNS
    )

    active_case = int(
        str(status).lower()
        in ["open", "pending"]
    )
    # EMERGENCY
    if emergency:

        return {
            "rule_urgency": 1.0,
            "description": "CRITICAL",

            "signals": {
                "emergency": emergency,
                "service_failure": service_failure,
                "quality_problem": quality_problem,
                "data_cap": data_cap,
                "duration": duration,
                "repeated_support": repeated_support,
                "unresolved": unresolved,
                "billing": billing,
                "account_problem": account_problem,
                "serious_complaint": serious_complaint,
                "access_problem": access_problem,
                "support_problem": support_problem,
                "active_case": active_case
            }
        }
    # START FROM LOW
    score = 0.0

    meaningful_problem = any([
        service_failure,
        quality_problem,
        data_cap,
        duration,
        repeated_support,
        unresolved,
        billing,
        account_problem,
        serious_complaint,
        access_problem,
        support_problem
    ])
    # NO SIGNAL
    if not meaningful_problem:

        return {
            "rule_urgency": -0.70,
            "description": "LOW",

            "signals": {
                "emergency": emergency,
                "service_failure": service_failure,
                "quality_problem": quality_problem,
                "data_cap": data_cap,
                "duration": duration,
                "repeated_support": repeated_support,
                "unresolved": unresolved,
                "billing": billing,
                "account_problem": account_problem,
                "serious_complaint": serious_complaint,
                "access_problem": access_problem,
                "support_problem": support_problem,
                "active_case": active_case
            }
        }
    # BASE PROBLEM SCORES
    if service_failure:
        score += 0.50

    if quality_problem:
        score += 0.30

    if data_cap:
        score += 0.15

    if billing:
        score += 0.20

    if account_problem:
        score += 0.10

    if serious_complaint:
        score += 0.20

    if access_problem:
        score += 0.10

    if support_problem:
        score += 0.10
    # CONTEXT
    if duration:
        score += 0.20

    if repeated_support:
        score += 0.30

    if unresolved and not billing and not account_problem and not support_problem:
        score += 0.50
    # COMBINATION BONUSES
    if service_failure and duration:
        score += 0.10

    if service_failure and unresolved:
        score += 0.20

    if duration and unresolved:
        score += 0.05

    if repeated_support and unresolved:
        score += 0.05

    if repeated_support and duration:
        score += 0.05

    if billing and unresolved:
       score += 0.00

    if account_problem and unresolved:
        score += 0.10

    if serious_complaint and unresolved:
        score += 0.10

    if quality_problem and duration:
        score += 0.10

    if quality_problem and repeated_support:
        score += 0.10

    if quality_problem and duration and active_case:
        score += 0.05

    if data_cap and billing:
        score += 0.10
    # ACTIVE CASE
    if active_case:
        score += 0.02
    # CAP SCORE
    score = max(
        -1.0,
        min(1.0, score)
    )
    # DESCRIPTION
    description = get_description(score)
    # RETURN
    return {
        "rule_urgency": round(
            score,
            4
        ),

        "description": description,

        "signals": {
            "emergency": emergency,
            "service_failure": service_failure,
            "quality_problem": quality_problem,
            "data_cap": data_cap,
            "duration": duration,
            "repeated_support": repeated_support,
            "unresolved": unresolved,
            "billing": billing,
            "account_problem": account_problem,
            "serious_complaint": serious_complaint,
            "access_problem": access_problem,
            "support_problem": support_problem,
            "active_case": active_case
        }
    }
# TEST
if __name__ == "__main__":

    test_cases = [

        (
            "How can I change my Wi-Fi password?",
            "Open"
        ),

        (
            "My network speed is terrible",
            "Open"
        ),

        (
            "My network has been bad since last week",
            "Open"
        ),

        (
            "My internet has been down for 6 days and support hasn't fixed it",
            "Open"
        ),

        (
            "My internet has been down for 10 days and I contacted support 5 times",
            "Open"
        ),

        (
            "I cannot call 911 because my service is down",
            "Open"
        ),

        (
            "Comcast is double billing me and not processing my credit back to me",
            "Open"
        ),

        (
            "Poor Quality Service and Broken Promises",
            "Open"
        ),

        (
            "COMCAST WILL NOT CANCEL MY ACCOUNT",
            "Open"
        ),

        (
            "Comcast Internet Service Bad Quality",
            "Open"
        ),

        (
            "Fraudulent practice",
            "Open"
        ),

        (
            "Improper billing",
            "Open"
        ),

        (
            "Internet speeds are throttled",
            "Open"
        ),

        (
            "300GB/month Data Cap",
            "Open"
        ),

        (
            "Comcast wont honor discount, bill higher than agreed",
            "Open"
        ),

        (
            "Comcast Xfinity",
            "Open"
        )
    ]

    print("\n========================================")
    print("URGENCY RULE ENGINE V2")
    print("========================================")

    for complaint, status in test_cases:

        result = calculate_rule_urgency(
            complaint,
            status
        )

        print("\n----------------------------------------")
        print("Complaint:")
        print(complaint)

        print("Status:")
        print(status)

        print("\nRule Urgency:")
        print(result["rule_urgency"])

        print("\nDescription:")
        print(result["description"])

        print("\nSignals:")
        print(result["signals"])