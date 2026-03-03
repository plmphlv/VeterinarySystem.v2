import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import styles from "./Templates-Item-Details.module.css";
import { useDeleteTemplate, useGetTemplateDetails } from "../../../../api/templatesAPI";
import type { GetTemplateDetailsResponse } from "../../../../types";
import { getJwtDecodedData } from "../../../../utils/getJwtDecodedData";

const TemplatesItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getTemplateDetails, cancelGetTemplateDetails } = useGetTemplateDetails();
    const [templateDetails, setTemplateDetails] = useState<GetTemplateDetailsResponse | null>(null);

    const navigate = useNavigate();
    const { deleteTemplate, cancelDeleteTemplate } = useDeleteTemplate();
    const [deleting, setDeleting] = useState(false);

    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [loading, setLoading] = useState(true);

    // Permission check
    const decodedData = getJwtDecodedData();
    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const canManage = role === "SuperAdministrator" || role === "Administrator";

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const result = await getTemplateDetails(id);
                if (!result) throw new Error("Template not found");
                setTemplateDetails(result);
            } catch {
                setDialog({ message: "Failed to load template details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        return () => cancelGetTemplateDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this template? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            await deleteTemplate(id);
            setDialog({ message: "Template deleted successfully.", type: "success" });
            setTimeout(() => {
                navigate("/staff-area/templates");
            }, 1500);
        } catch {
            setDialog({ message: "Failed to delete template.", type: "error" });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => cancelDeleteTemplate();
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
            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            <div className={styles.navWrapper}>
                <Link to="/staff-area/templates" className={styles.backLink}>
                    &larr; Back to Templates
                </Link>
            </div>

            {templateDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-file-lines"></i>
                        </div>
                        <h1 className={styles.title}>{templateDetails.name}</h1>
                        
                        <div className={styles.statusWrapper}>
                            <span className={`${styles.badge} ${templateDetails.isActive ? styles.active : styles.inactive}`}>
                                {templateDetails.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.label}>ID</span>
                                <span className={styles.value}>#{templateDetails.id}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.label}>Type</span>
                                <span className={styles.value}>{templateDetails.type}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.contentSection}>
                            <h3 className={styles.sectionTitle}>Content</h3>
                            <div className={styles.contentBox}>
                                {templateDetails.content}
                            </div>
                        </div>
                    </div>

                    {canManage && (
                        <footer className={styles.cardFooter}>
                            <Link 
                                to={`/staff-area/templates/${id}/edit`} 
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
                    )}
                </article>
            )}
        </div>
    );
};

export default TemplatesItemDetails;