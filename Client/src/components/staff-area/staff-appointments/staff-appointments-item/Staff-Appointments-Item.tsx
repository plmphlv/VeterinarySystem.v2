import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { useGetAllAppointments } from "../../../../api/appointmentsAPI";
import type { Appointment, AppointmentStatus, GetAllAppointmentsErrors } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatDetails";
import styles from "./Staff-Appointments-Item.module.css";

const StaffAppointmentsItem: React.FC = () => {
    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);
    const { getAllAppointments, cancelGetAllAppointments } = useGetAllAppointments();

    const [errors, setErrors] = useState<GetAllAppointmentsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    const [ownerId, setOwnerId] = useState("");
    const [staffId, setStaffId] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setErrors({});

            const filters: any = {};
            if (ownerId.trim()) filters.OwnerId = ownerId.trim();
            if (staffId.trim()) filters.StaffId = staffId.trim();
            if (status) filters.Status = status as AppointmentStatus;
            if (startDate) filters.StartDate = startDate;
            if (endDate) filters.EndDate = endDate;

            const fetchedAppointments = (await getAllAppointments(filters)) || [];
            fetchedAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setAppointments(fetchedAppointments);
        } catch {
            setDialog({ message: "An error occurred while fetching appointments.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [ownerId, staffId, status, startDate, endDate]);

    useEffect(() => cancelGetAllAppointments, []);

    const hasActiveFilters = ownerId || staffId || status || startDate || endDate;

    return (
        <div className={styles.wrapper}>
            {loading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner />
                </div>
            )}

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            <section className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <label htmlFor="ownerId"><i className="fa-solid fa-user"></i> Owner ID</label>
                        <input id="ownerId" type="text" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="Search by ID" />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="status"><i className="fa-solid fa-flag"></i> Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="Pending_Review">Pending Review</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                            <option value="Missed">Missed</option>
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="startDate"><i className="fa-solid fa-calendar-days"></i> From</label>
                        <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="endDate"><i className="fa-solid fa-calendar-days"></i> To</label>
                        <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className={styles.filterActions}>
                    <button
                        onClick={() => { setStaffId(""); setStatus(""); setStartDate(""); setEndDate(""); setOwnerId(""); }}
                        className={styles.clearBtn}
                        disabled={!hasActiveFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            </section>

            {appointments.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <section className={styles.grid}>
                    {appointments.map((appointment, index) => (
                        <article
                            className={styles.card}
                            key={appointment.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.statusBadge}>
                                    {formatStatus(appointment.status)}
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>{formatDate(appointment.date)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-clock"></i>
                                    <span>{formatTime(appointment.date)}</span>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                <Link to={`/staff-area/appointments/${appointment.id}/details`} className={styles.detailsBtn}>
                                    More Details
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <i className="fa-regular fa-calendar-xmark"></i>
                    </div>
                    <h2>No appointments found</h2>
                    <p>
                        {hasActiveFilters
                            ? "Try adjusting your filters to see more results."
                            : "There are no appointment requests at the moment."}
                    </p>
                </div>
            )}

            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}
        </div>
    );
};

export default StaffAppointmentsItem;