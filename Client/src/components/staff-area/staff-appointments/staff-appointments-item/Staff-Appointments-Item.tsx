import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { useGetAllAppointments } from "../../../../api/appointmentsAPI";
import type { Appointment, AppointmentStatus, GetAllAppointmentsErrors } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatAppointmentDetails";


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

            if (ownerId.trim()) {
                filters.OwnerId = ownerId.trim();
            }

            if (staffId.trim()) {
                filters.StaffId = staffId.trim();
            }

            if (status) filters.Status = status as AppointmentStatus;
            if (startDate) filters.StartDate = startDate;
            if (endDate) filters.EndDate = endDate;


            const fetchedAppointments = await getAllAppointments(filters) || [];

            fetchedAppointments.sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            setAppointments(fetchedAppointments);
        } catch (err: any) {
            setDialog({
                message: "An error occurred while fetching appointments.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, [ownerId, staffId, status, startDate, endDate]);


    useEffect(() => {
        return () => {
            cancelGetAllAppointments();
        };
    }, []);

    return (
        <>
            {appointments.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <>
                    {loading && (
                        <div className="spinner-overlay">
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

                    <section className="appointments-filter">
                        <div className="filter-item">
                            <label htmlFor="ownerId">Owner Account ID:</label>
                            <input
                                id="ownerId"
                                type="text"
                                value={ownerId}
                                onChange={(e) => setOwnerId(e.target.value)}
                            />
                        </div>

                        {/* <div className="filter-item">
                            <label htmlFor="staffId">Staff ID:</label>
                            <input
                                id="staffId"
                                type="text"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                            />
                        </div> */}

                        <div className="filter-item">
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

                        <div className="filter-item">
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-item">
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-actions">
                            <button
                                onClick={() => {
                                    setStaffId("");
                                    setStatus("");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </section>

                    <section className="appointments">
                        {appointments.map((appointment) => (
                            <div className="appointment-card" key={appointment.id}>
                                <div className="content">
                                    <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(appointment.date)}</h2>
                                    <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(appointment.date)}</p>
                                    <p><i className="fa-solid fa-pen"></i> Status: {formatStatus(appointment.status)}</p>
                                    <div className="appointment-actions">
                                        <Link to={`/staff-area/appointments/${appointment.id}/details`} className="more-details-btn">
                                            → More Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            ) : (
                (ownerId ||staffId || status || startDate || endDate) ? (
                    <>
                        {loading && (
                            <div className="spinner-overlay">
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

                        <section className="appointments-filter">
                            <div className="filter-item">
                                <label htmlFor="ownerId">Owner Account ID:</label>
                                <input
                                    id="ownerId"
                                    type="text"
                                    value={ownerId}
                                    onChange={(e) => setOwnerId(e.target.value)}
                                />
                            </div>
                            {/* <div className="filter-item">
                                <label htmlFor="staffId">Staff ID:</label>
                                <input
                                    id="staffId"
                                    type="text"
                                    value={staffId}
                                    onChange={(e) => setStaffId(e.target.value)}
                                />
                            </div> */}

                            <div className="filter-item">
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

                            <div className="filter-item">
                                <label htmlFor="startDate">Start Date:</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="filter-item">
                                <label htmlFor="endDate">End Date:</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div className="filter-actions">
                                <button
                                    onClick={() => {
                                        setStaffId("");
                                        setStatus("");
                                        setStartDate("");
                                        setEndDate("");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </section>

                        <h1 className="no-appointments">No appointments found for the current filter.</h1>
                    </>
                ) : (
                    <h1 className="no-appointments">No appointments found.</h1>
                )
            )}

            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}
        </>
    );
};

export default StaffAppointmentsItem;
