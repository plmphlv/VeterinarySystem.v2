import { Link } from "react-router";
import { useEffect, useState } from "react";

import type { GetAllTemplatesRequest, GetAllTemplatesRequestFieldErrors, Template } from "../../../../types";
import { useGetAllTemplates } from "../../../../api/templatesAPI";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Templates-Item.module.css";

const TemplatesItem: React.FC = () => {
    const { getAllTemplates, cancelGetAllTemplates } = useGetAllTemplates();
    const [errors, setErrors] = useState<GetAllTemplatesRequestFieldErrors>({});

    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setErrors({});

            const filters: GetAllTemplatesRequest = {};

            if (name.trim()) filters.Name = name.trim();
            if (type.trim()) filters.Type = type.trim();

            if (statusFilter !== "all") {
                filters.IsActive = statusFilter === "active";
            }

            const fetchedTemplates = (await getAllTemplates(filters)) || [];
            setTemplates(fetchedTemplates);
        } catch (err) {
            setDialog({
                message: "An error occurred while fetching templates.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setName("");
        setType("");
        setStatusFilter("all");
    };

    useEffect(() => {
        fetchTemplates();
    }, [name, type, statusFilter]);

    useEffect(() => {
        return () => {
            cancelGetAllTemplates();
        };
    }, []);

    const hasActiveFilters = name || type || statusFilter !== "all";

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
                        <label htmlFor="name"><i className="fa-solid fa-file-signature"></i> Template Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Search by name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="type"><i className="fa-solid fa-tag"></i> Type</label>
                        <input
                            id="type"
                            type="text"
                            placeholder="e.g. Email, Document"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="status"><i className="fa-solid fa-flag"></i> Status</label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
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

            {templates.length > 0 ? (
                <section className={styles.grid}>
                    {templates.map((template, index) => (
                        <Link
                            to={`/staff-area/templates/${template.id}/details`}
                            key={template.id}
                            className={styles.cardLink}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <article className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}>
                                        <i className="fa-solid fa-file-lines"></i>
                                    </div>
                                    <h2 className={styles.cardTitle}>{template.name}</h2>
                                    <span className={`${styles.statusBadge} ${template.isActive ? styles.active : styles.inactive}`}>
                                        {template.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.infoRow}>
                                        <i className="fa-solid fa-tag"></i>
                                        <span>Type: {template.type}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <i className="fa-solid fa-calendar"></i>
                                        <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </section>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h2>No templates found</h2>
                    <p>
                        {hasActiveFilters
                            ? "Try adjusting your filters to see more results."
                            : "There are no templates available yet."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TemplatesItem;