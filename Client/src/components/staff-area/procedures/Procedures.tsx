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
        <>
            {error && showError ? (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            ) : (
                <>
                    <h1 className={styles["procedures-h1"]}>All Procedures:</h1>
                    <div className={styles["procedures-div"]}>
                        <ProceduresItem />
                    </div>

                    <Link
                        to="/staff-area/procedures/create"
                        className={styles["procedures-create-procedure-btn"]}
                    >
                        <i className="fa-solid fa-plus"></i> Create New Procedure
                    </Link>
                </>
            )}
        </>
    )
}

export default Procedures;