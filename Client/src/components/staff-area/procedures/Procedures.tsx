import { useState } from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import styles from "./Procedures.module.css";
import ProceduresItem from "./procedures-item/Procedures-Item";

const Procedures: React.FC = () => {
    const { userData, error } = useGetUserData();
    const [showError, setShowError] = useState(true);

    if (!userData) {
        return <Spinner />;
    }

    return (
        <section className={styles.container}>
            {error && showError ? (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            ) : (
                <>
                    <header className={styles.header}>
                        <h1 className={styles.title}>All Procedures</h1>
                        <p className={styles.subtitle}>List of medical procedures performed</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <ProceduresItem />
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link
                            to="/staff-area/procedures/create"
                            className={styles.primaryBtn}
                        >
                            <i className="fa-solid fa-plus"></i> Create New Procedure
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}

export default Procedures;