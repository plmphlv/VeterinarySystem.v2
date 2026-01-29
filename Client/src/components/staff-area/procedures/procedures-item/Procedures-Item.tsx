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

    return (
        <>
            {procedures.length > 0 && (!errors || Object.keys(errors).length === 0) ? (
                <>
                    {loading && <div className="spinner-overlay"><Spinner /></div>}
                    {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

                    <section className={styles["procedures-filter"]}>
                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="staffId">Staff ID:</label>
                            <input id="staffId" type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="animalId">Animal ID:</label>
                            <input id="animalId" type="text" value={animalId} onChange={(e) => setAnimalId(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="procedureName">Procedure Name:</label>
                            <input id="procedureName" type="text" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="description">Description:</label>
                            <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-actions"]}>
                            <button className={styles["procedures-clear-filters-btn"]} onClick={() => { setStaffId(""); setAnimalId(""); setProcedureName(""); setDescription(""); setStartDate(""); setEndDate(""); }}>
                                Clear Filters
                            </button>
                        </div>
                    </section>

                    <section className={styles["procedures-filter-item"]}>
                        {procedures.map((procedure) => (
                            <div className={styles["procedures-item-card"]} key={procedure.id}>
                                <div className={styles["procedures-item-content"]}>
                                    <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(procedure.date)}</h2>
                                    <p><i className="fa-solid fa-pen"></i> Name: {procedure.name}</p>
                                    <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(procedure.date)}</p>
                                    <div className={styles["procedures-item-actions"]}>
                                        <Link to={`/staff-area/procedures/${procedure.id}/details`} className={styles["procedures-item-more-details-btn"]}>
                                            → More Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            ) : (
                <>
                    {loading && <div className="spinner-overlay"><Spinner /></div>}
                    {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

                    <section className={styles["procedures-filter"]}>
                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="staffId">Staff ID:</label>
                            <input id="staffId" type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="animalId">Animal ID:</label>
                            <input id="animalId" type="text" value={animalId} onChange={(e) => setAnimalId(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="procedureName">Procedure Name:</label>
                            <input id="procedureName" type="text" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="description">Description:</label>
                            <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-item"]}>
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <div className={styles["procedures-filter-actions"]}>
                            <button onClick={() => { setStaffId(""); setAnimalId(""); setProcedureName(""); setDescription(""); setStartDate(""); setEndDate(""); }}>
                                Clear Filters
                            </button>
                        </div>
                    </section>

                    <h1 className={styles["procedures-item-no-procedures"]}>
                        {staffId || animalId || procedureName || description || startDate || endDate
                            ? "No procedures found for the current filter."
                            : "No procedures found."}
                    </h1>
                </>
            )}

            {error && showError && <Dialog message={error} type="error" onClose={() => setShowError(false)} />}
        </>
    );
};

export default ProceduresItem;