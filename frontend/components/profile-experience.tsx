"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Edit3, Save, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProgressBar, Surface } from "@/components/product-ui";
import { profileSectionMeta, type FinancialProfile, type ProfileSectionId } from "@/data/profile.mock";

type Draft = Record<string, string | number>;
type SaveState = "idle" | "saving" | "error";
type FieldConfig = { name: string; label: string; type?: "number" | "text"; prefix?: string; suffix?: string; options?: string[]; help?: string };

const numberBetween = (minimum: number, maximum: number, message: string) => z.number({ invalid_type_error: message }).min(minimum, message).max(maximum, message);
const nonNegative = (message: string) => z.number({ invalid_type_error: message }).min(0, message);
const optionalScore = z.preprocess((value) => value === "" || Number.isNaN(value) ? null : value, numberBetween(300, 900, "Enter a value between 300 and 900.").nullable());

const schemas: Record<ProfileSectionId, z.ZodTypeAny> = {
  personal: z.object({ age: numberBetween(18, 70, "Enter an age between 18 and 70."), city: z.string().trim().min(2, "Enter your city."), employment: z.string().min(1, "Select an employment type."), employer: z.string().trim().min(2, "Enter your role and employer.") }),
  income: z.object({ monthlyGross: z.number({ invalid_type_error: "Enter your monthly gross income." }).positive("Monthly income must be greater than zero."), additionalMonthly: nonNegative("Additional income cannot be negative."), additionalIncomeType: z.string().min(1, "Select an income type.") }),
  credit: z.object({ score: optionalScore, source: z.string().min(1), historyYears: numberBetween(0, 50, "Enter credit history between 0 and 50 years."), historyMonths: numberBetween(0, 11, "Enter months between 0 and 11."), paymentHistory: numberBetween(0, 100, "Enter a percentage between 0 and 100."), utilization: numberBetween(0, 100, "Enter a percentage between 0 and 100.") }),
  obligations: z.object({ activeLoans: nonNegative("Loan count cannot be negative."), monthlyEmi: nonNegative("Monthly EMI cannot be negative."), cardsHeld: nonNegative("Card count cannot be negative."), outstandingBalance: nonNegative("Outstanding balance cannot be negative.") }),
  spending: z.object({ onlineShopping: nonNegative("Spending cannot be negative."), groceries: nonNegative("Spending cannot be negative."), fuel: nonNegative("Spending cannot be negative."), dining: nonNegative("Spending cannot be negative."), travel: nonNegative("Spending cannot be negative."), utilities: nonNegative("Spending cannot be negative."), entertainment: nonNegative("Spending cannot be negative."), other: nonNegative("Spending cannot be negative.") }),
  goals: z.object({ primary: z.string().min(1, "Select a primary goal."), secondary: z.string().min(1, "Select a secondary goal.") }).refine((value) => value.primary !== value.secondary, { message: "Choose a different secondary goal.", path: ["secondary"] })
};

const sectionFields: Record<ProfileSectionId, FieldConfig[]> = {
  personal: [
    { name: "age", label: "Age", type: "number" },
    { name: "city", label: "City" },
    { name: "employment", label: "Employment type", options: ["Salaried", "Self-employed", "Business owner", "Student"] },
    { name: "employer", label: "Role and employer", help: "Only include information you are comfortable using for assessment." }
  ],
  income: [
    { name: "monthlyGross", label: "Monthly gross income", type: "number", prefix: "₹" },
    { name: "additionalMonthly", label: "Additional monthly income", type: "number", prefix: "₹" },
    { name: "additionalIncomeType", label: "Additional income type", options: ["None", "Freelance", "Rent", "Business", "Other"] }
  ],
  credit: [
    { name: "score", label: "Credit score", type: "number", help: "You can continue without a score, but match confidence may be more limited." },
    { name: "source", label: "Score source", options: ["Self-reported", "From uploaded report"] },
    { name: "historyYears", label: "Credit history", type: "number", suffix: "years" },
    { name: "historyMonths", label: "Additional months", type: "number", suffix: "months" },
    { name: "paymentHistory", label: "On-time payments", type: "number", suffix: "%" },
    { name: "utilization", label: "Credit utilization", type: "number", suffix: "%" }
  ],
  obligations: [
    { name: "activeLoans", label: "Active loans", type: "number" },
    { name: "monthlyEmi", label: "Total monthly EMI", type: "number", prefix: "₹" },
    { name: "cardsHeld", label: "Cards currently held", type: "number" },
    { name: "outstandingBalance", label: "Outstanding card balance", type: "number", prefix: "₹" }
  ],
  spending: [
    { name: "onlineShopping", label: "Online shopping", type: "number", prefix: "₹" },
    { name: "groceries", label: "Groceries", type: "number", prefix: "₹" },
    { name: "fuel", label: "Fuel", type: "number", prefix: "₹" },
    { name: "dining", label: "Dining", type: "number", prefix: "₹" },
    { name: "travel", label: "Travel", type: "number", prefix: "₹" },
    { name: "utilities", label: "Utilities", type: "number", prefix: "₹" },
    { name: "entertainment", label: "Entertainment", type: "number", prefix: "₹" },
    { name: "other", label: "Other", type: "number", prefix: "₹" }
  ],
  goals: [
    { name: "primary", label: "Primary objective", options: ["Cashback", "Travel", "Fuel", "Dining", "Rewards", "Premium lifestyle"] },
    { name: "secondary", label: "Secondary objective", options: ["Cashback", "Travel", "Fuel", "Dining", "Rewards", "Premium lifestyle"] }
  ]
};

