"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Check, FileCheck2, FileText, LockKeyhole, RefreshCw, ShieldCheck, Trash2, Upload } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { SectionHeader, StatusBadge, Surface } from "@/components/product-ui";
import { reportFactors, reportSteps } from "@/data/mock-report";

type Phase = "upload" | "processing" | "complete";

export default function ReportsPage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setPhase("processing");
    window.setTimeout(() => setPhase("complete"), 1400);
  }

  function reset() {
    setFileName("");
    setPhase("upload");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <ProductShell eyebrow="Credit report intelligence" subtitle="Turn a dense bureau PDF into clear risks, anomalies and prioritized actions." title="Credit report analysis">
      <div className="report-flow" aria-label="Report analysis steps">{reportSteps.map((step, index) => { const activeIndex = phase === "upload" ? 0 : phase === "processing" ? 1 : 4; return <div className={index <= activeIndex ? "report-step-active" : ""} key={step}><span>{index < activeIndex || phase === "complete" ? <Check /> : index + 1}</span><strong>{step}</strong></div>; })}</div>

      <div className="report-layout">
        <Surface className="upload-panel">
          <SectionHeader description="CIBIL, Experian, Equifax or CRIF High Mark PDF." title={phase === "complete" ? "Report ready" : "Upload your report"} />
          {phase === "upload" ? <>
            <button className="upload-zone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} type="button"><span><Upload /></span><strong>Drop your credit report here</strong><p>or select a PDF from your device</p><small>PDF only · up to 15 MB</small></button>
            <input accept="application/pdf" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} ref={inputRef} type="file" />
            <button className="sample-report-button" onClick={() => { setFileName("Meera_CIBIL_sample.pdf"); setPhase("complete"); }} type="button"><FileText />View sample analysis<span>Uses demo report data</span></button>
          </> : null}
          {phase === "processing" ? <div className="processing-state"><span className="processing-ring"><RefreshCw /></span><h3>Reading your report structure</h3><p>Identifying accounts, payment history, balances and entries that may need review.</p><div><i /></div><small>Prototype processing · no file is uploaded</small></div> : null}
          {phase === "complete" ? <div className="report-file-ready"><span><FileCheck2 /></span><div><strong>{fileName}</strong><p>Sample analysis completed just now</p></div><button aria-label="Remove report" className="icon-button" onClick={reset} title="Remove report" type="button"><Trash2 /></button></div> : null}
          <div className="upload-trust"><div><LockKeyhole /><span><strong>Private processing</strong><small>Designed for encrypted handling</small></span></div><div><Trash2 /><span><strong>Deletion control</strong><small>Remove report data when you choose</small></span></div></div>
        </Surface>

        <Surface className="report-value-panel">
          <SectionHeader description="A focused review of the signals that affect lending decisions." title={phase === "complete" ? "Your report snapshot" : "What Credlytic will analyze"} />
          {phase !== "complete" ? <div className="analysis-scope"><article><span>01</span><div><h3>Payment health</h3><p>Late payments, settlement markers and repayment consistency.</p></div></article><article><span>02</span><div><h3>Utilization and balances</h3><p>Limit usage by account and concentration of outstanding debt.</p></div></article><article><span>03</span><div><h3>Account accuracy</h3><p>Duplicate, unfamiliar or incorrectly reported account entries.</p></div></article><article><span>04</span><div><h3>Priority actions</h3><p>A sequenced plan based on likely credit impact.</p></div></article></div> : <>
            <div className="report-score-row"><div><span>Reported score</span><strong>742</strong><StatusBadge tone="success">Good</StatusBadge></div><div><span>Open accounts</span><strong>4</strong><small>3 cards · 1 loan</small></div><div><span>Items to review</span><strong>1</strong><small>Possible duplicate entry</small></div></div>
            <div className="report-factor-list">{reportFactors.map((factor) => <article key={factor.label}><span className={`factor-state factor-${factor.status.toLowerCase().replace(" ", "-")}`}>{factor.status === "Healthy" ? <Check /> : <AlertTriangle />}</span><div><h3>{factor.label}</h3><p>{factor.detail}</p></div><div><strong>{factor.value}</strong><small>{factor.status}</small></div></article>)}</div>
          </>}
        </Surface>
      </div>

      <div className="report-privacy-note"><ShieldCheck /><div><strong>Designed for sensitive financial documents</strong><p>This frontend prototype does not upload or store the selected file. Production processing will require explicit consent, encryption and retention controls.</p></div></div>
    </ProductShell>
  );
}
