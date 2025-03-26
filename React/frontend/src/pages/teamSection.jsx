import React, { useState, useEffect } from 'react';
import './teamSectionStyle.css'; // Make sure your CSS file is imported
import Swiper from 'swiper/bundle'; // Import Swiper

function TeamSection() {
  const [swiper, setSwiper] = useState(null);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: 'Saad Abou Ajram',
      role: 'Full-Stack Developer',
      avatar: 'img/avatar1.png',
    },
    {
      name: 'Marc Noujaim',
      role: 'Full-Stack Developer',
      avatar: 'img/avatar2.png',
    },
    {
      name: 'Jean Luc Kiami',
      role: 'Back-End Developer',
      avatar: 'img/avatar3.png',
    },
    {
      name: 'Said Kanaan',
      role: 'Scrum Master',
      avatar: 'img/avatar4.png',
    },
    {
      name: 'Amin Wehbe',
      role: 'Web Developer',
      avatar: 'img/avatar5.png',
    },
  ]);

  useEffect(() => {
    // Initialize Swiper after the component has mounted
    const swiperInstance = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 40,
      grabCursor: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    setSwiper(swiperInstance); // Store the swiper instance to control it later if needed

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(); // Cleanup swiper instance on component unmount
      }
    };
  }, []);

  const handleViewMore = (index) => {
    setTeamMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index].role = updatedMembers[index].role === 'AUB STUDENT' ? updatedMembers[index].originalRole : 'AUB STUDENT';
      return updatedMembers;
    });
  };

  return (
    <div>
      <header>
        <nav>
          <a href="homePage.html" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="toBuy.html">Purchasing List</a></li>
            <li><a href="expenses.html" className="transactions-link">Transactions</a></li>
            <li><a href="#">Reports</a></li>
            <li className="dropdown">
              <a href="#">Who We Are</a>
              <div className="dropdown-content">
                <a href="teamSection.html">Our Team</a>
                <a href="#">Estez Wehbe</a>
                <a href="#">Our Services</a>
              </div>
            </li>
            <li><a href="settings.html">Settings</a></li>
            <li><a href="profile.html"><i className="fas fa-user"></i>Profile</a></li>
            <li><a href="#" id="logout">Logout</a></li>
          </ul>
        </nav>
      </header>

      <section className="our-team">
        <h1>Our Team</h1>
        <div className="swiper">
          <div className="swiper-wrapper">
            {teamMembers.map((member, index) => (
              <div className="swiper-slide" key={index}>
                <img className="card-avatar-img" src={member.avatar} alt="image" />
                <h2 className="card-name-txt">{member.name}</h2>
                <h3 className="card-role-txt">{member.role}</h3>
                <button className="card-follow-btn" onClick={() => handleViewMore(index)}>
                  View more
                </button>
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </section>
    </div>
  );
}

export default TeamSection;
