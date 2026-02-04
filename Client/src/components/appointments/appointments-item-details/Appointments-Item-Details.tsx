import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { GetAppointmentDetailsErrors, GetAppointmentDetailsResponse } from "../../../types";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import { useDeleteAppointmentRequest, useGetAppointmentDetails } from "../../../api/appointmentsAPI";
import { formatDate, formatStatus, formatTime } from "../../../utils/formatDetails";
import styles from "./Appointments-Item-Details.module.css";

const AppointmentsItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const [errors, setErrors] = useState<GetAppointmentDetailsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<GetAppointmentDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { deleteAppointmentRequest, cancelDeleteAppointmentRequest } = useDeleteAppointmentRequest();
    const [deleting, setDeleting] = useState(false);

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


    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteAppointmentRequest({ id: Number(id) });

            setDialog({
                message: "Appointment deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/appointments");
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
            cancelDeleteAppointmentRequest();
        };
    }, []);

    return (
        <div className={styles.container}>
            {isLoading && (
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

            <div className={styles.navWrapper}>
                <Link to="/appointments" className={styles.backLink}>
                    &larr; Back to Appointments
                </Link>
            </div>

            {appointmentDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.statusBadge}>
                            {formatStatus(appointmentDetails.appointmentStatus)}
                        </div>
                        <h1 className={styles.cardTitle}>Appointment Details</h1>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Date</span>
                                <span className={styles.value}>{formatDate(appointmentDetails.date)}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Time</span>
                                <span className={styles.value}>{formatTime(appointmentDetails.date)}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Animal Owner</span>
                                <span className={styles.value}>{appointmentDetails.animalOwnerName}</span>
                            </div>
                        </div>

                        <div className={`${styles.detailRow} ${styles.descriptionRow}`}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-pen"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Description</span>
                                <p className={styles.description}>{appointmentDetails.description}</p>
                            </div>
                        </div>
                    </div>

                    <footer className={styles.cardFooter}>
                        <Link to={`/appointments/${id}/update-request`} className={styles.updateBtn}>
                            <i className="fa-solid fa-pen-to-square"></i> Update
                        </Link>
                        <button onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
                            <i className="fa-solid fa-trash"></i> {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </footer>
                </article>
            )}
        </div>
    );
};

export default AppointmentsItemDetails;