const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0, style: "currency", currency: "INR" }).format(value);
const spendingLabels: Array<[keyof NonNullable<FinancialProfile["spending"]>, string]> = [["onlineShopping", "Online shopping"], ["travel", "Travel"], ["groceries", "Groceries"], ["dining", "Dining"], ["utilities", "Utilities"], ["fuel", "Fuel"], ["entertainment", "Entertainment"], ["other", "Other"]];

function sectionIsComplete(profile: FinancialProfile, section: ProfileSectionId) {
  if (section === "spending") return profile.spending !== null;
  if (section === "credit") return profile.credit.score !== null;
  return true;
}

function sectionDefaults(profile: FinancialProfile, section: ProfileSectionId): Draft {
  if (section === "spending") return profile.spending ?? { onlineShopping: 0, groceries: 0, fuel: 0, dining: 0, travel: 0, utilities: 0, entertainment: 0, other: 0 };
  const values = { ...profile[section] } as Draft;
  if (section === "credit" && profile.credit.score === null) values.score = "";
  return values;
}

function ProfileValue({ label, value, detail, tone }: { label: string; value: string; detail?: string; tone?: "positive" | "caution" }) {
  return <div className="profile-value-row"><dt>{label}</dt><dd className={tone ? `profile-value-${tone}` : ""}>{value}</dd>{detail ? <small>{detail}</small> : null}</div>;
}

function ProfileSection({ id, title, complete, children, onEdit }: { id: ProfileSectionId; title: string; complete: boolean; children: React.ReactNode; onEdit: (section: ProfileSectionId) => void }) {
  return (
    <section className="profile-read-section" id={`profile-${id}`}>
      <header><div><h2>{title}</h2><span className={complete ? "section-complete" : "section-incomplete"}>{complete ? "Complete" : "Information missing"}</span></div><button className="profile-edit-action" onClick={() => onEdit(id)} type="button"><Edit3 aria-hidden="true" />{complete ? "Edit" : "Add"}</button></header>
      {children}
    </section>
  );
}

