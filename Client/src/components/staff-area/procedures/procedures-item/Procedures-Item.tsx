import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatDetails";
import styles from "./Procedures-Item.module.css";
import { useGetAllProcedures } from "../../../../api/proceduresAPI";
import type { GetAllProceduresErrors, Procedure } from "../../../../types";

const ProceduresItem: React.FC = () => {
    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);
    const { getAllProcedures, cancelGetAllProcedures } = useGetAllProcedures();

    const [errors, setErrors] = useState<GetAllProceduresErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(false);

    const [staffId, setStaffId] = useState("");
    const [animalId, setAnimalId] = useState("");
    const [procedureName, setProcedureName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchAllProcedures = async () => {
        try {
            setLoading(true);
            setErrors({});

            const filters: any = {};
            if (animalId.trim()) filters.AnimalId = animalId.trim();
            if (staffId.trim()) filters.StaffId = staffId.trim();
            if (procedureName) filters.ProcedureName = procedureName;
            if (description) filters.Description = description;
            if (startDate) filters.StartDate = startDate;
            if (endDate) filters.EndDate = endDate;

            const fetchedProcedures = (await getAllProcedures(filters)) || [];
            fetchedProcedures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setProcedures(fetchedProcedures);
        } catch {
            setDialog({ message: "An error occurred while fetching procedures.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProcedures();
    }, [animalId, staffId, procedureName, description, startDate, endDate]);

    useEffect(() => cancelGetAllProcedures, []);

    const hasActiveFilters = staffId || animalId || procedureName || description || startDate || endDate;

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
                        <label htmlFor="procedureName"><i className="fa-solid fa-file-signature"></i> Procedure</label>
                        <input
                            type="text"
                            id="procedureName"
                            placeholder="Search by Name"
                            value={procedureName}
                            onChange={(e) => setProcedureName(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="staffId"><i className="fa-solid fa-user-doctor"></i> Staff ID</label>
                        <input
                            type="text"
                            id="staffId"
                            placeholder="Search by ID"
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="animalId"><i className="fa-solid fa-paw"></i> Animal ID</label>
                        <input
                            type="text"
                            id="animalId"
                            placeholder="Search by ID"
                            value={animalId}
                            onChange={(e) => setAnimalId(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="description"><i className="fa-solid fa-pen"></i> Description</label>
                        <input
                            type="text"
                            id="description"
                            placeholder="Search description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="startDate"><i className="fa-solid fa-calendar-days"></i> Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="endDate"><i className="fa-solid fa-calendar-days"></i> End Date</label>
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
                        onClick={() => { setStaffId(""); setAnimalId(""); setProcedureName(""); setDescription(""); setStartDate(""); setEndDate(""); }}
                        disabled={!hasActiveFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            </section>

            {procedures.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <section className={styles.grid}>
                    {procedures.map((procedure, index) => (
                        <article
                            className={styles.card}
                            key={procedure.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconCircle}>
                                    <i className="fa-solid fa-stethoscope"></i>
                                </div>
                                <h2>{procedure.name}</h2>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>{formatDate(procedure.date)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-clock"></i>
                                    <span>{formatTime(procedure.date)}</span>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <Link to={`/staff-area/procedures/${procedure.id}/details`} className={styles.detailsBtn}>
                                    More Details
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                !loading && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i className="fa-solid fa-file-medical-alt"></i>
                        </div>
                        <h2>No procedures found</h2>
                        <p>
                            {hasActiveFilters
                                ? "Try adjusting your filters to see more results."
                                : "There are no procedures recorded yet."}
                        </p>
                    </div>
                )
            )}

            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}
        </div>
    );
};

export default ProceduresItem;