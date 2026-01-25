import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useSearchOwnerAccount } from "../../../../api/ownerAccountsAPI";

import type {
    OwnerAccount,
    SearchOwnerAccountRequest,
    SearchOwnerAccountRequestErrors,
} from "../../../../types";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Owner-Accounts-Item.module.css";

const OwnerAccountsItem: React.FC = () => {
    const { searchOwnerAccount, cancelSearchOwnerAccount } = useSearchOwnerAccount();

    const [errors, setErrors] = useState<SearchOwnerAccountRequestErrors>({});
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [ownerAccounts, setOwnerAccounts] = useState<OwnerAccount[]>([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const fetchOwnerAccounts = async () => {
        try {
            setLoading(true);
            setErrors({});

            const filters: SearchOwnerAccountRequest = {};

            if (name.trim()) filters.name = name.trim();
            if (email.trim()) filters.email = email.trim();
            if (phoneNumber.trim()) filters.phoneNumber = phoneNumber.trim();

            const result = await searchOwnerAccount(filters);
            setOwnerAccounts(result ?? []);
        } catch (err) {
            setDialog({
                message: "An error occurred while searching owner accounts.",
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
        fetchOwnerAccounts();
    }, [name, email, phoneNumber]);

    useEffect(() => {
        return () => {
            cancelSearchOwnerAccount();
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
                    type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Search by phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <button 
                    className={styles["clear-filters-btn"]}
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </section>

            <section className={styles["owner-accounts"]}>
                {!loading && ownerAccounts.length > 0 ? (
                    ownerAccounts.map((owner) => (
                        <div
                            className={styles["owner-accounts-item-card"]}
                            key={owner.id}
                        >
                            <div className={styles["content"]}>
                                <p>
                                    <i className="fa-solid fa-id-badge"></i> ID: {owner.id}
                                </p>
                                <p>
                                    <i className="fa-solid fa-user"></i> Name: {owner.fullName}
                                </p>
                                <p>
                                    <i className="fa-solid fa-phone"></i> Phone Number: {owner.phoneNumber}
                                </p>

                                <div className={styles["actions"]}>
                                    <Link
                                        to={`/staff-area/owner-accounts/${owner.id}/details`}
                                        className={styles["owner-accounts-more-details-btn"]}
                                    >
                                        → More Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && (
                        <h1 className={styles["no-owner-accounts"]}>
                            No owner accounts found.
                        </h1>
                    )
                )}
            </section>
        </>
    );
};

export default OwnerAccountsItem;