function ProfileDocument({ profile, onEdit }: { profile: FinancialProfile; onEdit: (section: ProfileSectionId) => void }) {
  const spendingTotal = profile.spending ? Object.values(profile.spending).reduce((sum, value) => sum + value, 0) : 0;
  const highestSpend = profile.spending ? Math.max(...Object.values(profile.spending), 1) : 1;
  return (
    <Surface className="profile-document">
      <ProfileSection complete id="personal" onEdit={onEdit} title="Personal">
        <dl className="profile-value-grid"><ProfileValue label="Age" value={`${profile.personal.age}`} /><ProfileValue label="City" value={profile.personal.city} /><ProfileValue label="Employment" value={profile.personal.employment} /><ProfileValue label="Role and employer" value={profile.personal.employer} /></dl>
      </ProfileSection>
      <ProfileSection complete id="income" onEdit={onEdit} title="Income">
        <p className="profile-section-context">Income helps estimate which card tiers may currently fit your profile.</p>
        <dl className="profile-value-grid"><ProfileValue label="Monthly gross income" value={formatINR(profile.income.monthlyGross)} /><ProfileValue label="Additional monthly income" value={formatINR(profile.income.additionalMonthly)} detail={profile.income.additionalIncomeType} /></dl>
      </ProfileSection>
      <ProfileSection complete={profile.credit.score !== null} id="credit" onEdit={onEdit} title="Credit">
        {profile.credit.score === null ? <div className="profile-missing"><strong>Credit score not provided</strong><p>You can continue without it, but match confidence may be more limited.</p></div> : <dl className="profile-value-grid"><ProfileValue label="Credit score" value={`${profile.credit.score}`} detail={profile.credit.source} /><ProfileValue label="Credit history" value={`${profile.credit.historyYears}y ${profile.credit.historyMonths}m`} /><ProfileValue label="Payment history" value={`${profile.credit.paymentHistory}% on time`} tone="positive" /><ProfileValue label="Credit utilization" value={`${profile.credit.utilization}%`} detail="Above the preferred 30% range" tone="caution" /></dl>}
      </ProfileSection>
      <ProfileSection complete id="obligations" onEdit={onEdit} title="Obligations">
        <dl className="profile-value-grid"><ProfileValue label="Active loans" value={`${profile.obligations.activeLoans}`} /><ProfileValue label="Total monthly EMI" value={formatINR(profile.obligations.monthlyEmi)} detail="Approximately 22% of monthly income" /><ProfileValue label="Cards currently held" value={`${profile.obligations.cardsHeld}`} /><ProfileValue label="Outstanding card balance" value={formatINR(profile.obligations.outstandingBalance)} /></dl>
      </ProfileSection>
      <ProfileSection complete={profile.spending !== null} id="spending" onEdit={onEdit} title="Spending">
        {profile.spending === null ? <div className="profile-missing"><strong>Not added yet</strong><p>Add your monthly spending to improve card-value estimates.</p><button className="text-action" onClick={() => onEdit("spending")} type="button">Add spending<ArrowRight aria-hidden="true" /></button></div> : <div className="spending-read-view"><div className="spending-breakdown">{spendingLabels.map(([key, label]) => <div key={key}><span>{label}</span><span className="spending-proportion"><i style={{ width: `${Math.max(3, (profile.spending![key] / highestSpend) * 100)}%` }} /></span><strong>{formatINR(profile.spending![key])}</strong></div>)}</div><div className="spending-total"><span>Total monthly spending</span><strong>{formatINR(spendingTotal)} <small>/ month</small></strong></div></div>}
      </ProfileSection>
      <ProfileSection complete id="goals" onEdit={onEdit} title="Primary goal">
        <div className="goal-read-view"><div><span>Primary</span><strong>{profile.goals.primary}</strong></div><div><span>Secondary</span><strong>{profile.goals.secondary}</strong></div><p>Used to prioritize card value and benefits, not eligibility rules.</p></div>
      </ProfileSection>
    </Surface>
  );
}

function ProfileEditor({ profile, section, initialValidationError, forceSaveFailure, onClose, onDirtyChange, onSaved }: { profile: FinancialProfile; section: ProfileSectionId; initialValidationError: boolean; forceSaveFailure: boolean; onClose: () => void; onDirtyChange: (dirty: boolean) => void; onSaved: (section: ProfileSectionId, values: Draft) => void }) {
  const meta = profileSectionMeta.find((item) => item.id === section)!;
  const defaults = sectionDefaults(profile, section);
  if (initialValidationError && section === "credit") defaults.score = 950;
  const { register, handleSubmit, setError, formState: { errors, isDirty } } = useForm<Draft>({ defaultValues: defaults });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);
  useEffect(() => {
    if (initialValidationError && section === "credit") setError("score", { message: "Enter a value between 300 and 900." });
  }, [initialValidationError, section, setError]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>("button, input, select, [href], [tabindex]:not([tabindex='-1'])");
    focusable[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || focusable.length < 2) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    dialog.addEventListener("keydown", handleKey);
    return () => dialog.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function submit(values: Draft) {
    setSaveState("idle");
    const result = schemas[section].safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => setError(String(issue.path[0]), { message: issue.message }));
      return;
    }
    setSaveState("saving");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (forceSaveFailure) { setSaveState("error"); return; }
    onSaved(section, result.data as Draft);
  }

  return (
    <div className="profile-editor-layer">
      <button aria-label="Close profile editor" className="profile-editor-scrim" onClick={onClose} type="button" />
      <aside aria-labelledby="profile-editor-title" aria-modal="true" className="profile-editor-drawer" ref={dialogRef} role="dialog">
        <form onSubmit={handleSubmit(submit)}>
          <header><div><p>{String(profileSectionMeta.findIndex((item) => item.id === section) + 1).padStart(2, "0")} / 06</p><h2 id="profile-editor-title">Edit {meta.label.toLowerCase()}</h2><span>{meta.summary}</span></div><button aria-label="Close editor" className="icon-button" onClick={onClose} type="button"><X /></button></header>
          <div className={`profile-editor-fields ${section === "spending" ? "profile-editor-spending" : ""}`}>
            {sectionFields[section].map((field) => {
              const error = errors[field.name]?.message;
              const inputId = `profile-${section}-${field.name}`;
              return <label className="profile-edit-field" htmlFor={inputId} key={field.name}><span>{field.label}</span>{field.options ? <select aria-describedby={error ? `${inputId}-error` : undefined} aria-invalid={Boolean(error)} id={inputId} {...register(field.name)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <span className="profile-edit-input">{field.prefix ? <i>{field.prefix}</i> : null}<input aria-describedby={error ? `${inputId}-error` : field.help ? `${inputId}-help` : undefined} aria-invalid={Boolean(error)} id={inputId} type={field.type ?? "text"} {...register(field.name, field.type === "number" ? { valueAsNumber: true } : undefined)} />{field.suffix ? <i>{field.suffix}</i> : null}</span>}{error ? <small className="field-error" id={`${inputId}-error`} role="alert">{String(error)}</small> : field.help ? <small id={`${inputId}-help`}>{field.help}</small> : null}</label>;
            })}
          </div>
          {saveState === "error" ? <div className="profile-save-error" role="alert"><CircleAlert aria-hidden="true" /><span><strong>Changes were not saved.</strong> Check your connection and try again.</span></div> : null}
          <footer><button className="button button-secondary button-app" onClick={onClose} type="button">Cancel</button><button className="button button-primary button-app" disabled={!isDirty || saveState === "saving"} type="submit"><Save aria-hidden="true" />{saveState === "saving" ? "Saving…" : "Save changes"}</button></footer>
        </form>
      </aside>
    </div>
  );
}

