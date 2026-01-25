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

                console.log(result);

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
            "Are you sure you want to delete this prescription?"
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

    if (loading) return <Spinner />;

    return (
        <>
            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}

            {ownerAccountDetails && (
                <>
                    <h1 className={styles["owner-accounts-item-details-h1"]}>Owner Account Details</h1>

                    <div className={styles["owner-accounts-item-details-container"]}>
                        <div className={styles["owner-accounts-item-details-card"]}>
                            <div className={styles.avatar}>
                                {ownerAccountDetails.firstName[0]}{ownerAccountDetails.lastName[0]}
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-id-badge"></i> ID:</label>
                                <span>{ownerAccountDetails.id}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-user"></i> First Name:</label>
                                <span>{ownerAccountDetails.firstName}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-user"></i> Last Name:</label>
                                <span>{ownerAccountDetails.lastName}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-phone"></i> Phone Number:</label>
                                <span>{ownerAccountDetails.phoneNumber}</span>
                            </div>

                            {ownerAccountDetails.address && (
                                <div className={styles.field}>
                                    <label><i className="fa-solid fa-map-marker-alt"></i> Address:</label>
                                    <span>{ownerAccountDetails.address}</span>
                                </div>
                            )}

                            <div className={styles["owner-accounts-item-details-btns"]}>
                                <Link
                                    to={`/staff-area/owner-accounts/${ownerAccountDetails.id}/edit`}
                                    className={styles["edit-btn"]}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default OwnerAccountsItemDetails;