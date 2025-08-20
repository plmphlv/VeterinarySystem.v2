import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import type { Animal, GetAllAnimalsErrors } from "../../../types";
import { useGetAllAnimals } from "../../../api/animalsAPI";
import { useGetOwnerAccountDetails } from "../../../api/ownerAccountsAPI";

const MyPetItem: React.FC = () => {
    const { userData } = useGetUserData();
    const { getAllAnimals, cancelGetAllAnimals } = useGetAllAnimals();
    const { getOwnerAccountDetails, cancelGetOwnerAccountDetails } = useGetOwnerAccountDetails();
    const [errors, setErrors] = useState<GetAllAnimalsErrors>({});

    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData?.id) {
            return;
        };

        const fetchAnimals = async () => {
            try {
                setErrors({});
                setLoading(true)

                const ownerAccountData = await getOwnerAccountDetails(userData.id);

                if (!ownerAccountData) {
                    return;
                }

                const ownerId = ownerAccountData?.id;
                const animals = await getAllAnimals({ ownerId });                

                setAnimals(animals || []);
            } catch (err: any) {
                let errorMessage = "An error occurred while fetching animals.";

                if (err?.errors && typeof err.errors === "object") {
                    const firstKey = Object.keys(err.errors)[0];
                    if (firstKey && Array.isArray(err.errors[firstKey]) && err.errors[firstKey][0]) {
                        errorMessage = err.errors[firstKey][0];
                    }
                }

                setDialog({ message: errorMessage, type: "error" });
                setErrors(err.errors);
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            cancelGetAllAnimals();
        };
    }, []);

    useEffect(() => {
        return () => {
            cancelGetOwnerAccountDetails();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            {!isLoading && animals.length === 0 && (!errors || Object.keys(errors).length === 0) && (
                <h1 className="no-pets-h1">No Added Animals yet!</h1>
            )}

            <section className="my-pets-item-section">
                {animals.map((animal) => (
                    <div key={animal.id} className="my-pets-item-card">
                        <div className="content">
                            <h2>{animal.name}</h2>
                            <p>
                                <i className="fa-solid fa-paw"></i> Animal type: {animal.animalType}
                            </p>
                            <Link
                                to={`/my-pets/${animal.id}/info`}
                                className="my-pets-item-more-info-btn"
                            >
                                → More Info
                            </Link>
                        </div>
                    </div>
                ))}

                {dialog && (
                    <Dialog
                        message={dialog.message}
                        type={dialog.type}
                        onClose={() => setDialog(null)}
                    />
                )}
            </section>
        </>
    );

};

export default MyPetItem;

