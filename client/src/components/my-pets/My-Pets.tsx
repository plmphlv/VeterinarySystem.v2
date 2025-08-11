import type React from "react";
import { Link } from "react-router";
import MyPetItem from "./my-pets-item/My-Pets-Item";

const MyPets: React.FC = () => {
    return (
        <>
            <h1 className="my-pets-h1">My Pets:</h1>

            <MyPetItem />

            <Link to="/my-pets/add" className="add-pet-btn">+ Add New Pet</Link>
        </>
    )
}

export default MyPets;