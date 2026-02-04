import { Link } from "react-router";
import OwnerAccountsItem from "./owner-accounts-item/Owner-Accounts-Item";
import styles from "./Owner-Accounts.module.css";

const OwnerAccounts: React.FC = () => {
    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Owner Accounts</h1>
                <p className={styles.subtitle}>Manage client profiles and information</p>
            </header>

            <div className={styles.contentWrapper}>
                <OwnerAccountsItem />
            </div>

            <div className={styles.ctaWrapper}>
                <Link 
                    to="/staff-area/owner-accounts/create" 
                    className={styles.primaryBtn}
                >
                    <i className="fa-solid fa-plus"></i> Create a New Owner Account
                </Link>
            </div>
        </section>
    );
}

export default OwnerAccounts;