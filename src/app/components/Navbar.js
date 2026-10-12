"use client";

import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const handleLogoClick = (e) => {
    e.preventDefault();
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        {/* Left: Brand CUBOIC */}
        <div className={styles.navLeft}>
          <a
            href="#hero"
            onClick={handleLogoClick}
            className={styles.brandLink}
            aria-label="CUBOIC Home"
          >
            <Image
              src="/cuboic-logo.png"
              alt="CUBOIC"
              width={30}
              height={30}
              className={styles.logoImg}
              priority
            />
            <span className={styles.brandText}>CUBOIC</span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <div className={styles.navCenter}>
          <a href="#overview" className={styles.navLink}>
            Overview
          </a>
          <a href="#products" className={styles.navLink}>
            Products
          </a>
          <a href="#company" className={styles.navLink}>
            Company
          </a>
        </div>

        {/* Right: Instagram & LinkedIn Icons */}
        <div className={styles.navRight}>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="Instagram"
            title="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          <a
            href="#"
            className={styles.socialIcon}
            aria-label="LinkedIn"
            title="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
