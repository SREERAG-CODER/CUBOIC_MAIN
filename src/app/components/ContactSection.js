"use client";

import React, { useState } from "react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert("Please accept the terms before submitting.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        agreed: false,
      });
    }, 4000);
  };

  return (
    <section className={styles.contactSection} id="contact">
      {/* Full-Width Extended Contact Card */}
      <div className={styles.contactCardFullWidth}>
        {/* Full-width background video */}
        <video
          className={styles.contactBgVideo}
          src="/Cartoons_robots_moving_around_20261013185934.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className={styles.contactCardInner}>
          {/* Top Big Custom "Contact" Wordmark */}
          <div className={styles.contactHeadingWrapper}>
            <img
              src="/contact-heading-white.png"
              alt="Contact"
              className={styles.contactHeadingImg}
            />
          </div>

          {/* Two-Column Grid: Left Details & Right Form */}
          <div className={styles.contentGrid}>
            {/* Left Column: Info & Details */}
            <div className={styles.leftCol}>
            <h3 className={styles.heroHeading}>
              Have Questions?
              <br />
              Get in Touch!
            </h3>
            <p className={styles.description}>
              Whether you are looking to build autonomous robotics, custom electronics, or explore hardware research collaborations, our multidisciplinary team is here to help.
            </p>

            <div className={styles.contactDetailsList}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailTitle}>Location</span>
                  <a
                    href="https://maps.app.goo.gl/arRxvpT7LuqYhBAG7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.detailLink}
                  >
                    Kollam, Kerala, India
                  </a>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailTitle}>Phone</span>
                  <a href="tel:+918005552569" className={styles.detailLink}>
                    +91 800 555 25 69
                  </a>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailTitle}>Email</span>
                  <a href="mailto:contact@cuboic.com" className={styles.detailLink}>
                    contact@cuboic.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className={styles.rightCol}>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              {/* Row 1: Name & Email */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
              </div>

              {/* Row 2: Phone & Subject */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles.textInput}
                  />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className={styles.textareaGroup}>
                <span className={styles.textareaIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </span>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="How can we help you? Feel free to get in touch!"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textareaInput}
                ></textarea>
              </div>

              {/* Row 4: Action Button & Agreement Checkbox */}
              <div className={styles.actionRow}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitted}
                >
                  <span className={styles.btnIcon}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </span>
                  <span>{submitted ? "Message Sent!" : "Get in Touch"}</span>
                </button>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreed"
                    required
                    checked={formData.agreed}
                    onChange={handleChange}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom} />
                  <span className={styles.checkboxText}>
                    I agree that my data is <span className={styles.underlined}>collected and stored</span>.
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

      {/* Full-Width Interactive Google Map */}
      <div className={styles.mapContainer}>
        <iframe
          title="CUBOIC Location Map"
          src="https://maps.google.com/maps?q=9.0884071,76.4970857&hl=en&z=15&output=embed"
          className={styles.mapIframe}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Subtle Map Ambient Border & Overlay */}
        <div className={styles.mapTopFade} />
      </div>
    </section>
  );
}
