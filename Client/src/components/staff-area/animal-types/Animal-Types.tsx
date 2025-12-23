import { Link } from "react-router";
import Dialog from "../../dialog/Dialog";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useState } from "react";
import AnimalTypeItem from "./animal-type-item/Animal-Type-Item";
import styles from "./Animal-Types.module.css";

const AnimalTypes: React.FC = () => {
    const { error } = useGetUserData();
    const [showError, setShowError] = useState(true);

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
                    <h1 className={styles["animal-types-h1"]}>Animal Types:</h1>

                    <section className={styles["animal-types"]}>
                        <ul>
                            <AnimalTypeItem />
                        </ul>
                    </section>

                    <div className={styles["animal-types-add-btn-container"]}>
                        <Link 
                            to="/staff-area/animal-types/add" 
                            className={styles["animal-types-add-btn"]}
                        >
                            <i className="fa-solid fa-plus"></i> Add New Animal Type
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}

export default AnimalTypes;