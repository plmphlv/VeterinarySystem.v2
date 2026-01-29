import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useCompleteAppointment, useDeleteAppointment, useGetAppointmentDetails } from "../../../../api/appointmentsAPI";
import type { GetAppointmentDetailsErrors, GetAppointmentDetailsResponse } from "../../../../types";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatDetails";

import styles from "./Staff-Appointments-Item-Details.module.css";

const StaffAppointmentsItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const { completeAppointment, cancelCompleteAppointment } = useCompleteAppointment();

    const navigate = useNavigate();
    const { deleteAppointment, cancelDeleteAppointment } = useDeleteAppointment();
    const [deleting, setDeleting] = useState(false);

    const [appointmentDetails, setAppointmentDetails] =
        useState<GetAppointmentDetailsResponse>();

    const [errors, setErrors] = useState<GetAppointmentDetailsErrors>({});
    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [isLoading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchAppointmentDetails = async () => {
            try {
                setErrors({});
                setLoading(true);

                const details = await getAppointmentDetails({
                    id: Number(id),
                });

                setAppointmentDetails(details || undefined);
            } catch (err: any) {
                setDialog({
                    message:
                        err.title ||
                        "An error occurred while fetching appointment details.",
                    type: "error",
                });
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

    const handleComplete = async () => {
        if (!id) return;

        try {
            setCompleting(true);

            await completeAppointment(Number(id));

            setDialog({
                message: "Appointment completed successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate(`/staff-area/appointments/${id}/details`);
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to complete appointment.",
                type: "error",
            });
        } finally {
            setCompleting(false);
        }
    };

    useEffect(() => {
        return () => cancelCompleteAppointment();
    }, []);


    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteAppointment({ id: Number(id) });

            setDialog({
                message: "Appointment deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/staff-area/appointments");
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete appointment.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeleteAppointment();
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

            {appointmentDetails && (
                <>
                    <h1
                        className={
                            styles["staff-appointments-item-details-h1"]
                        }
                    >
                        Appointment Request Details:
                    </h1>

                    <section
                        className={styles["staff-appointments-item-details"]}
                    >
                        <div
                            className={
                                styles["staff-appointments-item-details-card"]
                            }
                            key={appointmentDetails.id}
                        >
                            <div
                                className={
                                    styles[
                                    "staff-appointments-item-details-content"
                                    ]
                                }
                            >
                                <h2>
                                    <i className="fa-solid fa-calendar-days"></i>{" "}
                                    {formatDate(appointmentDetails.date)}
                                </h2>

                                <p>
                                    <i className="fa-solid fa-clock"></i> Hour:{" "}
                                    {formatTime(appointmentDetails.date)}
                                </p>

                                <p>
                                    <i className="fa-solid fa-pen"></i> Status:{" "}
                                    {formatStatus(
                                        appointmentDetails.appointmentStatus
                                    )}
                                </p>

                                <p>
                                    <i className="fa-solid fa-user"></i> Animal
                                    Owner:{" "}
                                    {appointmentDetails.animalOwnerName}
                                </p>

                                <p>
                                    <i className="fa-solid fa-comment"></i>{" "}
                                    Description:{" "}
                                    {appointmentDetails.description}
                                </p>

                                <div
                                    className={
                                        styles[
                                        "staff-appointments-item-details-actions"
                                        ]
                                    }
                                >
                                    {appointmentDetails.appointmentStatus ===
                                        "Confirmed" && (
                                            <button
                                                onClick={handleComplete}
                                                className={styles["complete-btn"]}
                                                disabled={completing}
                                            >
                                                Complete
                                            </button>
                                        )}

                                    {appointmentDetails.appointmentStatus !== "Completed" && (
                                        <Link
                                            to={`/staff-area/appointments/${id}/edit`}
                                            className={styles["edit-btn"]}
                                        >
                                            Edit
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleDelete}
                                        className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
                                    >
                                        Delete
                                    </button>

                                </div>

                                <Link
                                    to="/staff-area/appointments"
                                    className={
                                        styles[
                                        "staff-appointments-item-details-back-link"
                                        ]
                                    }
                                >
                                    ← Back to All Appointments
                                </Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default StaffAppointmentsItemDetails;