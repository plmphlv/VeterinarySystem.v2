import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import type { GetPrescriptionDetailsResponse } from "../../../../types";
import styles from "./Prescriptions-Item-Details.module.css";

import { useGetPrescriptionDetails, useDeletePrescription } from "../../../../api/prescriptionsAPI";

const PrescriptionItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPrescriptionDetails, cancelGetPrescriptionDetails } = useGetPrescriptionDetails();
    const { deletePrescription, cancelDeletePrescription } = useDeletePrescription();

    const [prescriptionDetails, setPrescriptionDetails] = useState<GetPrescriptionDetailsResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    /* =======================
       Fetch prescription
    ======================== */
    useEffect(() => {
        if (!id) return;

        const fetchPrescriptionDetails = async () => {
            try {
                setLoading(true);

                const result = await getPrescriptionDetails({
                    id: Number(id),
                });

                if (result) {
                    setPrescriptionDetails(result);
                } else {
                    setDialog({
                        message: "Prescription details not found.",
                        type: "error",
                    });
                }
            } catch {
                setDialog({
                    message: "Failed to load prescription details.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptionDetails();

        return () => {
            cancelGetPrescriptionDetails();
        };
    }, [id]);

    /* =======================
       Delete handler
    ======================== */
    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this prescription?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deletePrescription({ id: Number(id) });

            setDialog({
                message: "Prescription deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/staff-area/prescriptions");
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete prescription.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeletePrescription();
        };
    }, []);

    if (loading) {
        return (
            <div className={styles.spinnerOverlay}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {(loading || deleting) && (
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
                <Link to="/staff-area/prescriptions" className={styles.backLink}>
                    &larr; Back to Prescriptions
                </Link>
            </div>

            {prescriptionDetails ? (
                <>
                    <article className={styles.prescriptionCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.rxSymbol}>Rx</span>
                            <div className={styles.headerInfo}>
                                <span className={styles.headerTitle}>
                                    Prescription No.
                                </span>
                                <span className={styles.prescriptionNumber}>
                                    #{prescriptionDetails.number}
                                </span>
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.fieldGroup}>
                                <span className={styles.label}>
                                    Internal ID
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.id}
                                </span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <span className={styles.label}>
                                    Date Issued
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.issueDate}
                                </span>
                            </div>

                            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                                <span className={styles.label}>
                                    Description / Medication
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.description}
                                </span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <span className={styles.label}>
                                    Animal ID
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.animalId}
                                </span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <span className={styles.label}>
                                    Animal Name
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.animalName}
                                </span>
                            </div>

                            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                                <span className={styles.label}>
                                    Owner Name
                                </span>
                                <span className={styles.value}>
                                    {prescriptionDetails.ownerName}
                                </span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.signatureLine}>
                                <span className={styles.staffName}>
                                    {prescriptionDetails.staffName}
                                </span>
                                <span className={styles.signatureLabel}>
                                    Veterinarian Signature
                                </span>
                            </div>
                        </div>
                    </article>

                    <div className={styles.actions}>
                        <Link
                            to={`/staff-area/prescriptions/${prescriptionDetails.id}/edit`}
                            className={styles.editBtn}
                        >
                            <i className="fa-solid fa-pen-to-square"></i> Edit Prescription
                        </Link>

                        <button
                            onClick={handleDelete}
                            className={styles.deleteBtn}
                            disabled={deleting}
                        >
                            <i className="fa-solid fa-trash"></i> {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </>
            ) : (
                <h2 className={styles.errorMessage}>
                    Prescription not found.
                </h2>
            )}
        </div>
    );
};

export default PrescriptionItemDetails;