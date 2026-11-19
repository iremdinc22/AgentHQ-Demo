import { departmentById } from "../../departments/config";
import { Icon, Portrait } from "../workspace/ui";
import { agentPresentation } from "../../departments/presentation";

export const demoStarters = Object.fromEntries(Object.entries(agentPresentation).map(([id, identity]) => [id, identity.prompts]));
import { useEffect, useRef, useState } from "react";
import { useOfficeStore } from "../../store/useOfficeStore";
export function ChatPanel({ compact = false, draft: sharedDraft, setDraft: setSharedDraft }: { compact?: boolean; draft?: string; setDraft?: (value: string) => void }) {
  const mode = useOfficeStore((s) => s.mode);
  const setMode = useOfficeStore((s) => s.setMode);
  const selected = useOfficeStore((s) => s.selected);
  const select = useOfficeStore(s => s.select);
  const messages = useOfficeStore((s) => s.messages);
  const running = useOfficeStore((s) => s.running);
  const submit = useOfficeStore((s) => s.submit);
  const cancel = useOfficeStore((s) => s.cancel);
  const [localDraft, setLocalDraft] = useState("");
  const draft = sharedDraft ?? localDraft;
  const setDraft = setSharedDraft ?? setLocalDraft;
  const input = useRef<HTMLInputElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const target = compact || mode === "ceo" ? "ceo" : selected;
  const department = departmentById[target];
  const identity = agentPresentation[target];
  const visible = messages.filter((m) => m.department === target);
  const welcome = !visible.some(message => message.role === "user");
  useEffect(() => {
    if (!welcome && scrollArea.current)
      scrollArea.current.scrollTop = scrollArea.current.scrollHeight;
  }, [messages, target, welcome]);
  return (
    <section className={`chat-dock ${compact ? "compact-chat" : ""}`} aria-label="Agent chat">
      {compact ? <header className="office-ceo-identity">
        <Portrait id="ceo" size="small" />
        <div><h2>CEO Office</h2><p>Share a goal to preview a simulated team handoff.</p></div>
      </header> : <div className="dock-toolbar">
        <div className="mode-switch" aria-label="Interaction mode">
          <button
            className={mode === "ceo" ? "active" : ""}
            aria-pressed={mode === "ceo"}
            onClick={() => { setMode("ceo"); if (selected !== "ceo") select("ceo"); }}
          >
            <Icon name="spark" size={14}/> CEO Mode
          </button>
          <button
            className={mode === "direct" ? "active" : ""}
            aria-pressed={mode === "direct"}
            onClick={() => setMode("direct")}
          >
            <Icon name="chat" size={14}/> Direct Mode
          </button>
        </div>

      </div>}
      {!compact && <div className="chat-transcript card">
          <div className="messages" role="log" aria-label={`${department.name} conversation history`} aria-live="polite" tabIndex={0} ref={scrollArea}>
            {welcome && <div className="chat-welcome">
              <Portrait id={target} size="large"/>
              <h2>{identity.headline}</h2>
              <p>{department.description}</p>
              <div className="chat-starters">{identity.prompts.map((prompt, index) => <button type="button" disabled={running} key={prompt}
                onClick={() => { setDraft(prompt); input.current?.focus(); }}>
                <Icon name={["chat", "tasks", "spark"][index]} size={16}/><span>{prompt}</span><Icon name="arrow" size={15}/>
              </button>)}</div>
            </div>}
            {(!welcome ? visible : []).map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <span className="message-author">
                  {m.role !== "user" && <Portrait id={target} size="tiny" />}
                  {m.role === "user"
                    ? "YOU"
                    : `${department.animal} · SIMULATED`}
                </span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>}
      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!running && draft.trim()) {
            void submit(draft, undefined, compact ? "ceo" : undefined);
            setDraft("");
          }
        }}
      >
        <input
          ref={input}
          aria-label="Message your agent"
          placeholder={
            compact ? "What would you like your team to work on?" : mode === "ceo"
              ? "Tell your CEO what you have in mind…"
              : `Talk directly to ${department.name}…`
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          disabled={running}
        />
        {running ? (
          <button type="button" className="send" aria-label="Stop simulation" title="Stop simulation" onClick={cancel}>
            <Icon name="stop" size={17}/>
          </button>
        ) : (
          <button className="send" aria-label="Send message" title="Send message" disabled={!draft.trim()} type="submit">
            <Icon name="send" size={18}/>
          </button>
        )}
      </form>
      <div className="dock-foot">
        <span>
          <i /> SIMULATION ONLY · NO REAL TASKS EXECUTED
        </span>
        {!compact && <button
          disabled={running}
          onClick={() =>
            setDraft(
              mode === "ceo"
                ? "Outline an article about the fictional Lantern Library."
                : "Preview an architecture review for the fictional Fernboard project.",
            )
          }
        >
          ✧ {mode === "ceo" ? "Try a handoff" : "Try a direct task"}
        </button>}
      </div>
    </section>
  );
}