export function ProfileExperience({ initialProfile, initialEditor = null, forceSaveFailure = false, initialValidationError = false }: { initialProfile: FinancialProfile; initialEditor?: ProfileSectionId | null; forceSaveFailure?: boolean; initialValidationError?: boolean }) {
  const [profile, setProfile] = useState(initialProfile);
  const [editor, setEditor] = useState<ProfileSectionId | null>(initialEditor);
  const [dirty, setDirty] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const incompleteSection = profileSectionMeta.find((section) => !sectionIsComplete(profile, section.id));
  const summaryMessage = incompleteSection?.id === "spending" ? "Complete your spending profile to improve card-value estimates." : incompleteSection?.id === "credit" ? "Add a credit score to improve match confidence." : "All six profile sections are complete.";

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) { if (!dirty) return; event.preventDefault(); event.returnValue = ""; }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function closeEditor() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setDirty(false);
    setEditor(null);
  }

  function saveSection(section: ProfileSectionId, values: Draft) {
    setProfile((current) => {
      const wasComplete = sectionIsComplete(current, section);
      const next = { ...current, [section]: values } as FinancialProfile;
      const isNowComplete = sectionIsComplete(next, section);
      const completedSections = current.completedSections + (!wasComplete && isNowComplete ? 1 : 0);
      return { ...next, completedSections, completion: Math.round((completedSections / current.totalSections) * 100), updatedLabel: "Updated just now" };
    });
    setDirty(false);
    setEditor(null);
    setSavedMessage(`${profileSectionMeta.find((item) => item.id === section)?.label} saved`);
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  return (
    <div className="profile-v2">
      <Surface className="profile-summary-strip">
        <div><span>Profile status</span><strong>{profile.completion}% complete</strong><small>{profile.completedSections} of {profile.totalSections} sections · {profile.updatedLabel}</small></div>
        <div><ProgressBar label="Profile completion" tone={profile.completion === 100 ? "success" : "blue"} value={profile.completion} /><p>{summaryMessage}</p></div>
      </Surface>
      <div className="profile-workspace">
        <aside className="profile-index"><p className="eyebrow">Profile sections</p><nav aria-label="Financial profile sections">{profileSectionMeta.map((section, index) => { const complete = sectionIsComplete(profile, section.id); return <a href={`#profile-${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{section.label}</strong>{complete ? <Check aria-label="Complete" /> : <CircleAlert aria-label="Information missing" />}</a>; })}</nav><div className="profile-privacy-note"><ShieldCheck aria-hidden="true" /><p>Only provide information you are comfortable using for your Credlytic assessment.</p><Link href="/settings#data">How we use profile data<ArrowRight /></Link></div></aside>
        <ProfileDocument onEdit={setEditor} profile={profile} />
      </div>
      <div aria-live="polite" className={`profile-save-toast ${savedMessage ? "profile-save-toast-visible" : ""}`}><Check aria-hidden="true" />{savedMessage}</div>
      {editor ? <ProfileEditor forceSaveFailure={forceSaveFailure} initialValidationError={initialValidationError} onClose={closeEditor} onDirtyChange={setDirty} onSaved={saveSection} profile={profile} section={editor} /> : null}
    </div>
  );
}
