from app.models.profile import FinancialProfile


def profile_metrics(profile: FinancialProfile) -> dict[str, float]:
    income = max(profile.monthly_gross_income + profile.additional_income, 1)
    debt_to_income_ratio = round(profile.total_emi_amount / income, 4)
    credit_utilization_proxy = round(profile.outstanding_balances / max(income * 2, 1), 4)
    affordability_index = round(max(0, income - profile.total_emi_amount) / income, 4)
    return {
        "debt_to_income_ratio": debt_to_income_ratio,
        "credit_utilization_proxy": credit_utilization_proxy,
        "affordability_index": affordability_index,
    }
