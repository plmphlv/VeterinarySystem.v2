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
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Staff Profiles</h1>
                <p className={styles.subtitle}>Manage veterinary staff and administrators</p>
            </header>

            <div className={styles.contentWrapper}>
                <StaffProfilesItem />
            </div>

            {isSuperAdministrator && (
                <div className={styles.ctaWrapper}>
                    <Link
                        to="/staff-area/staff-profiles/add"
                        className={styles.addBtn}
                    >
                        <i className="fa-solid fa-user-plus"></i> Add Staff
                    </Link>
                </div>
            )}
        </section>
    );
};

export default StaffProfiles;