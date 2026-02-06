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
                            type="text"
                            id="name"
                            placeholder="Search by name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="email"><i className="fa-solid fa-at"></i> Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Search by email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <label htmlFor="phone"><i className="fa-solid fa-phone"></i> Phone</label>
                        <input
                            type="text"
                            id="phone"
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

            {!loading && ownerAccounts.length > 0 ? (
                <section className={styles.grid}>
                    {ownerAccounts.map((owner, index) => (
                        <Link 
                            to={`/staff-area/owner-accounts/${owner.id}/details`} 
                            key={owner.id}
                            className={styles.cardLink}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <article className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}>
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <h2>{owner.fullName}</h2>
                                </div>
                                
                                <div className={styles.cardBody}>
                                    <div className={styles.infoRow}>
                                        <i className="fa-solid fa-id-badge"></i> 
                                        <span>ID: {owner.id}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <i className="fa-solid fa-phone"></i>
                                        <span>{owner.phoneNumber}</span>
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
                        <h2>No owner accounts found</h2>
                        <p>
                            {hasActiveFilters
                                ? "Try adjusting your search criteria."
                                : "There are no owner accounts yet."}
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default OwnerAccountsItem;