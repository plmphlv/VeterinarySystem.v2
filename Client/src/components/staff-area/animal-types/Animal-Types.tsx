import { Link } from "react-router";
import Dialog from "../../dialog/Dialog";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useState } from "react";
import AnimalTypeItem from "./animal-type-item/Animal-Type-Item";

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

                    <h1 className="animal-types-h1">Animal Types:</h1>

                    <section className="animal-types">
                        <ul>
                            <AnimalTypeItem />
                        </ul>
                    </section>

                    <div className="animal-types-add-btn-container">
                        <Link to="/staff-area/animal-types/add" className="animal-types-add-btn"><i className="fa-solid fa-plus"></i> Add New Animal Type</Link>
                    </div>
                </>
            )}

        </>
    )
}

export default AnimalTypes;