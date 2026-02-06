import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import type { Animal, GetAllAnimalsErrors } from "../../../types";
import { useGetOwnerAccountDetails } from "../../../api/ownerAccountsAPI";
import { useGetAllAnimals } from "../../../api/animalsAPI";
import styles from "./My-Pets-Item.module.css";

const MyPetsItem: React.FC = () => {
    const { getAllAnimals, cancelGetAllAnimals } = useGetAllAnimals();
    const { getOwnerAccountDetails, cancelGetOwnerAccountDetails } = useGetOwnerAccountDetails();
    const [errors, setErrors] = useState<GetAllAnimalsErrors>({});

    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData?.id) return;

        const fetchAnimals = async () => {
            try {
                setErrors({});
                setLoading(true);

                const ownerAccountData = await getOwnerAccountDetails(userData.id);
                if (!ownerAccountData) return;

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
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [userData?.id]);

    useEffect(() => () => cancelGetAllAnimals(), []);
    useEffect(() => () => cancelGetOwnerAccountDetails(), []);

    return (
        <div className={styles.wrapper}>
            {loading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner />
                </div>
            )}

            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}
            
            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            {animals.length > 0 ? (
                <section className={styles.grid}>
                    {animals.map((animal, index) => (
                        <Link 
                            to={`/my-pets/${animal.id}/details`}
                            key={animal.id} 
                            className={styles.cardLink}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <article className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconWrapper}>
                                        <i className="fa-solid fa-paw"></i>
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <h2>{animal.name}</h2>
                                    <p className={styles.type}>
                                        {animal.animalType}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </section>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <i className="fa-solid fa-dog"></i>
                    </div>
                    <h2>No Animals Found</h2>
                    <p>You haven't added any pets to your profile yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyPetsItem;