import type React from "react";
import { Link } from "react-router";
import MyPetItem from "./my-pets-item/My-Pets-Item";
import { useGetUserData } from "../../hooks/useGetUserData";
import Dialog from "../dialog/Dialog";
import { useState } from "react";

const MyPets: React.FC = () => {
    const { userData, isLoading, error } = useGetUserData();
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
                    <h1 className="my-pets-h1">My Pets:</h1>
                    <div className="my-pets">
                        <MyPetItem />
                    </div>
                    <Link to="/my-pets/add" className="my-pets-add-pet-btn">+ Add New Pet</Link>
                </>
            )}

        </>
    )
}

export default MyPets;