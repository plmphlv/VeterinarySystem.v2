import { Link } from "react-router";
import OwnerAccountsItem from "./owner-accounts-item/Owner-Accounts-Item";

const OwnerAccounts: React.FC = () => {
    return (
        <>
            <h1 className="staff-area-h1">Owner Accounts:</h1>

            <div className="appointments-div">
                <OwnerAccountsItem />
            </div>
            <Link to="/staff-area/owner-accounts/create-owner-account" className="my-pets-request-appointment-btn"><i className="fa-solid fa-plus"></i> Create Owner Account</Link>
        </>
    )
}

export default OwnerAccounts;