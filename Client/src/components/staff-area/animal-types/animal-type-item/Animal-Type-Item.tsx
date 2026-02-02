import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import type { AnimalType, GetAllAnimalsErrors } from "../../../../types";
import { useDeleteAnimalType, useGetAnimalTypes } from "../../../../api/animalTypesAPI";
import styles from "./Animal-Type-Item.module.css";

const AnimalTypeItem: React.FC = () => {
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const [errors, setErrors] = useState<GetAllAnimalsErrors>({});

    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();
    const { deleteAnimalType, cancelDeleteAnimalType } = useDeleteAnimalType();
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!userData?.id) return;

        const fetchAnimalTypes = async () => {
            try {
                setErrors({});
                setLoading(true);
                const animalTypes = await getAnimalTypes();
                setAnimalTypes(animalTypes || []);
            } catch (err: any) {
                let errorMessage = "An error occurred while fetching animal types.";
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

        fetchAnimalTypes();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            cancelGetAnimalTypes();
        };
    }, []);

    const handleDelete = async (id: number) => {

        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this animal type?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteAnimalType({ id: Number(id) });

            setDialog({
                message: "Animal type deleted successfully.",
                type: "success",
            });

            setTimeout(() => {
                // Refresh or redirect (here we just refetch or navigate)
                // For simplicity, navigating to same page or parent triggers re-render if handled
                window.location.reload(); 
                // Or better: update local state instead of reload/navigate
            }, 1500);
        } catch {
            setDialog({
                message: "Failed to delete animal type.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        return () => {
            cancelDeleteAnimalType();
        };
    }, []);

    return (
        <>
            {loading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner />
                </div>
            )}

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            {animalTypes.length > 0 ? (
                <>
                    {animalTypes.map((animalType) => (
                        <li key={animalType.id} className={styles.item}>
                            <span className={styles.typeName}>{animalType.value}</span>
                            <div className={styles.actions}>
                                <Link
                                    to={`/staff-area/animal-types/${animalType.id}/edit`}
                                    className={styles.editBtn}
                                >
                                    <i className="fa-solid fa-pen"></i> Edit
                                </Link>
                                <button onClick={() => handleDelete(animalType.id)} className={styles.deleteBtn}>
                                    <i className="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <i className="fa-solid fa-paw"></i>
                    <h2>No Animal Types Found</h2>
                    <p>Start by adding a new one above.</p>
                </div>
            )}
        </>
    );
};

export default AnimalTypeItem;