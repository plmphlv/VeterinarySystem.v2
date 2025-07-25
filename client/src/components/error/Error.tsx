import type React from "react";

const Error: React.FC = () => {
    return (
        <>
            <section className="error-section">
                <div className="error-container">
                    <div className="error-content">
                        <h1 className="error-code">404</h1>
                        <h2 className="error-message">Oops! Page Not Found</h2>
                        <p className="error-description">
                            It seems you're a bit lost in the paw-sitive world of Veteriq.<br />
                            Let’s guide you back to a healthier, happier pet journey.
                        </p>
                        <a href="/" className="error-button">← Back to Home</a>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Error;