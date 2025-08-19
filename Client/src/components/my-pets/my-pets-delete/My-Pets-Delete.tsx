import { useEffect, useState } from "react";
import { useDeleteAnimal } from "../../../api/animalsAPI";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../spinner/Spinner";

const MyPetsDelete: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteAnimal, cancelDeleteAnimal } = useDeleteAnimal();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/my-pets");
      return;
    }

    const doDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this animal?");
      if (!confirmed) {
        navigate("/my-pets"); // върни веднага, ако потребителят натисне Cancel
        return;
      }

      try {
        setLoading(true);
        await deleteAnimal({ id: Number(id) });
      } catch (error) {
        // по желание може да сложиш alert(error.message)
        console.error("Delete failed:", error);
      } finally {
        setLoading(false);
        navigate("/my-pets"); // винаги се връща към списъка
      }
    };

    doDelete();
  }, [id, deleteAnimal, navigate]);

  useEffect(() => {
    return () => {
      cancelDeleteAnimal();
    };
  }, [cancelDeleteAnimal]);

  return (
    <>
      {isLoading && (
        <div className="spinner-overlay">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default MyPetsDelete;
