import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import { useDeleteOwnerAccount, useGetOwnerAccountDetails } from "../../../../api/ownerAccountsAPI";
import type { GetOwnerAccountDetailsResponse } from "../../../../types";
import styles from "./Owner-Accounts-Item-Details.module.css";

const OwnerAccountsItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getOwnerAccountDetails, cancelGetOwnerAccountDetails } = useGetOwnerAccountDetails();
    const [ownerAccountDetails, setOwnerAccountDetails] = useState<GetOwnerAccountDetailsResponse | null>(null);

    const navigate = useNavigate();
    const { deleteOwnerAccount, cancelDeleteOwnerAccount } = useDeleteOwnerAccount();
    const [deleting, setDeleting] = useState(false);

    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);

                const result = await getOwnerAccountDetails(id);
                if (!result) return;
                setOwnerAccountDetails(result);

            } catch {
                setError("Failed to load owner account details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        return () => cancelGetOwnerAccountDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this owner account?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteOwnerAccount({ id });

            setDialog({
                message: "Owner account deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                navigate("/staff-area/owner-accounts");
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete owner account.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeleteOwnerAccount();
        };
    }, []);

    if (loading) return <div className={styles.spinnerOverlay}><Spinner /></div>;

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
                <Link to="/staff-area/owner-accounts" className={styles.backLink}>
                    &larr; Back to Owner Accounts
                </Link>
            </div>

            {ownerAccountDetails && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.avatar}>
                            {ownerAccountDetails.firstName[0]}{ownerAccountDetails.lastName[0]}
                        </div>
                        <h1 className={styles.title}>{ownerAccountDetails.firstName} {ownerAccountDetails.lastName}</h1>
                        <p className={styles.subtitle}>Owner Account Details</p>
                    </header>

                    <div className={styles.cardBody}>
                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-id-badge"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>ID</span>
                                <span className={styles.value}>{ownerAccountDetails.id}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-file-signature"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>First Name</span>
                                <span className={styles.value}>{ownerAccountDetails.firstName}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-file-signature"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Last Name</span>
                                <span className={styles.value}>{ownerAccountDetails.lastName}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.iconBox}>
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className={styles.detailText}>
                                <span className={styles.label}>Phone Number</span>
                                <span className={styles.value}>{ownerAccountDetails.phoneNumber}</span>
                            </div>
                        </div>

                        {ownerAccountDetails.address && (
                            <div className={styles.detailRow}>
                                <div className={styles.iconBox}>
                                    <i className="fa-solid fa-map-marker-alt"></i>
                                </div>
                                <div className={styles.detailText}>
                                    <span className={styles.label}>Address</span>
                                    <span className={styles.value}>{ownerAccountDetails.address}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className={styles.cardFooter}>
                        <Link
                            to={`/staff-area/owner-accounts/${ownerAccountDetails.id}/edit`}
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
                </article>
            )}
        </div>
    );
};

export default OwnerAccountsItemDetails;