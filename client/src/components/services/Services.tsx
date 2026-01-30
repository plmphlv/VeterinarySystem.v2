import React from "react";
import { Link } from "react-router";
import styles from "./Services.module.css";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const servicesData: ServiceItem[] = [
  {
    id: "general",
    title: "General Check-up",
    description: "Comprehensive physical examination to monitor your pet’s health and detect any early signs of illness.",
    image: "/images/general-check-up.png",
    link: "/services/general-check-up",
  },
  {
    id: "vaccines",
    title: "Vaccinations",
    description: "Essential immunizations to protect your pet from dangerous diseases and promote long-term wellness.",
    image: "/images/vaccinations.png",
    link: "/services/vaccinations",
  },
  {
    id: "surgery",
    title: "Surgery",
    description: "Modern surgical procedures including spaying/neutering and emergency interventions with expert care.",
    image: "/images/surgery.png",
    link: "/services/surgery",
  },
  {
    id: "dental",
    title: "Dental Care",
    description: "Professional cleaning, tooth extraction, and oral care to keep your pet’s teeth and gums healthy.",
    image: "/images/dental-care.png",
    link: "/services/dental-care",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "24/7 urgent care for accidents, injuries, or sudden illness to ensure timely treatment and recovery.",
    image: "/images/emergency-services.png",
    link: "/services/emergency-services",
  },
  {
    id: "nutrition",
    title: "Pet Nutrition Counseling",
    description: "Tailored dietary advice to help your pet maintain optimal weight and receive proper nutrition.",
    image: "/images/pet-nutrition-counseling.png",
    link: "/services/pet-nutrition-counseling",
  },
];

const Services: React.FC = () => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Our Services</h1>
        <p className={styles.subtitle}>
          Providing top-tier veterinary care with passion and expertise.
        </p>
      </header>

      <div className={styles.grid}>
        {servicesData.map((service, index) => (
          <article
            key={service.id}
            className={styles.card}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.imageWrapper}>
              <img src={service.image} alt={service.title} loading="lazy" />
            </div>
            <div className={styles.content}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <Link to={service.link} className={styles.learnMoreBtn}>
                Learn More
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
          Request New Appointment
        </Link>
      </div>
    </section>
  );
};

export default Services;