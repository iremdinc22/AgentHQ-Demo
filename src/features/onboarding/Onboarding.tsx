import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { departments } from "../../departments/config";
import { Icon, Portrait } from "../workspace/ui";
import type { DemoView } from "../../app/DemoPages";
import "./onboarding.css";

export const onboardingKey = "agenthq:onboarding-seen";
export const tourSteps = [
  { title: "The 3D Office", view: "Office", target: ".office-viewport", icon: "home",
    description: "Eight departments share this miniature office. When you finish the tour, drag to look around or select a room to meet its agent." },
  { title: "CEO Office and Task Delegation", view: "Office", target: ".office-compact-composer", icon: "chat",
    description: "Give the CEO a goal here. In the demo, the CEO hands it off to a specialist through a simulated workflow." },
  { title: "Specialized Agent Departments", view: "Agents", target: ".ws-roster .ws-agent-card", icon: "spark",
    description: "Meet the eight agents, see what each specializes in, and open any profile to visit their room or start a conversation." },
  { title: "Multi-Agent Scenarios", view: "Scenarios", target: ".demo-scenario .demo-flow", icon: "activity",
    description: "Follow a fictional project through sequential and parallel handoffs. Choose a scenario after the tour to see its simulated results." },
  { title: "Task Management and Results", view: "Tasks", target: '[aria-label="Tasks page"] .ws-toolbar', icon: "tasks",
    description: "Search and filter session tasks. Open a task to inspect its status and any simulated results." },
  { title: "Human-in-the-Loop Approvals", view: "Office", target: ".reference-inbox .approval-card", icon: "lock",
    description: "The CEO Review Desk lets you inspect, approve or reject fictional proposals. Decisions apply only to this session." },
  { title: "Activity and Collaboration", view: "Activity", target: '[aria-label="Activity page"] .ws-toolbar', icon: "activity",
    description: "Follow the timeline to see how specialists hand off work and how simulated tasks progress." },
] as const satisfies readonly {title: string; view: "Office" | DemoView; target: string; icon: string; description: string}[];

export function firstVisit() {
  try { return localStorage.getItem(onboardingKey) !== "1"; }
  catch { return true; }
}

export function rememberOnboarding() {
  try { localStorage.setItem(onboardingKey, "1"); }
  catch { /* The tour still works when storage is unavailable. */ }
}

export type OnboardingScreen = "welcome" | "complete" | number | null;

