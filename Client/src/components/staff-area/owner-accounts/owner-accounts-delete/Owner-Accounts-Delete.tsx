import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import { useDeleteOwnerAccount } from "../../../../api/ownerAccountsAPI";

const OwnerAccountDelete: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteOwnerAccount, cancelDeleteOwnerAccount } = useDeleteOwnerAccount();
  const [isLoading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/staff-area/owner-accounts");
      return;
    }

    const doDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this owner account?");
      if (!confirmed) {
        return;
      }

      try {
        setLoading(true);
        
        await deleteOwnerAccount({ id });
        setDialog({ message: "Owner account deleted successfully.", type: "success" });
      } catch (err) {
        setDialog({ message: "Failed to delete owner account.", type: "error" });
      } finally {
        setLoading(false);
        setTimeout(() => navigate(`/staff-area/owner-accounts`), 1500);
      }
    };

    doDelete();
  }, []);

  useEffect(() => {
    return () => {
      cancelDeleteOwnerAccount();
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="spinner-overlay">
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
    </>
  );
};

export default OwnerAccountDelete;
