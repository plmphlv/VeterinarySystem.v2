import { Link } from "react-router";

import styles from "./Prescriptions.module.css";
import PrescriptionsItem from "./prescriptions-item/Prescriptions-Item";

const Prescriptions: React.FC = () => {
    return (
        <>
            <h1 className={styles["prescriptions-h1"]}>Prescriptions:</h1>

            <div className={styles["prescriptions-div"]}>
                <PrescriptionsItem />
            </div>

            <Link 
                to="/staff-area/prescriptions/create-prescription" 
                className={styles["prescriptions-create-btn"]}
            >
                <i className="fa-solid fa-plus"></i> Create Prescription
            </Link>
        </>
    );
}

export default Prescriptions;