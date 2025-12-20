import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import type { AnimalType, GetAllAnimalsErrors } from "../../../../types";
import { useGetAnimalTypes } from "../../../../api/animalTypesAPI";

const AnimalTypeItem: React.FC = () => {
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const [errors, setErrors] = useState<GetAllAnimalsErrors>({});

    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);


    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData?.id) {
            return;
        };

        const fetchAnimalTypes = async () => {
            try {
                setErrors({});
                setLoading(true)

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
                return;
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

    return (
        <>
            {loading && (
                <div className="spinner-overlay">
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

            {animalTypes.length > 0 ? (
                <>
                    {animalTypes.map((animalType) => (
                        <li key={animalType.id} className="animal-types-item">{animalType.value}
                            <div className="animal-types-btns">
                                <Link to={`/staff-area/animal-types/${animalType.id}/edit`} className="animal-types-edit-btn">Edit</Link>
                                <Link to={`/staff-area/animal-types/${animalType.id}/delete`} className="animal-types-delete-btn">Delete</Link>
                            </div>
                        </li>

                    ))}
                </>
            ) : (
                <h1 className="no-animal-types-h1">No Animal Types Found.</h1>
            )}
        </>
    );

};

export default AnimalTypeItem;