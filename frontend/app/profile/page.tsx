"use client";

import { useState } from "react";
import { Check, ChevronRight, CircleCheck, Save } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { ProgressBar, SectionHeader, Surface } from "@/components/product-ui";
import { mockUser, profileSections, spending } from "@/data/mock-user";
import type { ProfileSection } from "@/types/product";

export default function ProfilePage() {
  const [active, setActive] = useState<ProfileSection["id"]>("personal");
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <ProductShell
      actions={<button className="button button-primary button-app" onClick={saveProfile} type="button"><Save />{saved ? "Saved" : "Save changes"}</button>}
      eyebrow="Financial profile"
      subtitle="Keep the signals behind your recommendations accurate and under your control."
      title="Your profile"
    >
      <div className="profile-layout">
        <aside className="profile-rail">
          <Surface className="profile-completion">
            <div className="completion-head"><span>Profile strength</span><strong>{mockUser.profileStrength}%</strong></div>
            <ProgressBar label="Profile strength" tone="success" value={mockUser.profileStrength} />
            <p>Complete spending details to improve reward-value estimates.</p>
          </Surface>
          <nav className="profile-section-nav" aria-label="Financial profile sections">
            {profileSections.map((section) => (
              <button className={active === section.id ? "profile-section-active" : ""} key={section.id} onClick={() => setActive(section.id)} type="button">
                <span className="profile-step-icon">{section.complete ? <Check /> : profileSections.indexOf(section) + 1}</span>
                <span><strong>{section.label}</strong><small>{section.description}</small></span>
                <ChevronRight />
              </button>
            ))}
          </nav>
          <div className="profile-privacy"><CircleCheck /><p><strong>You control this profile.</strong> Inputs are used only to personalize this prototype experience.</p></div>
        </aside>

        <Surface className="profile-form-panel">
          <SectionHeader description={profileSections.find((section) => section.id === active)?.description} eyebrow={`${profileSections.findIndex((section) => section.id === active) + 1} of ${profileSections.length}`} title={profileSections.find((section) => section.id === active)?.label ?? "Profile"} />
          <div className="profile-form-content">
            {active === "personal" ? <PersonalFields /> : null}
            {active === "income" ? <IncomeFields /> : null}
            {active === "credit" ? <CreditFields /> : null}
            {active === "obligations" ? <ObligationFields /> : null}
            {active === "spending" ? <SpendingFields /> : null}
            {active === "goals" ? <GoalFields /> : null}
          </div>
          <div className="profile-form-footer">
            <p>Changes update prototype recommendations only.</p>
            <button className="button button-secondary button-app" onClick={() => moveNext(active, setActive)} type="button">Next section<ChevronRight /></button>
          </div>
        </Surface>
      </div>
    </ProductShell>
  );
}

function PersonalFields() {
  return <div className="form-grid"><Field defaultValue={mockUser.name} label="Full name" /><Field defaultValue={mockUser.age} label="Age" type="number" /><Field defaultValue={mockUser.city} label="City" /><SelectField defaultValue={mockUser.employment} label="Employment" options={["Salaried", "Self-employed", "Business owner", "Student"]} /><Field defaultValue={mockUser.role} label="Occupation" /><SelectField defaultValue="Rent" label="Residence" options={["Rent", "Own", "Family-owned"]} /></div>;
}

function IncomeFields() {
  return <div className="form-grid"><Field defaultValue={mockUser.monthlyIncome} help="Gross monthly income before deductions" label="Monthly salary" prefix="₹" type="number" /><Field defaultValue={mockUser.additionalIncome} help="Freelance, rent or other regular income" label="Additional monthly income" prefix="₹" type="number" /><SelectField defaultValue="Bank transfer" label="Salary received through" options={["Bank transfer", "Cheque", "Cash"]} /><SelectField defaultValue="More than 2 years" label="Time with employer" options={["Less than 6 months", "6–12 months", "1–2 years", "More than 2 years"]} /></div>;
}

function CreditFields() {
  return <div className="form-grid"><Field defaultValue={mockUser.creditScore} help="Last known bureau score" label="Credit score" type="number" /><Field defaultValue={mockUser.historyYears} label="Credit history" suffix="years" type="number" /><Field defaultValue={mockUser.activeCards} label="Active credit cards" type="number" /><Field defaultValue={mockUser.utilization} help="Used credit divided by total limit" label="Credit utilization" suffix="%" type="number" /><Field defaultValue={mockUser.recentInquiries} label="Inquiries in last 6 months" type="number" /><Field defaultValue={mockUser.paymentHealth} label="On-time payments" suffix="%" type="number" /></div>;
}

function ObligationFields() {
  return <div className="form-grid"><Field defaultValue={mockUser.activeLoans} label="Active loans" type="number" /><Field defaultValue={mockUser.emiAmount} label="Monthly EMI" prefix="₹" type="number" /><Field defaultValue={mockUser.outstandingBalance} label="Card balances" prefix="₹" type="number" /><SelectField defaultValue="Personal loan" label="Primary loan type" options={["No active loan", "Personal loan", "Home loan", "Vehicle loan", "Education loan"]} /></div>;
}

function SpendingFields() {
  return <div className="spending-fields">{spending.map((item) => <label key={item.category}><span><strong>{item.category}</strong><small>Typical monthly spend</small></span><span className="input-prefix"><i>₹</i><input aria-label={`${item.category} monthly spend`} defaultValue={item.amount} type="number" /></span></label>)}</div>;
}

function GoalFields() {
  const goals = ["Cashback", "Travel rewards", "Airport lounge", "Fuel savings", "Premium lifestyle", "Build credit"];
  return <div><p className="choice-label">What should your next card help you achieve?</p><div className="choice-grid">{goals.map((goal, index) => <label key={goal}><input defaultChecked={index < 2} name="goals" type="checkbox" /><span><Check />{goal}</span></label>)}</div><div className="form-grid form-grid-goals"><SelectField defaultValue="Low fee first" label="Fee preference" options={["Low fee first", "Value over fee", "No annual fee only"]} /><SelectField defaultValue="Next 3 months" label="Application timeline" options={["This month", "Next 3 months", "Just researching"]} /></div></div>;
}

function Field({ label, help, prefix, suffix, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string; prefix?: string; suffix?: string }) {
  return <label className="field"><span>{label}</span><div className="field-input">{prefix ? <i>{prefix}</i> : null}<input {...props} />{suffix ? <i>{suffix}</i> : null}</div>{help ? <small>{help}</small> : null}</label>;
}

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  return <label className="field"><span>{label}</span><select defaultValue={defaultValue}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function moveNext(active: ProfileSection["id"], setActive: (value: ProfileSection["id"]) => void) {
  const index = profileSections.findIndex((section) => section.id === active);
  setActive(profileSections[(index + 1) % profileSections.length].id);
}
