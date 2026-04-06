import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getAllActivities, deleteSelectedActivities } from "../../api/activityAPI";
import ActivityItem from "../../components/common/ActivityItem";
import "../../components/common/activityStyles.css";

const activityTypes = [
    { value: "all", label: "All" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "appointment_booked", label: "Appointment Booked" },
    { value: "appointment_cancelled", label: "Appointment Cancelled" },
    { value: "appointment_completed", label: "Appointment Completed" },
    { value: "prescription_created", label: "Prescription Created" },
    { value: "prescription_updated", label: "Prescription Updated" },
    { value: "doctor_added", label: "Doctor Added" },
    { value: "doctor_removed", label: "Doctor Removed" },
    { value: "staff_added", label: "Staff Added" },
    { value: "staff_removed", label: "Staff Removed" },
    { value: "patient_registered", label: "Patient Registered" }
];

export default function Notifications() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalActivities, setTotalActivities] = useState(0);
    const [deleting, setDeleting] = useState(false);

    const pageSize = 15;

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalActivities / pageSize)), [totalActivities]);

    useEffect(() => {
        fetchActivities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedFilter]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const offset = (currentPage - 1) * pageSize;
            const data = await getAllActivities(pageSize, offset, selectedFilter === "all" ? null : selectedFilter);
            setActivities(data?.activities || []);
            setTotalActivities(data?.total || 0);
            setSelectedIds(new Set());
            setError(null);
        } catch (err) {
            console.error("Error loading notifications", err);
            setError("Unable to load notifications right now.");
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        const updated = new Set(selectedIds);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelectedIds(updated);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === activities.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(activities.map((a) => a.id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) {
            alert("Select at least one notification to delete.");
            return;
        }

        const idsToDelete = Array.from(selectedIds);
        if (!window.confirm(`Delete ${idsToDelete.length} selected notification(s)?`)) return;

        try {
            setDeleting(true);
            await deleteSelectedActivities(idsToDelete);
            setActivities((prev) => prev.filter((item) => !selectedIds.has(item.id)));
            setTotalActivities((prev) => Math.max(0, prev - idsToDelete.length));
            setSelectedIds(new Set());

            // If page is now empty and we are not on the first page, go back a page
            if (activities.length === idsToDelete.length && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                fetchActivities();
            }
        } catch (err) {
            console.error("Failed to delete notifications", err);
            alert("Couldn't delete selected notifications. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteAllOnPage = async () => {
        if (activities.length === 0) return;
        const idsToDelete = activities.map((a) => a.id);
        if (!window.confirm(`Delete all ${idsToDelete.length} notifications on this page?`)) return;

        try {
            setDeleting(true);
            await deleteSelectedActivities(idsToDelete);
            setActivities([]);
            setSelectedIds(new Set());
            setTotalActivities((prev) => Math.max(0, prev - idsToDelete.length));

            if (currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                fetchActivities();
            }
        } catch (err) {
            console.error("Failed to delete page notifications", err);
            alert("Couldn't delete notifications on this page. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const currentFilterLabel = activityTypes.find((t) => t.value === selectedFilter)?.label || "All";

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="activity-page">
                <div className="activity-page-header">
                    <div>
                        <div className="activity-page-title">🔔 Notifications</div>
                        <div style={{ color: "#64748b", marginTop: "4px" }}>
                            {currentFilterLabel} • Page {currentPage} of {totalPages} • {totalActivities} total
                        </div>
                    </div>
                    <div className="activity-filters">
                        {activityTypes.map((type) => (
                            <button
                                key={type.value}
                                className={`activity-filter-btn ${selectedFilter === type.value ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedFilter(type.value);
                                    setCurrentPage(1);
                                }}
                                disabled={loading}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="activity-bulk-bar">
                    <label className="select-all-control">
                        <input
                            type="checkbox"
                            checked={activities.length > 0 && selectedIds.size === activities.length}
                            onChange={toggleSelectAll}
                            disabled={activities.length === 0}
                        />
                        <span>Select all on this page</span>
                    </label>

                    <div className="activity-bulk-actions">
                        <button
                            className="activity-bulk-btn danger"
                            onClick={handleDeleteSelected}
                            disabled={selectedIds.size === 0 || deleting}
                        >
                            {deleting ? "Deleting..." : `Delete Selected (${selectedIds.size || 0})`}
                        </button>
                        <button
                            className="activity-bulk-btn ghost"
                            onClick={handleDeleteAllOnPage}
                            disabled={activities.length === 0 || deleting}
                        >
                            Delete All on Page
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="activity-loading">
                        <span className="activity-loading-spinner"></span>
                        Loading notifications...
                    </div>
                )}

                {error && !loading && <div className="activity-empty">{error}</div>}

                {!loading && activities.length === 0 && !error && (
                    <div className="activity-empty">No notifications found for this filter.</div>
                )}

                {!loading && activities.length > 0 && (
                    <div className="activity-list activity-list-selectable">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`activity-selectable-row ${selectedIds.has(activity.id) ? "selected" : ""}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(activity.id)}
                                    onChange={() => toggleSelect(activity.id)}
                                />
                                <div className="activity-selectable-content">
                                    <ActivityItem activity={activity} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="activity-pagination">
                        <button
                            className="activity-pagination-btn"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1 || loading}
                        >
                            First
                        </button>
                        <button
                            className="activity-pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                        >
                            ← Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                            const pageNum = Math.max(1, currentPage - 2) + idx;
                            if (pageNum > totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    className={`activity-pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                    disabled={loading}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            className="activity-pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loading}
                        >
                            Next →
                        </button>
                        <button
                            className="activity-pagination-btn"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || loading}
                        >
                            Last
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
