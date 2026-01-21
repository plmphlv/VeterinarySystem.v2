import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchAllPrescriptions();
    }, [animalId, staffId, startDate, endDate, prescriptionNumber]);

    useEffect(() => {
        return () => {
            cancelGetAllPrescriptions();
        };
    }, []);

    return (
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

            <section className={styles["filters"]}>
                <input
                    type="number"
                    placeholder="Animal ID"
                    value={animalId}
                    onChange={(e) => setAnimalId(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Prescription Number"
                    value={prescriptionNumber}
                    onChange={(e) => setPrescriptionNumber(e.target.value)}
                />
            </section>

            <section className={styles["prescriptions"]}>
                {!loading && prescriptions.length > 0 ? (
                    prescriptions.map((p) => (
                        <div key={p.id} className={styles["prescription-card"]}>
                            <div className={styles["card-header"]}>
                                <span className={styles["rx-symbol"]}>Rx</span>
                                <div className={styles["header-info"]}>
                                    <span className={styles["header-title"]}>Prescription No.</span>
                                    <span className={styles["prescription-number"]}>#{p.number}</span>
                                </div>
                            </div>
                            
                            <div className={styles["card-body"]}>
                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Internal ID</span>
                                    <span className={styles["value"]}>{p.id}</span>
                                </div>
                                
                                <div className={styles["field-group"]}>
                                    <span className={styles["label"]}>Date Issued</span>
                                    <span className={styles["value"]}>{p.issueDate}</span>
                                </div>
                            </div>

                            <div className={styles["card-footer"]}>
                                <div className={styles["actions"]}>
                                    <Link 
                                        to={`/staff-area/prescriptions/${p.id}/details`}
                                        className={styles["details-btn"]}
                                    >
                                        More Details
                                    </Link>
                                </div>
                                <div className={styles["signature-line"]}>
                                    <span className={styles["staff-name"]}>{p.staffName}</span>
                                    <span className={styles["signature-label"]}>Veterinarian Signature</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && (
                        <h2 className={styles["no-prescriptions"]}>
                            No prescriptions found.
                        </h2>
                    )
                )}
            </section>
        </>
    );
};

export default PrescriptionsItem;