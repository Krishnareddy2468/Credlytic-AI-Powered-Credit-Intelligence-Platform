"use client";

import { useState } from "react";
import { Bell, Check, Download, KeyRound, LockKeyhole, Mail, ShieldCheck, Smartphone, Trash2, UserRound } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { SectionHeader, StatusBadge, Surface } from "@/components/product-ui";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [policyAlerts, setPolicyAlerts] = useState(false);

  return (
    <ProductShell actions={<button className="button button-primary button-app" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }} type="button"><Check />{saved ? "Saved" : "Save preferences"}</button>} eyebrow="Account controls" subtitle="Manage your prototype account, communications and sensitive financial data." title="Settings">
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections"><a href="#account"><UserRound />Account</a><a href="#security"><KeyRound />Security</a><a href="#notifications"><Bell />Notifications</a><a href="#privacy"><ShieldCheck />Privacy & data</a></nav>
        <div className="settings-content">
          <Surface className="settings-section" as="section"><div id="account" className="settings-anchor" /><SectionHeader description="Information shown across your Credlytic workspace." title="Account" /><div className="settings-profile"><span className="settings-avatar">MS</span><div><strong>Meera Shah</strong><p>meera.shah@example.com</p><StatusBadge tone="muted">Prototype account</StatusBadge></div><button className="button button-secondary button-app" type="button">Change photo</button></div><div className="form-grid"><label className="field"><span>Full name</span><input defaultValue="Meera Shah" /></label><label className="field"><span>Email address</span><input defaultValue="meera.shah@example.com" type="email" /></label><label className="field"><span>Phone number</span><input defaultValue="+91 98••• ••482" /></label><label className="field"><span>Primary city</span><input defaultValue="Mumbai" /></label></div></Surface>

          <Surface className="settings-section" as="section"><div id="security" className="settings-anchor" /><SectionHeader description="Protect access to sensitive profile and report information." title="Security" /><div className="settings-rows"><SettingRow action="Change password" detail="Last changed 24 days ago" icon={LockKeyhole} title="Password" /><SettingRow action="Set up" detail="Add a second verification step at sign in" icon={Smartphone} title="Two-step verification" /><SettingRow action="Review" detail="1 active session · MacBook Pro · Mumbai" icon={KeyRound} title="Active sessions" /></div></Surface>

          <Surface className="settings-section" as="section"><div id="notifications" className="settings-anchor" /><SectionHeader description="Choose the changes important enough to reach you." title="Notifications" /><div className="settings-rows"><ToggleRow checked={emailAlerts} detail="Monthly profile summary and important account notices" icon={Mail} onChange={setEmailAlerts} title="Email summaries" /><ToggleRow checked={matchAlerts} detail="When a saved card moves into a stronger match range" icon={Bell} onChange={setMatchAlerts} title="Eligibility changes" /><ToggleRow checked={policyAlerts} detail="Material issuer-policy changes affecting saved cards" icon={ShieldCheck} onChange={setPolicyAlerts} title="Policy updates" /></div></Surface>

          <Surface className="settings-section" as="section"><div id="privacy" className="settings-anchor" /><SectionHeader description="Export or remove the information associated with this prototype workspace." title="Privacy & data" /><div className="data-controls"><div><Download /><span><strong>Export your data</strong><p>Prepare a copy of your profile, preferences and sample assessments.</p></span><button className="button button-secondary button-app" type="button">Request export</button></div><div><Trash2 /><span><strong>Delete report data</strong><p>Remove uploaded report references and generated analysis.</p></span><button className="button button-secondary button-app" type="button">Delete reports</button></div><div className="danger-control"><Trash2 /><span><strong>Delete account</strong><p>Permanently remove the account and all associated profile data.</p></span><button className="button button-danger button-app" type="button">Delete account</button></div></div></Surface>
        </div>
      </div>
    </ProductShell>
  );
}

function SettingRow({ icon: Icon, title, detail, action }: { icon: typeof LockKeyhole; title: string; detail: string; action: string }) {
  return <div><span className="settings-row-icon"><Icon /></span><span><strong>{title}</strong><p>{detail}</p></span><button className="button button-secondary button-app" type="button">{action}</button></div>;
}

function ToggleRow({ icon: Icon, title, detail, checked, onChange }: { icon: typeof Bell; title: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div><span className="settings-row-icon"><Icon /></span><span><strong>{title}</strong><p>{detail}</p></span><button aria-checked={checked} aria-label={`${title}: ${checked ? "on" : "off"}`} className={`toggle ${checked ? "toggle-on" : ""}`} onClick={() => onChange(!checked)} role="switch" type="button"><span /></button></div>;
}
