import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getUserActivities,
  getAllActivities,
  deleteSelectedActivities,
  markActivitiesAsRead
} from "../api/activityAPI";
import ActivityItem from "../components/common/ActivityItem";
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import StaffLayout from "../layouts/StaffLayout";
import UserLayout from "../layouts/UserLayout";
import "../components/common/activityStyles.css";

export default function Notifications() {
  const location = useLocation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const panel = location.pathname.split("/")[1] || "user";
  const isAdmin = panel === "admin";
  const userId = currentUser?.id;

  const pageTitle = isAdmin ? "System Notifications" : "My Notifications";

  useEffect(() => {
    const loadActivities = async () => {
      if (!userId && !isAdmin) {
        setError("Please log in to view notifications.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = isAdmin
          ? await getAllActivities(100, 0)
          : await getUserActivities(userId, 100, 0);
        const items = data?.activities || [];
        setActivities(items);
        setSelectedIds(new Set());
        setSelectAll(false);

        // Mark as read when viewing
        if (userId) {
          markActivitiesAsRead(userId).catch(err => console.error("Could not mark as read", err));
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [location.pathname, userId, isAdmin]);

  const toggleSelect = (activityId) => {
    const next = new Set(selectedIds);
    if (next.has(activityId)) next.delete(activityId);
    else next.add(activityId);
    setSelectedIds(next);
    setSelectAll(next.size === activities.length && activities.length > 0);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
      return;
    }
    const all = new Set(activities.map((item) => item.id));
    setSelectedIds(all);
    setSelectAll(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      return;
    }

    if (!window.confirm(`Delete ${selectedIds.size} selected notifications?`)) return;

    try {
      const ids = Array.from(selectedIds);
      await deleteSelectedActivities(ids);
      setActivities(activities.filter((item) => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to delete selected notifications", err);
      setError("Unable to delete selected notifications.");
    }
  };

  const handleDeleteAll = async () => {
    if (activities.length === 0) return;
    if (!window.confirm("Delete all visible notifications?")) return;

    try {
      const ids = activities.map((item) => item.id);
      await deleteSelectedActivities(ids);
      setActivities([]);
      setSelectedIds(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to delete all notifications", err);
      setError("Unable to delete all notifications.");
    }
  };

  const activeCount = selectedIds.size;

  const Layout =
    panel === "admin"
      ? AdminLayout
      : panel === "doctor"
      ? DoctorLayout
      : panel === "staff"
      ? StaffLayout
      : UserLayout;

  const content = (
    <div className="dashboard-page notifications-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px', paddingBottom: '40px' }}>
      <style>{`
        .notifications-wrapper .activity-item {
          background-color: transparent !important;
          margin-bottom: 0 !important;
          box-shadow: none !important;
          padding: 8px 0 !important;
        }
      `}</style>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{pageTitle}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Review and manage your latest activities</p>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "24px", borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <button
            type="button"
            onClick={handleSelectAll}
            style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-color)', background: selectAll ? '#e8fdf5' : 'var(--bg-tertiary)', color: selectAll ? '#0fb48c' : 'var(--text-secondary)' }}
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
          
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={activeCount === 0}
            style={{
              padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: activeCount > 0 ? 'pointer' : 'not-allowed', border: 'none',
              background: activeCount > 0 ? "#ef4444" : "var(--bg-tertiary)",
              color: activeCount > 0 ? "white" : "var(--text-tertiary)"
            }}
          >
            Delete Selected
          </button>
          
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={activities.length === 0}
            style={{
              padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: activities.length > 0 ? 'pointer' : 'not-allowed', border: 'none',
              background: activities.length > 0 ? "#ef4444" : "var(--bg-tertiary)",
              color: activities.length > 0 ? "white" : "var(--text-tertiary)",
            }}
          >
            Delete All
          </button>
          
          <div style={{ marginLeft: "auto", color: "var(--text-tertiary)", fontSize: "14px", fontWeight: '600' }}>
            {activeCount > 0 ? `${activeCount} selected` : '0 selected'}
          </div>
        </div>

        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading notifications...
          </div>
        )}

        {error && <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>}

        {!loading && activities.length === 0 && !error && (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>You're all caught up!</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>No new notifications to show.</div>
          </div>
        )}

        {!loading && activities.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: "flex", alignItems: "center", gap: "16px", padding: '16px', borderRadius: '12px',
                  border: selectedIds.has(activity.id) ? "1px solid #0fb48c" : "1px solid var(--border-color)",
                  backgroundColor: selectedIds.has(activity.id) ? "#e8fdf5" : "var(--bg-primary)",
                  boxShadow: selectedIds.has(activity.id) ? '0 4px 12px rgba(15, 180, 140, 0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(activity.id)}
                  onChange={() => toggleSelect(activity.id)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: '#0fb48c', margin: '0' }}
                />
                <div style={{ flex: 1 }}>
                  <ActivityItem activity={activity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return <Layout panelTitle={pageTitle}>{content}</Layout>;
}
