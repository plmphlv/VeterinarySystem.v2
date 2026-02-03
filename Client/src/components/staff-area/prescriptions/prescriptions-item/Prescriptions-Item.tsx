import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Prescriptions-Item.module.css";
import { useGetAllPrescriptions } from "../../../../api/prescriptionsAPI";
import type {
    GetAllPrescriptionsRequest,
    Prescription,
} from "../../../../types";

const PrescriptionsItem: React.FC = () => {
    const { getAllPrescriptions, cancelGetAllPrescriptions } =
        useGetAllPrescriptions();

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [animalId, setAnimalId] = useState("");
    const [staffId, setStaffId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [prescriptionNumber, setPrescriptionNumber] = useState("");

    const fetchAllPrescriptions = async () => {
        try {
            setLoading(true);

            const filters: GetAllPrescriptionsRequest = {};

            if (animalId.trim()) {
                filters.AnimalId = Number(animalId);
            }

            if (staffId.trim()) {
                filters.StaffId = staffId.trim();
            }

            if (startDate.trim()) {
                filters.StartDate = startDate;
            }

            if (endDate.trim()) {
                filters.EndDate = endDate;
            }

            const result = await getAllPrescriptions(filters);
            
            let filteredData = result ?? [];

            if (prescriptionNumber.trim()) {
                const search = prescriptionNumber.trim().toLowerCase();
                filteredData = filteredData.filter((p) => 
                    p.number?.toString().toLowerCase().includes(search)
                );
            }

            setPrescriptions(filteredData);
        } catch {
            setDialog({
                message: "An error occurred while fetching prescriptions.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setAnimalId("");
        setStaffId("");
        setStartDate("");
        setEndDate("");
        setPrescriptionNumber("");
    };

    useEffect(() => {
        fetchAllPrescriptions();
    }, [animalId, staffId, startDate, endDate, prescriptionNumber]);

    useEffect(() => {
        return () => {
            cancelGetAllPrescriptions();
        };
    }, []);

    const hasActiveFilters = animalId || staffId || startDate || endDate || prescriptionNumber;

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
                        <label htmlFor="prescriptionNumber"><i className="fa-solid fa-arrow-down-1-9"></i> Prescription #</label>
                        <input
                            type="text"
                            id="prescriptionNumber"
                            placeholder="Search by number"
                            value={prescriptionNumber}
                            onChange={(e) => setPrescriptionNumber(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="animalId"><i className="fa-solid fa-id-badge"></i> Animal ID</label>
                        <input
                            type="number"
                            id="animalId"
                            placeholder="Search by Animal ID"
                            value={animalId}
                            onChange={(e) => setAnimalId(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="staffId"><i className="fa-solid fa-user-doctor"></i> Staff ID</label>
                        <input
                            type="text"
                            id="staffId"
                            placeholder="Search by Staff ID"
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="startDate"><i className="fa-solid fa-calendar-days"></i> From</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="endDate"><i className="fa-solid fa-calendar-days"></i> To</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterActions}>
                    <button 
                        className={styles.clearBtn}
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            </section>

            {!loading && prescriptions.length > 0 ? (
                <section className={styles.grid}>
                    {prescriptions.map((p, index) => (
                        <div 
                            key={p.id} 
                            className={styles.prescriptionCard}
                            style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.rxSymbol}>Rx</span>
                                <div className={styles.headerInfo}>
                                    <span className={styles.headerTitle}>Prescription No.</span>
                                    <span className={styles.prescriptionNumber}>#{p.number}</span>
                                </div>
                            </div>
                            
                            <div className={styles.cardBody}>
                                <div className={styles.fieldGroup}>
                                    <span className={styles.label}>Internal ID</span>
                                    <span className={styles.value}>{p.id}</span>
                                </div>
                                
                                <div className={styles.fieldGroup}>
                                    <span className={styles.label}>Date Issued</span>
                                    <span className={styles.value}>{p.issueDate}</span>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.actions}>
                                    <Link 
                                        to={`/staff-area/prescriptions/${p.id}/details`}
                                        className={styles.detailsBtn}
                                    >
                                        More Details
                                    </Link>
                                </div>
                                <div className={styles.signatureLine}>
                                    <span className={styles.staffName}>{p.staffName}</span>
                                    <span className={styles.signatureLabel}>Veterinarian Signature</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                !loading && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i className="fa-solid fa-file-prescription"></i>
                        </div>
                        <h2>No prescriptions found</h2>
                        <p>
                            {hasActiveFilters
                                ? "Try adjusting your search filters."
                                : "There are no prescriptions issued yet."}
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default PrescriptionsItem;