import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import styles from "./Staff-Profiles-Item-Details.module.css";
import { useDeleteStaffProfile, useGetStaffProfileDetails } from "../../../../api/staffProfilesAPI";
import type { GetStaffProfileDetailsResponse } from "../../../../types";
import { getJwtDecodedData } from "../../../../utils/getJwtDecodedData";

const StaffProfilesItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getStaffProfileDetails, cancelGetStaffProfileDetails } = useGetStaffProfileDetails();
    const [staffProfileDetails, setStaffProfileDetails] = useState<GetStaffProfileDetailsResponse | null>(null);

    const navigate = useNavigate();
    const { deleteStaffProfile, cancelDeleteStaffProfile } = useDeleteStaffProfile();
    const [deleting, setDeleting] = useState(false);

    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(true);

    const decodedData = getJwtDecodedData();

    const role =
        decodedData?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

    const isSuperAdministrator = role === "SuperAdministrator";

    useEffect(() => {
        if (!id) return;

        const fetchStaffProfileDetails = async () => {
            try {
                setLoading(true);

                const result = await getStaffProfileDetails(id);
                if (!result) return;
                setStaffProfileDetails(result);

            } catch {
                setError("Failed to load staff profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffProfileDetails();
        return () => cancelGetStaffProfileDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this staff profile?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteStaffProfile(id);

            setDialog({
                message: "Staff profile deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/staff-area/staff-profiles");
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete staff profile.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeleteStaffProfile();
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
            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            <div className={styles.navWrapper}>
                <Link to="/staff-area/staff-profiles" className={styles.backLink}>
                    &larr; Back to Staff Profiles
                </Link>
            </div>

            {staffProfileDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-user-doctor"></i>
                        </div>
                        <h1 className={styles.title}>{staffProfileDetails.name}</h1>
                        <p className={styles.subtitle}>Staff Member Details</p>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-id-badge"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Profile ID</span>
                                <span className={styles.value}>{staffProfileDetails.id}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-signature"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Full Name</span>
                                <span className={styles.value}>{staffProfileDetails.name}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Phone Number</span>
                                <span className={styles.value}>{staffProfileDetails.phoneNumber}</span>
                            </div>
                        </div>
                    </div>

                    {isSuperAdministrator && (
                        <footer className={styles.cardFooter}>
                            <button
                                onClick={handleDelete}
                                className={styles.deleteBtn}
                                disabled={deleting}
                            >
                                <i className="fa-solid fa-trash"></i> {deleting ? "Deleting..." : "Delete Profile"}
                            </button>
                        </footer>
                    )}
                </article>
            )}
        </div>
    );
};

export default StaffProfilesItemDetails;