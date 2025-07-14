import type React from "react";

const About: React.FC = () => {
    return (
        <section className="about">
            <div className="about-container">
                <h2>Why Choose Vetariq?</h2>
                <p className="about-paragraph">
                    What sets Vetariq apart is its deep understanding of both veterinary needs and user experience. With a
                    sleek
                    design, secure infrastructure, and a heart for animals, Vetariq isn’t just software — it's your clinic's
                    digital partner.
                </p>
                <h2>About Vetariq:</h2>
                <p className="about-paragraph">
                    Vetariq is a modern web application designed specifically for veterinary clinics that want to digitize
                    their
                    services and improve communication with clients.
                </p>

                <h2>About the Creators:</h2>
                <p className="about-paragraph">
                    The team behind Vetariq consists of passionate developers and animal lovers united by a common goal — to
                    make veterinary care more accessible and efficient through innovation. Our love for our four-legged
                    friends
                    inspires us to create solutions that help them live better and healthier lives.
                </p>
            </div>
        </section>
    )
}

export default About;