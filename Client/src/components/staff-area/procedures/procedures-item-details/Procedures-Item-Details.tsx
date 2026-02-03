import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatTime } from "../../../../utils/formatDetails";
import styles from "./Procedures-Item-Details.module.css";
import { useDeleteProcedure, useGetProcedureDetails } from "../../../../api/proceduresAPI";
import type { GetProcedureDetailsErrors, GetProcedureDetailsResponse } from "../../../../types";

const ProceduresItemDetails: React.FC = () => {
    const { id } = useParams();
    const { getProcedureDetails, cancelGetProcedureDetails } = useGetProcedureDetails();
    const [errors, setErrors] = useState<GetProcedureDetailsErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [procedureDetails, setProcedureDetails] = useState<GetProcedureDetailsResponse>();
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { deleteProcedure, cancelDeleteProcedure } = useDeleteProcedure();
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProcedureDetails = async () => {
            try {
                setErrors({});
                setLoading(true);

                const details = await getProcedureDetails({ id: Number(id) });
                setProcedureDetails(details || undefined);

            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching procedure details.", type: "error" });
                setErrors(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProcedureDetails();
    }, [id]);

    useEffect(() => {
        return () => cancelGetProcedureDetails();
    }, []);

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this procedure?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteProcedure({ id: Number(id) });

            setDialog({
                message: "Procedure deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/staff-area/procedures");
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete procedure.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeleteProcedure();
        };
    }, []);

    return (
        <div className={styles.container}>
            {(isLoading || deleting) && (
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
                <Link to="/staff-area/procedures" className={styles.backLink}>
                    &larr; Back to All Procedures
                </Link>
            </div>

            {procedureDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-file-medical"></i>
                        </div>
                        <h1 className={styles.title}>{procedureDetails.name}</h1>
                        <p className={styles.subtitle}>Procedure Details</p>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Date</span>
                                <span className={styles.value}>{formatDate(procedureDetails.date)}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Time</span>
                                <span className={styles.value}>{formatTime(procedureDetails.date)}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-paw"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Animal</span>
                                <span className={styles.value}>{procedureDetails.animalName} (ID: {procedureDetails.animalId})</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-user-doctor"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Staff Member</span>
                                <span className={styles.value}>{procedureDetails.staffMemberName} (ID: {procedureDetails.staffProfileId})</span>
                            </div>
                        </div>

                        <div className={`${styles.detailRow} ${styles.descriptionRow}`}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-comment-medical"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Description</span>
                                <p className={styles.description}>{procedureDetails.description}</p>
                            </div>
                        </div>
                    </div>

                    <footer className={styles.cardFooter}>
                        <Link
                            to={`/staff-area/procedures/${id}/edit`}
                            className={styles.editBtn}
                        >
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className={styles.deleteBtn}
                            disabled={deleting}
                        >
                            <i className="fa-solid fa-trash"></i> {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </footer>
                </article>
            )}
        </div>
    );
};

export default ProceduresItemDetails;