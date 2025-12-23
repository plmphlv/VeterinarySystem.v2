import { Link } from "react-router";
import OwnerAccountsItem from "./owner-accounts-item/Owner-Accounts-Item";
import styles from "./Owner-Accounts.module.css";

const OwnerAccounts: React.FC = () => {
    return (
        <>
            <h1 className={styles["owner-accounts-h1"]}>Owner Accounts:</h1>

            <div className={styles["owner-accounts-div"]}>
                <OwnerAccountsItem />
            </div>

            <Link 
                to="/staff-area/owner-accounts/create-owner-account" 
                className={styles["owner-accounts-create-owner-account-btn"]}
            >
                <i className="fa-solid fa-plus"></i> Create Owner Account
            </Link>
        </>
    );
}

export default OwnerAccounts;