import { Link } from "react-router";
import styles from "./Staff-Profiles.module.css";
import StaffProfilesItem from "./staff-profiles-item/Staff-Profiles-Item";
import { getJwtDecodedData } from "../../../utils/getJwtDecodedData";

const StaffProfiles: React.FC = () => {
    const decodedData = getJwtDecodedData();

    const role =
        decodedData?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

    const isSuperAdministrator = role === "SuperAdministrator";

    return (
        <>
            <h1 className={styles["staff-profiles-h1"]}>Staff Profiles:</h1>

            <div className={styles["staff-profiles-div"]}>
                <StaffProfilesItem />
            </div>

            {isSuperAdministrator && (
                <Link
                    to="/staff-area/staff-profiles/add"
                    className={styles["staff-profiles-add-btn"]}
                >
                    <i className="fa-solid fa-plus"></i> Add Staff
                </Link>
            )}
        </>
    );
};

export default StaffProfiles;
