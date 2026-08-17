"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleAlert,
  FileSearch,
  Minus,
  Send,
  Sparkles,
  X
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

export type AdvisorPageContext = {
  pageId: "dashboard" | "profile" | "eligibility" | "cards" | "comparison" | "reports" | "settings";
  label: string;
  subject: string;
  starter: string;
  suggestions: string[];
  metadata?: Record<string, string | number>;
};

type AdvisorBlock = {
  kind: "analysis" | "action" | "match" | "policy" | "limitation";
  title: string;
  content: string;
};

type AdvisorMessage = {
  id: number;
  role: "user" | "advisor";
  text: string;
  blocks?: AdvisorBlock[];
};

const defaultSuggestions = [
  "Why is my HDFC match only 67%?",
  "Which card fits my spending best?",
  "What is limiting my eligibility?",
  "How can I improve my profile?"
];

const routeContexts: Record<string, AdvisorPageContext> = {
  dashboard: {
    pageId: "dashboard",
    label: "Dashboard context",
    subject: "Profile Strength 86/100",
    starter: "What should I improve first?",
    suggestions: ["What should I improve first?", "Which signal changed this month?", ...defaultSuggestions.slice(1, 3)],
    metadata: { profileStrength: 86 }
  },
  profile: {
    pageId: "profile",
    label: "Profile context",
    subject: "Meera's credit profile",
    starter: "How can I improve my profile?",
    suggestions: ["How can I improve my profile?", "Which profile field matters most?", ...defaultSuggestions.slice(1, 3)]
  },
  eligibility: {
    pageId: "eligibility",
    label: "Eligibility context",
    subject: "HDFC Regalia Gold · 67% match",
    starter: "Why is this match 67%?",
    suggestions: ["Why is this match 67%?", "What is limiting my eligibility?", "How can I improve this match?", "Does checking affect my score?"],
    metadata: { card: "HDFC Regalia Gold", match: 67 }
  },
  cards: {
    pageId: "cards",
    label: "Card discovery context",
    subject: "HDFC Regalia Gold",
    starter: "Ask about HDFC Regalia Gold",
    suggestions: ["Why is my HDFC match only 67%?", "Which card fits my spending best?", "Compare fees and value", "Show my strongest match"],
    metadata: { card: "HDFC Regalia Gold", match: 67 }
  },
  comparison: {
    pageId: "comparison",
    label: "Comparison context",
    subject: "Selected card comparison",
    starter: "Which card is the better fit?",
    suggestions: ["Which card is the better fit?", "Compare annual value", "Which card has lower risk?", "Explain the main trade-off"]
  },
  reports: {
    pageId: "reports",
    label: "Report context",
    subject: "Latest credit report analysis",
    starter: "What should I improve first?",
    suggestions: ["What should I improve first?", "What is my biggest limiting factor?", "Explain my utilization", "Which issue is most urgent?"]
  },
  settings: {
    pageId: "settings",
    label: "Account context",
    subject: "Data controls and preferences",
    starter: "How does Credlytic use my data?",
    suggestions: ["How does Credlytic use my data?", "Can I remove my report?", "What is stored in my profile?", "Does checking affect my score?"]
  }
};

export function getAdvisorContext(pathname: string): AdvisorPageContext {
  if (pathname.startsWith("/cards/compare")) return routeContexts.comparison;
  const route = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return routeContexts[route] ?? routeContexts.dashboard;
}

function getMockReply(question: string, context: AdvisorPageContext): Omit<AdvisorMessage, "id" | "role"> {
  const normalized = question.toLowerCase();

  if (normalized.includes("67%") || normalized.includes("hdfc") || normalized.includes("match")) {
    return {
      text: "Your payment history supports the match, but current utilization and premium-card income fit keep it from the strongest tier.",
      blocks: [
        { kind: "analysis", title: "Credlytic analysis", content: "Utilization is the largest adjustable signal. Income fit is close, while repayment history remains positive." },
        { kind: "action", title: "Recommended action", content: "Reduce reported utilization below 30%, then recheck after the next bureau update." },
        { kind: "limitation", title: "Important limitation", content: "A match score is decision support, not an approval guarantee. The issuer's internal policy remains final." }
      ]
    };
  }

  if (normalized.includes("spending") || normalized.includes("which card") || normalized.includes("better fit")) {
    return {
      text: "Based on the current sample profile, Amazon Pay ICICI is the strongest low-friction fit. Axis Ace may create more value if utilities remain a major spending category.",
      blocks: [
        { kind: "match", title: "Card match", content: "Amazon Pay ICICI · strongest confidence · no annual fee" },
        { kind: "policy", title: "Policy context", content: "Final eligibility and rewards are subject to current issuer terms at the time of application." }
      ]
    };
  }

  if (normalized.includes("limit") || normalized.includes("improve") || normalized.includes("first") || normalized.includes("urgent")) {
    return {
      text: "Start with utilization. It is the clearest near-term constraint in your current profile and the factor you can influence most directly.",
      blocks: [
        { kind: "action", title: "Recommended action", content: "Pay balances before statement generation and keep aggregate utilization below 30%." },
        { kind: "analysis", title: "Expected signal", content: "A lower reported balance can improve profile strength after the next bureau refresh." }
      ]
    };
  }

  if (normalized.includes("score") || normalized.includes("hard inquiry")) {
    return { text: "Using Credlytic's eligibility experience does not create a hard inquiry or affect your credit score. An issuer application may involve a separate bureau inquiry." };
  }

  return { text: `For ${context.subject}, I would weigh your profile signals against current card terms and issuer policy context. This preview uses sample data until secure personalized guidance is connected.` };
}

