import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetAppointmentDetails } from "../../../../api/appointmentsAPI";
import type { GetAppointmentDetailsErrors, GetAppointmentDetailsResponse } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatAppointmentDetails";
import styles from "./Staff-Appointments-Item-Details.module.css";

const StaffAppointmentsItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const [errors, setErrors] = useState<GetAppointmentDetailsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<GetAppointmentDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAppointmentDetails = async () => {
            try {
                setErrors({});
                setLoading(true);

                const details = await getAppointmentDetails({ id: Number(id) });
                setAppointmentDetails(details || undefined);

            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching appointment details.", type: "error" });
                setErrors(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
    }, [id]);

    useEffect(() => {
        return () => cancelGetAppointmentDetails();
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

            {appointmentDetails && (
                <>
                    <h1 className={styles["staff-appointments-item-details-h1"]}>Appointment Request Details:</h1>

                    <section className={styles["staff-appointments-item-details"]}>
                        <div className={styles["staff-appointments-item-details-card"]} key={appointmentDetails.id}>
                            <div className={styles["staff-appointments-item-details-content"]}>
                                <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(appointmentDetails.date)}</h2>
                                <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(appointmentDetails.date)}</p>
                                <p><i className="fa-solid fa-pen"></i> Status: {formatStatus(appointmentDetails.appointmentStatus)}</p>
                                <p><i className="fa-solid fa-user"></i> Animal Owner: {appointmentDetails.animalOwnerName}</p>
                                <p><i className="fa-solid fa-comment"></i> Description: {appointmentDetails.description}</p>

                                <div className={styles["staff-appointments-item-details-actions"]}>
                                    <Link to={`/staff-area/appointments/${id}/update-request`} className={styles["update-request"]}>Update</Link>
                                    <Link to={`/staff-area/appointments/${id}/delete-request`} className={styles["delete-request"]}>Delete</Link>
                                </div>
                                <Link to="/staff-area/appointments" className={styles["staff-appointments-item-details-back-link"]}>← Back to All Appointments</Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default StaffAppointmentsItemDetails;
