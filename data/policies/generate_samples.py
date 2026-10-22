"""Generate sample policy PDFs for development and testing.

Run from the project root:
    python data/policies/generate_samples.py

Produces three sample PDFs that exercise the ingestion pipeline.
Replace these with real bank documents before going to production.
"""

import fitz  # PyMuPDF
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def write_pdf(path: Path, pages: list[str]) -> None:
    doc = fitz.open()
    for text in pages:
        page = doc.new_page(width=595, height=842)  # A4
        tw = fitz.TextWriter(page.rect)
        y = 72
        for line in text.split("\n"):
            if y > 770:
                break
            tw.append((72, y), line, fontsize=10)
            y += 14
        tw.write_text(page)
    doc.save(str(path))
    doc.close()
    print(f"  Created {path}")


def main() -> None:
    # --- MITC sample: HDFC Regalia ---
    hdfc_regalia = [
        # Page 1
        (
            "HDFC Bank Regalia Credit Card\n"
            "Most Important Terms and Conditions (MITC)\n"
            "\n"
            "1. Fees and Charges\n"
            "   Joining Fee: Rs 2,500 + GST (waived on annual spend of Rs 3,00,000)\n"
            "   Annual Fee: Rs 2,500 + GST (waived on annual spend of Rs 3,00,000)\n"
            "   Interest Rate: 3.49% per month (41.88% per annum)\n"
            "   Cash Advance Fee: 2.5% of amount (min Rs 500)\n"
            "   Late Payment Fee: Up to Rs 1,300 depending on statement balance\n"
            "   Over-limit Fee: 2.5% of over-limit amount (min Rs 500)\n"
            "\n"
            "2. Eligibility Criteria\n"
            "   Minimum Age: 21 years (primary), 18 years (add-on)\n"
            "   Minimum Income: Rs 12,00,000 per annum (salaried)\n"
            "                   Rs 15,00,000 per annum (self-employed)\n"
            "   Minimum CIBIL Score: 750\n"
            "   Employment: Salaried or Self-Employed Professional\n"
            "   Existing HDFC relationship preferred but not mandatory\n"
            "\n"
            "3. Reward Points\n"
            "   Earn Rate: 4 reward points per Rs 150 spent\n"
            "   Airport Lounge: 12 complimentary visits per year (domestic + international)\n"
            "   Milestone Benefit: 2,500 bonus points on spending Rs 5 lakhs in a year\n"
            "   Points Value: 1 point = Re 0.50 (at SmartBuy portal)\n"
        ),
        # Page 2
        (
            "4. Insurance Benefits\n"
            "   Air Accident Cover: Rs 1 crore\n"
            "   Emergency Overseas Hospitalization: Up to USD 25,000\n"
            "   Lost Card Liability Cover: Rs 5 lakhs\n"
            "\n"
            "5. Fuel Surcharge Waiver\n"
            "   1% fuel surcharge waiver on transactions between Rs 400 and Rs 5,000\n"
            "   Maximum waiver: Rs 250 per statement cycle\n"
            "\n"
            "6. Key Restrictions\n"
            "   Reward points NOT earned on: fuel, EMI, wallet loads, rent payments\n"
            "   Points expire after 2 years from the date of earning\n"
            "   Card upgrade to Infinia possible after 12 months of Rs 8 lakh annual spend\n"
            "\n"
            "7. Grievance Redressal\n"
            "   Level 1: Customer Care - 1800-202-6161\n"
            "   Level 2: Nodal Officer - nodalhead@hdfcbank.com\n"
            "   Level 3: Banking Ombudsman, Reserve Bank of India\n"
            "\n"
            "Disclaimer: This is a sample document for development purposes.\n"
        ),
    ]

    # --- Eligibility sample: ICICI Amazon Pay ---
    icici_amazon = [
        (
            "ICICI Bank Amazon Pay Credit Card\n"
            "Eligibility Criteria and Card Features\n"
            "\n"
            "Eligibility Requirements:\n"
            "  - Minimum age: 21 years\n"
            "  - Maximum age: 65 years (at the time of card expiry)\n"
            "  - Minimum annual income: Rs 3,00,000 (salaried)\n"
            "  - Minimum annual income: Rs 4,00,000 (self-employed)\n"
            "  - Minimum CIBIL score: 700\n"
            "  - Indian resident with valid KYC documents\n"
            "  - Active Amazon account required\n"
            "\n"
            "Card Features:\n"
            "  - Joining Fee: Nil (lifetime free)\n"
            "  - Annual Fee: Nil\n"
            "  - Reward Rate on Amazon.in: 5% cashback for Prime members,\n"
            "    3% for non-Prime\n"
            "  - Reward Rate on partner merchants: 2% cashback\n"
            "    (Swiggy, BookMyShow, Cleartrip)\n"
            "  - All other spending: 1% cashback\n"
            "  - Cashback credited as Amazon Pay balance\n"
            "\n"
            "Credit Limit Determination:\n"
            "  - Based on income, existing obligations, and credit history\n"
            "  - Typical range: Rs 50,000 to Rs 5,00,000\n"
            "  - Credit limit review every 6 months based on usage pattern\n"
            "  - Limit enhancement available on request after 6 months of card usage\n"
            "\n"
            "Application Process:\n"
            "  1. Apply through Amazon app or ICICI Bank website\n"
            "  2. Instant approval for pre-approved customers\n"
            "  3. KYC verification within 48 hours\n"
            "  4. Card delivered within 7-10 working days\n"
            "\n"
            "Disclaimer: This is a sample document for development purposes.\n"
        ),
    ]

    # --- RBI sample ---
    rbi_circular = [
        (
            "Reserve Bank of India\n"
            "Master Direction - Credit Card and Debit Card - Issuance and Conduct\n"
            "Directions, 2022 (Updated as on April 2024)\n"
            "\n"
            "Chapter I: Preliminary\n"
            "\n"
            "1. Short title and commencement\n"
            "   These Directions shall be called the 'Reserve Bank of India\n"
            "   (Credit Card and Debit Card - Issuance and Conduct) Directions, 2022'.\n"
            "\n"
            "2. Applicability\n"
            "   These directions shall apply to all scheduled commercial banks,\n"
            "   Regional Rural Banks, Local Area Banks, Small Finance Banks,\n"
            "   Payments Banks, Urban Cooperative Banks, State Cooperative Banks,\n"
            "   and Non-Banking Financial Companies (NBFCs).\n"
            "\n"
            "3. Issue of Credit Cards\n"
            "   a) Card issuers shall independently assess the credit risk and\n"
            "      should not encourage customers to avail credit beyond their\n"
            "      repayment capacity.\n"
            "   b) The total credit limit sanctioned by a card issuer to a customer\n"
            "      shall be assessed considering the customer's repayment capacity\n"
            "      based on verified income and existing debt obligations.\n"
            "   c) Unsolicited credit cards shall not be issued.\n"
            "   d) Issuers shall verify the identity of the applicant as per\n"
            "      KYC norms before issuing a credit card.\n"
        ),
        (
            "Chapter II: Card Operations\n"
            "\n"
            "4. Interest Rates and Other Charges\n"
            "   a) Interest rates charged on outstanding balances shall be\n"
            "      transparently disclosed on the card member agreement and\n"
            "      monthly statements.\n"
            "   b) Changes in interest rates and charges shall be communicated\n"
            "      to card holders at least one month prior to the effective date.\n"
            "   c) Penal charges for late payment shall be reasonable and\n"
            "      proportionate to the outstanding amount.\n"
            "\n"
            "5. Billing\n"
            "   a) The card issuer shall clearly indicate the 'Total Amount Due'\n"
            "      and the 'Minimum Amount Due' in the monthly statement.\n"
            "   b) The annualized interest rate charged on revolving credit shall\n"
            "      be prominently displayed on the first page of the statement.\n"
            "   c) A minimum of 15 days shall be given to the card holder to\n"
            "      make the payment from the date of the statement.\n"
            "\n"
            "6. Closure of Credit Card Account\n"
            "   a) Credit card account shall be closed within 7 working days of\n"
            "      receiving the request from the card holder, provided there are\n"
            "      no outstanding dues.\n"
            "   b) Any credit balance in the card account at the time of closure\n"
            "      shall be refunded to the card holder within 7 working days.\n"
            "\n"
            "7. Grievance Redressal\n"
            "   a) All card issuers shall have a grievance redressal mechanism.\n"
            "   b) Complaints shall be resolved within 30 days.\n"
            "   c) If not resolved, the card holder may approach the Banking\n"
            "      Ombudsman.\n"
            "\n"
            "Disclaimer: This is a sample document for development purposes.\n"
        ),
    ]

    print("Generating sample policy PDFs...")
    write_pdf(SCRIPT_DIR / "mitc" / "HDFC_Regalia.pdf", hdfc_regalia)
    write_pdf(SCRIPT_DIR / "eligibility" / "ICICI_Amazon_Pay.pdf", icici_amazon)
    write_pdf(SCRIPT_DIR / "rbi" / "RBI_Credit_Card_Directions_2022.pdf", rbi_circular)
    print("Done. 3 sample PDFs created.")


if __name__ == "__main__":
    main()
