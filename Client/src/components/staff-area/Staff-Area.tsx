import { Link } from "react-router";

const StaffArea: React.FC = () => {
    return (
        <>
            <h1 className="staff-area-h1">Staff Area Actions:</h1>

            <section className="staff-area">
                <div className="staff-area-card">
                    <img src="/images/animal-types.png" alt="Animal Types" />
                    <div className="content">
                        <h2>Animal Types</h2>
                        {/* <p>Comprehensive physical examination to monitor your pet’s health and detect any early signs of illness.</p> */}
                        <Link to="/staff-area/animal-types" className="learn-more-btn">Make Changes</Link>
                    </div>
                </div>

                <div className="staff-area-card">
                    <img src="/images/appointments.png" alt="Appointments" />
                    <div className="content">
                        <h2>Appointments</h2>
                        {/* <p>Essential immunizations to protect your pet from dangerous diseases and promote long-term wellness.</p> */}
                        <Link to="/staff-area/appointments" className="learn-more-btn">Make Changes</Link>
                    </div>
                </div>

                <div className="staff-area-card">
                    <img src="/images/owner-accounts.png" alt="Owner Accounts" />
                    <div className="content">
                        <h2>Owner Accounts</h2>
                        {/* <p>Modern surgical procedures including spaying/neutering and emergency interventions with expert care.</p> */}
                        <Link to="/staff-area/owner-accounts" className="learn-more-btn">Make Changes</Link>
                    </div>
                </div>

                <div className="staff-area-card">
                    <img src="/images/prescriptions.png" alt="Prescriptions" />
                    <div className="content">
                        <h2>Prescriptions</h2>
                        {/* <p>Professional cleaning, tooth extraction, and oral care to keep your pet’s teeth and gums healthy.</p> */}
                        <Link to="/staff-area/prescriptions" className="learn-more-btn">Make Changes</Link>
                    </div>
                </div>
                <div className="staff-area-card">
                    <img src="/images/procedures.png" alt="Procedures" />
                    <div className="content">
                        <h2>Procedures</h2>
                        {/* <p>24/7 urgent care for accidents, injuries, or sudden illness to ensure timely treatment and recovery.</p> */}
                        <Link to="/staff-area/procedures" className="learn-more-btn">Make Changes</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StaffArea;