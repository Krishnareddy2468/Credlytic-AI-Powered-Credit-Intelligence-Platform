"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Bot, Check, ChevronRight, FileSearch, Info, Paperclip, Send, Sparkles, UserRound } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, ProgressBar, StatusBadge, Surface } from "@/components/product-ui";
import { advisorSources, suggestedQuestions } from "@/data/mock-advisor";
import { creditCards } from "@/data/mock-cards";
import { roadmap } from "@/data/mock-user";

type Message = { role: "user" | "advisor"; text: string };

const initialMessages: Message[] = [
  { role: "user", text: "Why is my HDFC Regalia Gold match only 67%?" },
  { role: "advisor", text: "Your travel spending makes Regalia Gold valuable, but 38% utilization is above the preferred range for a premium application. Income is close to the expected profile and your payment history is a strong positive signal." }
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "user", text: question }, { role: "advisor", text: "For this frontend demonstration, I would evaluate that question using your profile factors, current card terms and cited issuer context. Live personalized guidance will be connected when the secure backend is ready." }]);
    setDraft("");
  }

  return (
    <ProductShell eyebrow="Policy-grounded workspace" subtitle="Explore credit decisions with your profile, product context and next actions visible together." title="Credlytic Advisor">
      <div className="advisor-workspace">
        <Surface className="advisor-conversation">
          <div className="advisor-conversation-head"><div><span className="advisor-avatar"><Bot /></span><span><strong>Credit decision advisor</strong><small><i /> Prototype conversation</small></span></div><StatusBadge tone="success"><Sparkles /> Context active</StatusBadge></div>
          <div className="suggested-prompts">{suggestedQuestions.map((question) => <button key={question} onClick={() => setDraft(question)} type="button">{question}<ChevronRight /></button>)}</div>
          <div className="message-list" aria-live="polite">
            <div className="conversation-date">Today · sample conversation</div>
            {messages.map((message, index) => message.role === "user" ? <div className="user-message" key={`${message.role}-${index}`}><span><UserRound /></span><div><small>You</small><p>{message.text}</p></div></div> : <div className="advisor-message" key={`${message.role}-${index}`}><span><Bot /></span><div><small>Credlytic analysis</small><p>{message.text}</p>{index === 1 ? <><div className="message-action"><Check /><span><small>Recommended action</small><strong>Reduce utilization below 30%, then recheck after your next bureau update.</strong></span></div><div className="message-limitation"><Info /><p><strong>Important limitation</strong> Issuer approval remains subject to internal policy and verification.</p></div></> : null}</div></div>)}
          </div>
          <form className="advisor-composer" onSubmit={submit}><button aria-label="Attach context" className="icon-button" title="Attach context" type="button"><Paperclip /></button><label><span className="sr-only">Ask Credlytic Advisor</span><textarea onChange={(event) => setDraft(event.target.value)} placeholder="Ask about a card, policy or your credit profile" rows={1} value={draft} /></label><button aria-label="Send message" className="send-button" title="Send message" type="submit"><Send /></button></form>
          <p className="composer-note">Prototype responses are illustrative and are not financial advice.</p>
        </Surface>

        <aside className="advisor-context">
          <Surface className="context-card"><div className="context-heading"><span>Card in context</span><button aria-label="Open card details" className="icon-button" title="Open card details" type="button"><ArrowRight /></button></div><CreditCardVisual bank={creditCards[2].bank} compact name={creditCards[2].name} network={creditCards[2].network} tone={creditCards[2].tone} /><div className="context-card-name"><div><span>HDFC Bank</span><strong>Regalia Gold</strong></div><b>67%</b></div><ProgressBar label="Regalia Gold profile match" tone="warning" value={67} /><div className="context-factors"><span><i className="factor-positive-dot" />Payment history <b>Strong</b></span><span><i className="factor-warning-dot" />Utilization <b>Needs work</b></span><span><i />Income fit <b>Close</b></span></div></Surface>

          <Surface className="source-panel"><div className="context-heading"><span>Policy sources</span><small>{advisorSources.length} reviewed</small></div>{advisorSources.map((source) => <article key={source.title}><FileSearch /><div><strong>{source.title}</strong><span>{source.publisher} · {source.updated}</span><p>{source.excerpt}</p></div></article>)}</Surface>

          <Surface className="roadmap-panel"><div className="context-heading"><span>Your next actions</span><small>60-day view</small></div>{roadmap.slice(0, 2).map((item, index) => <article key={item.title}><span>{index + 1}</span><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.timing} · {item.impact}</small></div></article>)}</Surface>
        </aside>
      </div>
    </ProductShell>
  );
}
