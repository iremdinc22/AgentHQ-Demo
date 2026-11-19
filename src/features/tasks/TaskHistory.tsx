import { useOfficeStore } from "../../store/useOfficeStore";
export function TaskHistory() {
  const tasks = useOfficeStore((s) => s.tasks);
  return (
    <details className="task-history">
      <summary>
        Task history <span>{tasks.length} simulated</span>
      </summary>
      {tasks.length ? (
        tasks.map((t) => (
          <div key={t.id} className="task-row">
            <p>{t.prompt}</p>
            <span>{t.status} · simulated</span>
          </div>
        ))
      ) : (
        <p className="empty-chat">Your simulated tasks will appear here.</p>
      )}
    </details>
  );
}