function BlockIcon({ kind }: { kind: AdvisorBlock["kind"] }) {
  if (kind === "action" || kind === "match") return <Check aria-hidden="true" />;
  if (kind === "limitation") return <CircleAlert aria-hidden="true" />;
  if (kind === "policy") return <FileSearch aria-hidden="true" />;
  return <Sparkles aria-hidden="true" />;
}

export function QuickAdvisor({ context }: { context: AdvisorPageContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const nextMessageId = useRef(1);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => composerRef.current?.focus(), 260);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, typing]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  function sendQuestion(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || typing) return;

    setMessages((current) => [...current, { id: nextMessageId.current++, role: "user", text: cleanQuestion }]);
    setDraft("");
    setTyping(true);

    replyTimer.current = setTimeout(() => {
      setMessages((current) => [...current, { id: nextMessageId.current++, role: "advisor", ...getMockReply(cleanQuestion, context) }]);
      setTyping(false);
      replyTimer.current = null;
    }, 720);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendQuestion(draft);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion(draft);
    }
  }

  function closeConversation() {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setOpen(false);
    setMessages([]);
    setDraft("");
    setTyping(false);
  }

  return (
    <div className={`quick-advisor-root quick-advisor-${context.pageId}`}>
      {open ? <button aria-label="Minimize Credlytic Advisor" className="quick-advisor-scrim" onClick={() => setOpen(false)} type="button" /> : null}

      {open ? (
        <section aria-label="Credlytic Advisor" aria-modal="false" className="quick-advisor-panel" id="quick-advisor-panel" role="dialog">
          <header className="quick-advisor-header">
            <span className="quick-advisor-mark"><Sparkles aria-hidden="true" /></span>
            <span className="quick-advisor-heading"><strong>Credlytic Advisor</strong><small>Financial intelligence</small></span>
            <button aria-label="Minimize Advisor" className="quick-advisor-control" onClick={() => setOpen(false)} title="Minimize" type="button"><Minus /></button>
            <button aria-label="Close and clear conversation" className="quick-advisor-control" onClick={closeConversation} title="Close conversation" type="button"><X /></button>
          </header>

          <div className="quick-advisor-context">
            <span><i />{context.label}</span>
            <strong>{context.subject}</strong>
          </div>

          <div aria-live="polite" className="quick-advisor-conversation" ref={conversationRef}>
            {messages.length === 0 ? (
              <div className="quick-advisor-empty">
                <span className="quick-advisor-orbit"><Sparkles aria-hidden="true" /></span>
                <h2>Start with a decision</h2>
                <div className="quick-advisor-suggestions">
                  {context.suggestions.map((question) => <button key={question} onClick={() => sendQuestion(question)} type="button">{question}<ArrowRight aria-hidden="true" /></button>)}
                </div>
              </div>
            ) : (
              <div className="quick-advisor-messages">
                {messages.map((message) => message.role === "user" ? (
                  <article className="quick-user-message" key={message.id}><small>You</small><p>{message.text}</p></article>
                ) : (
                  <article className="quick-response" key={message.id}>
                    <div className="quick-response-author"><span><Sparkles aria-hidden="true" /></span><strong>Credlytic</strong></div>
                    <p>{message.text}</p>
                    {message.blocks?.map((block) => (
                      <div className={`quick-response-block quick-block-${block.kind}`} key={`${message.id}-${block.kind}`}>
                        <BlockIcon kind={block.kind} />
                        <span><small>{block.title}</small><strong>{block.content}</strong></span>
                      </div>
                    ))}
                  </article>
                ))}
                {typing ? <div className="quick-advisor-typing" role="status"><span><Sparkles aria-hidden="true" /></span><i /><i /><i /><small className="sr-only">Credlytic is analyzing</small></div> : null}
              </div>
            )}
          </div>

          <footer className="quick-advisor-footer">
            <form className="quick-advisor-composer" onSubmit={submit}>
              <label><span className="sr-only">Ask Credlytic</span><textarea aria-label="Ask Credlytic" onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder={context.starter} ref={composerRef} rows={1} value={draft} /></label>
              <button aria-label="Send question" disabled={!draft.trim() || typing} title="Send" type="submit"><Send /></button>
            </form>
            <Link className="quick-advisor-full-link" href="/advisor" onClick={() => setOpen(false)}>Open full Advisor <ArrowRight aria-hidden="true" /></Link>
          </footer>
        </section>
      ) : null}

      <button aria-controls="quick-advisor-panel" aria-expanded={open} aria-label="Ask Credlytic" className="quick-advisor-trigger" onClick={() => setOpen((current) => !current)} type="button">
        <span className="quick-advisor-trigger-icon"><Sparkles aria-hidden="true" /></span>
        <span className="quick-advisor-trigger-label">Ask Credlytic</span>
        {messages.length > 0 ? <i aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
