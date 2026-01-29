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

    return (
        <>
            {loading && (
                <div className="spinner-overlay">
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

            <section className={styles["filters"]}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Search by phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    className={styles["clear-filters-btn"]}
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </section>

            <section className={styles["staff-profiles"]}>
                {!loading && staffProfiles.length > 0 ? (
                    staffProfiles.map((staffProfile) => (
                        <div
                            className={styles["staff-profiles-item-card"]}
                            key={staffProfile.id}
                        >
                            <div className={styles["content"]}>
                                <p>
                                    <i className="fa-solid fa-id-badge"></i> ID: {staffProfile.id}
                                </p>
                                <p>
                                    <i className="fa-solid fa-user"></i> Name: {staffProfile.name}
                                </p>

                                <div className={styles["actions"]}>
                                    <Link
                                        to={`/staff-area/staff-profiles/${staffProfile.id}/details`}
                                        className={styles["staff-profiles-more-details-btn"]}
                                    >
                                        → More Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && (
                        <h1 className={styles["no-staff-profiles"]}>
                            No staff profiles found.
                        </h1>
                    )
                )}
            </section>
        </>
    );
};

export default StaffProfilesItem;