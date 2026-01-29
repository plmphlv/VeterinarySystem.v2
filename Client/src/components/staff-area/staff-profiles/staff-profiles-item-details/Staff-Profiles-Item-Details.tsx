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

            {staffProfileDetails && (
                <>
                    <h1 className={styles["staff-profiles-item-details-h1"]}>Staff Profile Details</h1>

                    <div className={styles["staff-profiles-item-details-container"]}>
                        <div className={styles["staff-profiles-item-details-card"]}>
                            <div className={styles.avatar}>
                                {staffProfileDetails.name[0]}
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-id-badge"></i> ID:</label>
                                <span>{staffProfileDetails.id}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-user"></i> Name:</label>
                                <span>{staffProfileDetails.name}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-phone"></i> Phone Number:</label>
                                <span>{staffProfileDetails.phoneNumber}</span>
                            </div>

                            {isSuperAdministrator && (
                            <div className={styles["staff-profiles-item-details-btns"]}>
                                <button
                                    onClick={handleDelete}
                                    className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
                                >
                                    Delete
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default StaffProfilesItemDetails;