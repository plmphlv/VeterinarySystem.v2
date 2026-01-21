import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router"; 

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import type { GetPrescriptionDetailsResponse } from "../../../../types"; 
import styles from "./Prescriptions-Item-Details.module.css";
import { useGetPrescriptionDetails } from "../../../../api/prescriptionsAPI";

const PrescriptionItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPrescriptionDetails, cancelGetPrescriptionDetails } = useGetPrescriptionDetails();

    const [prescriptionDetails, setPrescriptionDetails] = useState<GetPrescriptionDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPrescriptionDetails = async () => {
            try {
                setLoading(true);

                const result = await getPrescriptionDetails({ id: Number(id) });
                
                if (result) {
                    setPrescriptionDetails(result);
                } else {
                     setDialog({
                        message: "Prescription details not found.",
                        type: "error",
                    });
                }
                
            } catch (err) {
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

    if (loading) {
        return (
            <div className="spinner-overlay">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            <section className={styles["prescription-item-details-container"]}>
                {prescriptionDetails ? (
                    <>
                        <div className={styles["prescription-item-details-card"]}>
                            <div className={styles["card-header"]}>
                                <span className={styles["rx-symbol"]}>Rx</span>
                                <div className={styles["header-info"]}>
                                    <span className={styles["header-title"]}>Prescription No.</span>
                                    <span className={styles["prescription-number"]}>#{prescriptionDetails.number}</span>
                                </div>
                            </div>
                            
                            <div className={styles["card-body"]}>
                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Internal ID</span>
                                    <span className={styles["value"]}>{prescriptionDetails.id}</span>
                                </div>
                                
                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Date Issued</span>
                                    <span className={styles["value"]}>{prescriptionDetails.issueDate}</span>
                                </div>

                                <div className={`${styles["field-group"]} ${styles["full-width"]}`}>
                                    <span className={styles["label"]}>Description / Medication</span>
                                    <span className={styles["value"]}>{prescriptionDetails.description}</span>
                                </div>

                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Animal ID</span>
                                    <span className={styles["value"]}>{prescriptionDetails.animalId}</span>
                                </div>

                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Animal Name</span>
                                    <span className={styles["value"]}>{prescriptionDetails.animalName}</span>
                                </div>

                                <div className={`${styles["field-group"]} ${styles["full-width"]}`}>
                                    <span className={styles["label"]}>Owner Name</span>
                                    <span className={styles["value"]}>{prescriptionDetails.ownerName}</span>
                                </div>
                            </div>

                            <div className={styles["card-footer"]}>
                                <div className={styles["signature-line"]}>
                                    <span className={styles["staff-name"]}>{prescriptionDetails.staffName}</span>
                                    <span className={styles["signature-label"]}>Veterinarian Signature</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles["external-actions"]}>
                            <Link 
                                to={`/staff-area/prescriptions/${prescriptionDetails.id}/edit`}
                                className={`${styles["action-btn"]} ${styles["edit-btn"]}`}
                            >
                                Edit Prescription
                            </Link>

                            <Link 
                                to={`/staff-area/prescriptions/${prescriptionDetails.id}/delete`}
                                className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
                            >
                                Delete
                            </Link>
                        </div>
                    </>
                ) : (
                    !loading && (
                        <h2 className={styles["error-message"]}>
                            Prescription not found.
                        </h2>
                    )
                )}
            </section>
        </>
    );
};

export default PrescriptionItemDetails;