import { Link } from "react-router";
import { useEffect, useState } from "react";

import type { GetAllStaffProfilesRequest, GetAllStaffProfilesRequestFieldErrors, StaffProfile } from "../../../../types";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Staff-Profiles-Item.module.css";
import { useGetAllStaffProfiles } from "../../../../api/staffProfilesAPI";

const StaffProfilesItem: React.FC = () => {
    const { getAllStaffProfiles, cancelGetAllStaffProfiles } = useGetAllStaffProfiles();

    const [errors, setErrors] = useState<GetAllStaffProfilesRequestFieldErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const fetchStaffProfiles = async () => {
        try {
            setLoading(true);
            setErrors({});

            const filters: GetAllStaffProfilesRequest = {};

            if (name.trim()) filters.name = name.trim();
            if (email.trim()) filters.email = email.trim();
            if (phoneNumber.trim()) filters.phoneNumber = phoneNumber.trim();

            const result = await getAllStaffProfiles(filters);
            setStaffProfiles(result ?? []);
        } catch (err) {
            setDialog({
                message: "An error occurred while fetching staff profiles.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
    };

    useEffect(() => {
        fetchStaffProfiles();
    }, [name, email, phoneNumber]);

    useEffect(() => {
        return () => {
            cancelGetAllStaffProfiles();
        };
    }, []);

    const hasActiveFilters = name || email || phoneNumber;

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
                        <label htmlFor="name"><i className="fa-solid fa-file-signature"></i> Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Search by name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="email"><i className="fa-solid fa-at"></i> Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Search by email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="phoneNumber"><i className="fa-solid fa-phone"></i> Phone</label>
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder="Search by phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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

            {staffProfiles.length > 0 ? (
                <section className={styles.grid}>
                    {staffProfiles.map((staffProfile, index) => (
                        <Link
                            to={`/staff-area/staff-profiles/${staffProfile.id}/details`}
                            key={staffProfile.id}
                            className={styles.cardLink}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <article className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}>
                                        <i className="fa-solid fa-user-doctor"></i>
                                    </div>
                                    <h2 className={styles.cardTitle}>{staffProfile.name}</h2>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.infoRow}>
                                        <i className="fa-solid fa-id-badge"></i>
                                        <span>ID: {staffProfile.id}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </section>
            ) : (
                !loading && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i className="fa-solid fa-users-slash"></i>
                        </div>
                        <h2>No staff profiles found</h2>
                        <p>
                            {hasActiveFilters
                                ? "Try adjusting your filters to see more results."
                                : "There are no registered staff members."}
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default StaffProfilesItem;