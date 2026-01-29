import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { formatDate, formatStatus, formatTime } from "../../../../utils/formatDetails";
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
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}

            {procedureDetails && (
                <>
                    <h1 className={styles["procedures-item-details-h1"]}>Procedure Details:</h1>

                    <section className={styles["procedures-item-details"]}>
                        <div className={styles["procedures-item-details-card"]} key={procedureDetails.id}>
                            <div className={styles["procedures-item-details-content"]}>
                                <h2><i className="fa-solid fa-calendar-days"></i> {formatDate(procedureDetails.date)}</h2>
                                <p><i className="fa-solid fa-file-signature"></i> Procedure Name: {procedureDetails.name}</p>
                                <p><i className="fa-solid fa-clock"></i> Hour: {formatTime(procedureDetails.date)}</p>
                                <p><i className="fa-solid fa-pen"></i> ID: {procedureDetails.id}</p>
                                <p><i className="fa-solid fa-pen"></i> Animal ID: {procedureDetails.animalId}</p>
                                <p><i className="fa-solid fa-file-signature"></i> Animal Name: {procedureDetails.animalName}</p>
                                <p><i className="fa-solid fa-id-badge"></i> Staff Profile ID: {procedureDetails.staffProfileId}</p>
                                <p><i className="fa-solid fa-file-signature"></i> Staff Member Name: {procedureDetails.staffMemberName}</p>
                                <p><i className="fa-solid fa-comment"></i> Description: {procedureDetails.description}</p>

                                <div className={styles["procedures-item-details-actions"]}>
                                    <Link to={`/staff-area/procedures/${id}/edit`} className={styles["procedures-item-details-edit-btn"]}>Edit</Link>
                                    <button onClick={handleDelete} className={`${styles["procedures-item-details-delete-btn"]}`}>Delete</button>
                                </div>
                                <Link to="/staff-area/procedures" className={styles["procedures-item-details-back-link"]}>← Back to All Procedures</Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default ProceduresItemDetails;
