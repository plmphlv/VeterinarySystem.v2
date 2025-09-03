import { Link } from "react-router";
import { getJwtDecodedData } from "../../../utils/getJwtDecodedData";
import { useGetAllAppointments } from "../../../api/userAppointmentsAPI";
import { useEffect, useState } from "react";
import type { Appointment, AppointmentStatus, GetAllAppointmentsErrors } from "../../../types";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import { useGetUserData } from "../../../hooks/useGetUserData";

const AppointmentsItem: React.FC = () => {
    const decodedData = getJwtDecodedData();
    const { getAllAppointments, cancelGetAllAppointments } = useGetAllAppointments();

    const [errors, setErrors] = useState<GetAllAppointmentsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setLoading] = useState(true);
    const userData = useGetUserData();

    const [staffId, setStaffId] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const formatStatus = (status: AppointmentStatus) => {
        switch (status) {
            case "Pending_Review":
                return "Pending review";
            case "Confirmed":
                return "Confirmed";
            case "Completed":
                return "Completed";
            case "Cancelled":
                return "Cancelled";
            case "Missed":
                return "Missed";
            default:
                return status;
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekday = weekdays[date.getDay()];

        return `${day}.${month}.${year} (${weekday}), ${hours}:${minutes}h`;
    };

    const fetchAppointments = async () => {
        try {
            setErrors({});
            setLoading(true);

            let fetchedAppointments: Appointment[] = [];

            const filters: any = {};

            if (decodedData?.AccountId) {
                filters.OwnerId = decodedData.AccountId;
            }
            if (decodedData?.StaffId) {
                filters.StaffId = decodedData.StaffId;
            }

            if (staffId.trim() !== "") {
                filters.StaffId = staffId.trim();
            }

            if (status !== "") {
                filters.Status = status as AppointmentStatus;
            }

            if (startDate !== "") {
                filters.StartDate = startDate;
            }

            if (endDate !== "") {
                filters.EndDate = endDate;
            }

            console.log(filters);

            fetchedAppointments = (await getAllAppointments(filters)) || [];

            fetchedAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setAppointments(fetchedAppointments);
        } catch (err: any) {
            let errorMessage = "An error occurred while fetching appointments.";
            if (err?.errors && typeof err.errors === "object") {
                const firstKey = Object.keys(err.errors)[0];
                if (firstKey && Array.isArray(err.errors[firstKey]) && err.errors[firstKey][0]) {
                    errorMessage = err.errors[firstKey][0];
                }
            }
            setDialog({ message: errorMessage, type: "error" });
            setErrors(err.errors);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!decodedData) return;
        fetchAppointments();
    }, [decodedData?.AccountId]);

    useEffect(() => {
        return () => {
            cancelGetAllAppointments();
        };
    }, []);

    return (
        <>
            {isLoading && (
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

            {!userData && (
                <h1 className="h1-profile">No user data found, please try again later.</h1>
            )}

            {appointments.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <>
                    <section className="appointments-filter">
                        <div className="filter-item">
                            <label htmlFor="staffId">Staff ID:</label>
                            <input
                                id="staffId"
                                type="text"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                            />
                        </div>

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

                        <button onClick={fetchAppointments}>Apply Filters</button>
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
                    </section>

                    <section className="appointments">
                        {appointments.map((appointment) => (
                            <div className="appointment-card" key={appointment.id}>
                                <div className="content">
                                    <h2>{formatDate(appointment.date)}</h2>
                                    <p>Status: {formatStatus(appointment.status)}</p>
                                    <p>Staff member name: {appointment.staffMemberName}</p>
                                    <div className="appointment-actions">
                                        <Link to={`/appointments/${appointment.id}/details`} className="more-details-btn">→ More Details</Link>
                                        <Link to={`/appointments/${appointment.id}/edit-request`} className="edit-request">Edit Request</Link>
                                        <Link to={`/appointments/${appointment.id}/delete-request`} className="delete-request">Delete Request</Link>
                                        {decodedData?.StaffId ? (
                                            <>
                                                <Link to={`/appointments/${appointment.id}/complete`} className="complete-appointment">Complete Appointment</Link>
                                                <Link to={`/appointments/${appointment.id}/edit`} className="edit-appointment">Edit Appointment</Link>
                                                <Link to={`/appointments/${appointment.id}/delete`} className="delete-appointment">Delete Appointment</Link>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            ) : (
                <h1 className="no-appointments">No Appointments Found.</h1>
            )}
        </>
    );
};

export default AppointmentsItem;
