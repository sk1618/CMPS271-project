import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/teamSectionStyle.css";

import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import avatar5 from "../assets/avatar5.png";

const teamMembers = [
  { name: "Saad Abou Ajram", role: "Full-Stack Developer", img: avatar1 },
  { name: "Marc Noujaim", role: "Full-Stack Developer", img: avatar2 },
  { name: "Jean Luc Kiami", role: "Back-End Developer", img: avatar3 },
  { name: "Said Kanaan", role: "Scrum Master", img: avatar4 },
  { name: "Amin Wehbe", role: "Web Developer", img: avatar5 },
];

const TeamSection = () => {
  const emailRef = useRef(null);

  useEffect(() => {
    // Ensure page is scrolled to the top
    window.scrollTo(0, 0);

    // If the hash is present (#email), scroll to the email section smoothly
    if (window.location.hash === "#email" && emailRef.current) {
      setTimeout(() => {
        emailRef.current.scrollIntoView({ behavior: "smooth" });
      }, 300); // Wait for the page to load fully
    }
  }, []);
  const handleClick = (e, index) => {
    const nameEl = document.getElementById(`role-${index}`);
    if (!nameEl.dataset.originalText) {
      nameEl.dataset.originalText = nameEl.textContent;
    }
    nameEl.textContent =
      nameEl.textContent === "AUB STUDENT"
        ? nameEl.dataset.originalText
        : "AUB STUDENT";
  };

  return (
    <section className="our-team">
      <h1>Our Team</h1>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        loop={true}
        grabCursor={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {teamMembers.map((member, index) => (
          <SwiperSlide key={index}>
            <img
              className="card-avatar-img"
              src={member.img}
              alt={member.name}
            />
            <h2 className="card-name-txt">{member.name}</h2>
            <h3 className="card-role-txt" id={`role-${index}`}>
              {member.role}
            </h3>
            <button
              className="card-follow-btn"
              onClick={(e) => handleClick(e, index)}
            >
              View more
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Email Contact Section */}
      <section ref={emailRef} className="email-section">
        <h2>Contact Support</h2>
        <p>
          If you have any questions or need assistance, feel free to reach out
          to our support team.
        </p>
        <p class="email-info">You can email us at:</p>
        <a href="mailto:aminemwehbe@gmail.com" class="email-link">
          support@finoria.com
        </a>
        <button class="cta-button">Contact Support</button>
      </section>
    </section>
  );
};

export default TeamSection;
