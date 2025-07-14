import type React from "react";
import { Link } from "react-router";

const EmegencyServices: React.FC = () => {
    return (
        <>
            <h1 className="service-h1">Emergency Services</h1>

            <div className="service-content">
                <img src="/images/emergency-services.png" alt="Emergency Services"/>
                    <h2>Urgent Care When You Need It Most</h2>
                    <p>Our emergency services are available for sudden, life-threatening situations where your pet needs immediate
                        medical attention. We are equipped to handle trauma, poisoning, seizures, breathing difficulties, and other
                        critical conditions.</p>

                    <h2>Our Emergency Capabilities:</h2>
                    <p>Veteriq’s experienced emergency team works swiftly and compassionately to stabilize and treat pets in crisis.
                        Our facility includes advanced monitoring equipment, in-house diagnostics, and surgical readiness for fast
                        response.</p>

                    <h2>When to Seek Emergency Care:</h2>
                    <ul>
                        <li>Difficulty breathing or unconsciousness;</li>
                        <li>Heavy bleeding or traumatic injury;</li>
                        <li>Severe vomiting or diarrhea;</li>
                        <li>Suspected poisoning;</li>
                        <li>Sudden behavioral changes or collapse.</li>
                    </ul>

                    <Link to="/services" className="back-link">← Back to Services</Link>
            </div>
        </>
    )
}

export default EmegencyServices;