# ML Training

The eligibility model is trained in [`../Notebook.ipynb`](../Notebook.ipynb),
which covers the pipeline described in the build plan:

- UCI Credit Approval dataset as the base, cleaned and relabelled
- synthetic Indian banking feature generation (CIBIL, salary bands, EMI,
  employment type, city tier)
- resampling to 5,000 rows with per-column noise
- feature engineering: debt-to-income, monthly surplus, credit history months,
  one-hot encoding of employment type and city tier, numeric standardisation
- XGBoost and LightGBM training under grid search, plus a soft-voting ensemble
- SHAP `TreeExplainer` for both models, with per-prediction explanations in
  real-world units
- serialized export into `../artifacts/`

This folder is reserved for extracting that notebook into runnable training
scripts once the pipeline stops changing shape.
