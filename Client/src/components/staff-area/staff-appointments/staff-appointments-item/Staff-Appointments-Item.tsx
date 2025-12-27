import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { useGetAllAppointments } from "../../../../api/appointmentsAPI";
import type { Appointment, AppointmentStatus, GetAllAppointmentsErrors } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatAppointmentDetails";
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

    return (
        <>
            {appointments.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <>
                    {loading && <div className="spinner-overlay"><Spinner /></div>}
                    {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

                    <section className={styles["staff-appointments-filter"]}>
                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="ownerId">Owner Account ID:</label>
                            <input id="ownerId" type="text" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="status">Select Status:</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">--</option>
                                <option value="Pending_Review">Pending Review</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Missed">Missed</option>
                            </select>
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-actions"]}>
                            <button onClick={() => { setStaffId(""); setStatus(""); setStartDate(""); setEndDate(""); }}>
                                Clear Filters
                            </button>
                        </div>
                    </section>

                    <section className={styles["staff-appointments-item"]}>
                        {appointments.map((appointment) => (
                            <div className={styles["staff-appointments-item-card"]} key={appointment.id}>
                                <div className={styles["staff-appointments-item-content"]}>
                                    <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(appointment.date)}</h2>
                                    <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(appointment.date)}</p>
                                    <p><i className="fa-solid fa-pen"></i> Status: {formatStatus(appointment.status)}</p>
                                    <div className={styles["staff-appointments-item-actions"]}>
                                        <Link to={`/staff-area/appointments/${appointment.id}/details`} className={styles["staff-appointments-item-more-details-btn"]}>
                                            → More Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            ) : (
                <>
                    {loading && <div className="spinner-overlay"><Spinner /></div>}
                    {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

                    <section className={styles["staff-appointments-filter"]}>
                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="ownerId">Owner Account ID:</label>
                            <input id="ownerId" type="text" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="status">Select Status:</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">--</option>
                                <option value="Pending_Review">Pending Review</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Missed">Missed</option>
                            </select>
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-item"]}>
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <div className={styles["staff-appointments-filter-actions"]}>
                            <button onClick={() => { setStaffId(""); setStatus(""); setStartDate(""); setEndDate(""); }}>
                                Clear Filters
                            </button>
                        </div>
                    </section>

                    <h1 className={styles["staff-appointments-item-no-appointments"]}>
                        {ownerId || staffId || status || startDate || endDate
                            ? "No appointments found for the current filter."
                            : "No appointments found."}
                    </h1>
                </>
            )}

            {error && showError && <Dialog message={error} type="error" onClose={() => setShowError(false)} />}
        </>
    );
};

export default StaffAppointmentsItem;