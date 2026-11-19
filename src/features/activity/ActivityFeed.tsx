import { useOfficeStore } from "../../store/useOfficeStore";
import { departmentById } from "../../departments/config";
export function ActivityFeed() {
  const activities = useOfficeStore((s) => s.activities);
  return (
    <section className="activity card">
      <div className="section-heading">
        <h2>Recent Agent Activity</h2>
        <span className="feed-indicator">
          <i /> SIMULATED
        </span>
      </div>
      <div className="activity-list">
        {activities.length ? (
          activities.slice(0, 8).map((a) => (
            <div className="activity-item" key={a.id}>
              <span
                className="mini-avatar"
                style={{ background: departmentById[a.department].color }}
              >
                {departmentById[a.department].emoji}
              </span>
              <div>
                <p>{a.text}</p>
                <small>
                  {departmentById[a.department].name} · {a.time}
                </small>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="activity-item">
              <span className="mini-avatar">☕</span>
              <div>
                <p>A quiet moment before the next idea.</p>
                <small>All eight agents are resting</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="mini-avatar">✧</span>
              <div>
                <p>Your team is ready when you are.</p>
                <small>Send an idea to preview a handoff</small>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
