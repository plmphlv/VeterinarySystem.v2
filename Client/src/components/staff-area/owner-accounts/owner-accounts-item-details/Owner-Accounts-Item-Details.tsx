import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import { useGetOwnerAccountDetails } from "../../../../api/ownerAccountsAPI";
import type { GetOwnerAccountDetailsResponse } from "../../../../types";
import styles from "./Owner-Accounts-Item-Details.module.css";

const OwnerAccountsItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getOwnerAccountDetails, cancelGetOwnerAccountDetails } = useGetOwnerAccountDetails();

    const [ownerAccountDetails, setOwnerAccountDetails] = useState<GetOwnerAccountDetailsResponse | null>(null);
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
                                    Edit Profile
                                </Link>

                                <Link
                                    to={`/staff-area/owner-accounts/${ownerAccountDetails.id}/delete`}
                                    className={styles["delete-btn"]}
                                >
                                    Delete Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default OwnerAccountsItemDetails;