export function Onboarding({ screen, change, explore, sample, runReview, reviewDisabled, agents, chat }: {
  screen: Exclude<OnboardingScreen, null>;
  change: (screen: OnboardingScreen) => void;
  explore: () => void;
  sample: () => void;
  runReview: () => void;
  reviewDisabled: boolean;
  agents: () => void;
  chat: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const closing = useRef(false);
  const step = typeof screen === "number" ? tourSteps[screen] : undefined;
  const [layout, setLayout] = useState<{ target: CSSProperties; card: CSSProperties }>();

  useLayoutEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }); }, [screen]);

  useLayoutEffect(() => {
    if (!step || !card.current) return;
    const target = document.querySelector(step.target)
      ?? (step.icon === "lock" ? document.querySelector(".reference-inbox .section-heading") : null);
    if (!target) return;
    if (step.view !== "Office") target.scrollIntoView({ block: "nearest" });
    const panel = card.current;
    const measure = () => {
      const gap = 14;
      const { innerWidth: width, innerHeight: height } = window;
      const box = target.getBoundingClientRect();
      const welcome = width <= 650 && step.icon === "home"
        ? document.querySelector(".welcome-card")?.getBoundingClientRect()
        : undefined;
      const rect = {
        left: Math.max(gap, box.left - 4), top: Math.max(gap, box.top - 4, (welcome?.bottom ?? 0) + 4),
        right: Math.min(width - gap, box.right + 4), bottom: Math.min(height - gap, box.bottom + 4),
      };
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const clamp = (value: number, maximum: number) => Math.max(gap, Math.min(value, maximum - gap));
      const centerX = clamp((rect.left + rect.right - panelWidth) / 2, width - panelWidth);
      const centerY = clamp((rect.top + rect.bottom - panelHeight) / 2, height - panelHeight);
      const candidates = [
        { left: rect.right + gap, top: centerY },
        { left: rect.left - panelWidth - gap, top: centerY },
        { left: centerX, top: rect.bottom + gap },
        { left: centerX, top: rect.top - panelHeight - gap },
      ];
      const fits = ({ left, top }: typeof candidates[number]) =>
        left >= gap && top >= gap && left + panelWidth <= width - gap && top + panelHeight <= height - gap;
      const fallback = rect.top > height - rect.bottom
        ? { left: centerX, top: gap }
        : { left: centerX, top: height - gap - panelHeight };
      const position = candidates.find(fits) ?? fallback;
      setLayout({
        target: { left: rect.left, top: rect.top, width: Math.max(0, rect.right - rect.left), height: Math.max(0, rect.bottom - rect.top) },
        card: {
          left: `clamp(max(${gap}px, env(safe-area-inset-left)), ${position.left}px, calc(100vw - ${panelWidth}px - max(${gap}px, env(safe-area-inset-right)))`,
          top: `clamp(max(${gap}px, env(safe-area-inset-top)), ${position.top}px, calc(100dvh - ${panelHeight}px - max(${gap}px, env(safe-area-inset-bottom)))`,
        },
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    observer.observe(panel);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step]);

  function leave(action: () => void) {
    if (closing.current) return;
    if (!dialog.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      action();
      return;
    }
    closing.current = true;
    const animation = dialog.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 135, easing: "ease-in", fill: "forwards" });
    void animation.finished.then(action, () => { closing.current = false; });
  }

  function dismiss() { leave(() => change(null)); }

  return <dialog ref={dialog} className={`onboarding ${step ? "onboarding-tour" : ""}`}
    aria-labelledby="onboarding-title" aria-describedby="onboarding-description"
    onCancel={event => { event.preventDefault(); dismiss(); }}>
    {step && layout && <div aria-hidden="true" className="tour-highlight" style={layout.target}/>}
    <div ref={card} className={`onboarding-card ${screen === "welcome" ? "onboarding-welcome" : ""}`} style={step ? layout?.card : undefined}>
      {screen === "welcome" && <>
        <div className="onboarding-intro">
          <span className="onboarding-kicker"><Icon name="spark" size={16}/> The Agent Office</span>
          <h2 id="onboarding-title" ref={heading} tabIndex={-1}>Welcome to AgentHQ</h2>
          <p id="onboarding-description">Your personal team of AI specialists, working together in one intelligent workspace.</p>
          <p className="onboarding-story">Meet the specialists, give your CEO a goal, and follow the handoffs as the team works together.</p>
          <div className="onboarding-actions">
            <button className="ws-button primary" onClick={() => change(0)}>Start Guided Tour <Icon name="arrow" size={17}/></button>
            <button className="ws-button" onClick={() => leave(sample)}>Try a Sample Workflow</button>
            <button className="ws-button onboarding-text" onClick={() => leave(explore)}>Explore the Office</button>
          </div>
          <small className="onboarding-note">Portfolio demo · Simulated workflows</small>
        </div>
        <section className="onboarding-roster" aria-label="Meet the eight agents">
          <div className="onboarding-roster-heading"><span>Meet your team</span><Icon name="spark" size={20}/></div>
          <div className="onboarding-team">{departments.map(agent =>
            <div key={agent.id} data-lead={agent.id === "ceo" || undefined}><Portrait id={agent.id} size="large"/><small>{agent.name}</small></div>
          )}</div>
        </section>
      </>}
      {step && typeof screen === "number" && <>
        <div className="onboarding-step-body" key={screen}>
          <div className="onboarding-progress">
            <span>Guided tour <b>{String(screen + 1).padStart(2, "0")} / 07</b></span>
            <div className="onboarding-ticks" role="progressbar" aria-label="Tour progress" aria-valuemin={0} aria-valuemax={tourSteps.length} aria-valuenow={screen + 1}>
              {tourSteps.map((item, index) => <i key={item.title} data-state={index === screen ? "current" : index < screen ? "past" : undefined}/>)}
            </div>
          </div>
          <div className="onboarding-step-heading">
            <span className="onboarding-emblem">{screen === 1 ? <Portrait id="ceo"/> : <Icon name={step.icon} size={22}/>}</span>
            <h2 id="onboarding-title" ref={heading} tabIndex={-1}>{step.title}</h2>
          </div>
          <p id="onboarding-description">{step.description}</p>
        </div>
        <div className="onboarding-actions onboarding-tour-actions">
          <button className="ws-button onboarding-text tour-skip" onClick={dismiss}>Skip Tour</button>
          <button className="ws-button" disabled={screen === 0} onClick={() => change(screen - 1)}>Back</button>
          <button className="ws-button primary" onClick={() => change(screen === tourSteps.length - 1 ? "complete" : screen + 1)}>
            {screen === tourSteps.length - 1 ? "Finish" : "Next"} <Icon name="arrow" size={16}/>
          </button>
        </div>
      </>}
      {screen === "complete" && <>
        <header className="onboarding-finale">
          <span className="onboarding-finale-art" aria-hidden="true"><Icon name="spark" size={22}/><Portrait id="ceo" size="large"/><Icon name="check" size={20}/></span>
          <span className="onboarding-kicker">Tour complete</span>
          <h2 id="onboarding-title" ref={heading} tabIndex={-1}>You’ve met the team</h2>
          <p id="onboarding-description">Your office is ready. What would you like to try first?</p>
        </header>
        <div className="onboarding-next">
          <button className="onboarding-action-card" disabled={reviewDisabled} onClick={() => leave(runReview)}><Icon name="tasks"/><span><strong>Run a software project review</strong><small>Follow Engineering, Project, and Content through a sample handoff.</small></span><Icon name="arrow" size={16}/></button>
          <button className="onboarding-action-card" onClick={() => leave(agents)}><Icon name="spark"/><span><strong>Explore the agent team</strong><small>Visit the directory to see all eight roles.</small></span><Icon name="arrow" size={16}/></button>
          <button className="onboarding-action-card" onClick={() => leave(chat)}><Icon name="chat"/><span><strong>Try a direct agent conversation</strong><small>Open a demo chat with Engineering Lab.</small></span><Icon name="arrow" size={16}/></button>
        </div>
        <button className="ws-button onboarding-text onboarding-return" onClick={() => leave(explore)}>Back to the Office</button>
      </>}
    </div>
  </dialog>;
}
