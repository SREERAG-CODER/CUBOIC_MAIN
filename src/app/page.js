"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";
import ExploreText from "./components/ExploreText";
import GridLightBackground from "./components/GridLightBackground";
import Navbar from "./components/Navbar";
import PhoneStoryShowcase from "./components/PhoneStoryShowcase";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const STORY_CONTENT = [
  {
    heading: "Engineering the Future",
    description:
      "Passionate engineers and innovators pushing the boundaries of autonomous robotics, together.",
    label: "Our Team",
  },
  {
    heading: "Built from Scratch",
    description:
      "Every chassis, every circuit, every line of code — handcrafted for a competitive edge.",
    label: "Our Process",
  },
  {
    heading: "Precision in Motion",
    description:
      "Advanced suspension, precision steering — engineered to perform flawlessly on any terrain.",
    label: "Our Craft",
  },
  {
    heading: "Where Ideas Take Shape",
    description:
      "State-of-the-art tools meet unwavering quality — electronics, optics, and mechanics unified.",
    label: "Our Workshop",
  },
];

const DISCIPLINE_TAGS = [
  { label: "Electronics Development", variant: "outline" },
  { label: "Robotics", variant: "yellow" },
  { label: "CS Development", variant: "green" },
  { label: "Autonomous Systems", variant: "outline" },
  { label: "Embedded Systems", variant: "outline" },
  { label: "Hardware Dev", variant: "orange" },
  { label: "AI & Perception", variant: "purple" },
  { label: "Mechatronics", variant: "outline" },
  { label: "Computer Vision", variant: "outline" },
  { label: "Edge Computing", variant: "cyan" },
  { label: "Sensor Fusion", variant: "outline" },
  { label: "Rapid Prototyping", variant: "outline" },
];

export default function Home() {
  const videoRef = useRef(null);
  const [activeStory, setActiveStory] = useState(0);

  const handleStoryChange = useCallback((index) => {
    setActiveStory(index);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handlePressStart = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pause background video decoding when scrolled away to drastically reduce RAM / GPU usage
  useEffect(() => {
    const video = videoRef.current;
    const hero = document.getElementById("hero");
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero} id="hero">
        {/* Top Header Bar: CUBOIC (Left Corner) & ONOMAX (Right Corner) */}
        <header className={styles.heroHeader}>
          <button
            type="button"
            onClick={handleReload}
            className={styles.brandButton}
            aria-label="Reload CUBOIC website"
            title="Reload website"
          >
            CUBOIC
          </button>

          <a
            href="https://www.onomex.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.onomaxLink}
            aria-label="Visit ONOMEX"
            title="Visit ONOMEX"
          >
            <span className={styles.onomaxText}>ONOMEX</span>
            <svg
              className={styles.onomaxArrow}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </header>

        {/* Center Interactive Slit-Scan EXPLORE Banner */}
        <div className={styles.centerExplore}>
          <ExploreText text="EXPLORE" />
        </div>

        {/* Bottom Center Callout & PRESS START Button */}
        <div className={styles.bottomCallout}>
          <h2 className={styles.calloutText}>
            See what happens when ideas meet the right people.
          </h2>
          <button
            type="button"
            onClick={handlePressStart}
            className={styles.pressStartBtn}
            aria-label="Press Start to explore next section"
          >
            PRESS START
          </button>
        </div>

        {/* Full-Screen Fit & Stretch Background Video */}
        <video
          ref={videoRef}
          className={styles.videoBackground}
          src="/HEADER_VIDEO.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </section>

      {/* Content Area from Next Section Onwards (Dynamic Grid Light Background) */}
      <div className={styles.contentArea} id="next-section">
        {/* Dynamic Canvas: Colored Lights Moving Along Random Grid Paths */}
        <GridLightBackground />

        {/* Navbar sitting on top of the second section */}
        <Navbar />

        {/* Second Section Content Canvas */}
        <section className={styles.nextSection} id="overview">
          <div className={styles.taglineBlock}>
            <h2 className={styles.taglineHeading}>
              <span className={styles.taglineLine}>IF YOU CAN THINK IT,</span>
              <span className={styles.taglineLine}>WE CAN MAKE IT.</span>
            </h2>
            <p className={styles.taglineDescription}>
              Introducing CUBOIC, where creativity and technology come together
              to build what&apos;s next.
            </p>
          </div>
        </section>

        {/* Transition Divider between Section 2 and 3 */}
        <div className={styles.sectionDivider}>
          <button
            type="button"
            className={styles.dividerPill}
            onClick={() => {
              const el = document.getElementById("showcase");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            OVERVIEW
          </button>
          <h3 className={styles.dividerHeading}>GET INSPIRED</h3>
          <p className={styles.dividerSub}>Explore what we are making</p>
        </div>

        {/* Third Section — Showcase White Board with robots */}
        <section className={styles.thirdSection} id="showcase">
          {/* Elevated White Board with depth effect */}
          <div className={styles.whiteBoard}>
            {/* Robot Peeking Frame — edge robots behind content */}
            <img
              src="/robots_peeking_frame.jpg"
              alt=""
              className={styles.robotFrame}
              aria-hidden="true"
            />
            <div className={styles.thirdSectionContainer}>
              {/* Left side: Realistic Phone Mobile Display */}
              <div className={styles.phoneColumn}>
                <PhoneStoryShowcase onIndexChange={handleStoryChange} />
              </div>

              {/* Right side: Dynamic synced text */}
              <div className={styles.contentColumn}>
                {/* Step indicator */}
                <div className={styles.storyIndicator}>
                  {STORY_CONTENT.map((_, idx) => (
                    <button
                      key={idx}
                      className={`${styles.indicatorDot} ${
                        idx === activeStory ? styles.indicatorDotActive : ""
                      }`}
                      aria-label={`Story ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Animated text block */}
                <div className={styles.storyTextBlock}>
                  {STORY_CONTENT.map((content, idx) => (
                    <div
                      key={idx}
                      className={`${styles.storyTextSlide} ${
                        idx === activeStory ? styles.storyTextActive : ""
                      }`}
                    >
                      <span className={styles.storyLabel}>{content.label}</span>
                      <h3 className={styles.storyHeading}>{content.heading}</h3>
                      <p className={styles.storyDescription}>
                        {content.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Disciplines & Development Tags */}
                <div className={styles.tagsContainer}>
                  {DISCIPLINE_TAGS.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`${styles.tagPill} ${styles[`tag_${tag.variant}`]}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Starting of Products Display Section (Below the Overview White Board) */}
        <div className={styles.sectionDivider} id="products">
          <button
            type="button"
            className={styles.dividerPill}
          >
            DISCOVER
          </button>
          <h3 className={styles.dividerHeading}>INSIDE OUR WORLD</h3>
          <p className={styles.dividerSub}>Young minds. Bold ideas. Real creations.</p>
        </div>

        {/* Products Showcase Section: Cinematic Drone on Left with White Semicircle & Narrative on Right */}
        <section className={styles.droneProductSection}>
          {/* White Semicircle Backdrop behind Drone for dramatic depth */}
          <div className={styles.whiteSemicircle} aria-hidden="true" />

          <div className={styles.droneProductContainer}>
            {/* Left: Immense Drone Model Bleeding Off-Screen with Depth */}
            <div className={styles.droneVisualCol}>
              {/* Drone Image Wrapper */}
              <div className={styles.droneImageWrapper}>
                <img
                  src="/quadcopter_drone.png"
                  alt="CUBOIC Autonomous Quadcopter Drone"
                  className={styles.droneImage}
                />
              </div>
            </div>

            {/* Right: CUBOIC Team Story & Narrative */}
            <div className={styles.droneContentCol}>
              {/* Team Profile Header (matches Image 2) */}
              <div className={styles.teamProfileHeader}>
                <div className={styles.teamAvatarRing}>
                  <img
                    src="/logo.png"
                    alt="CUBOIC"
                    className={styles.teamAvatarImg}
                  />
                </div>
                <div className={styles.teamMeta}>
                  <div className={styles.teamNameRow}>
                    <span className={styles.teamHandle}>cuboic.team</span>
                    {/* Blue Verified Badge */}
                    <svg
                      className={styles.verifiedBadge}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-label="Verified"
                    >
                      <circle cx="12" cy="12" r="10" fill="#3897f0" />
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="#ffffff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className={styles.teamRole}>Hardware &amp; Systems</span>
                </div>
              </div>

              {/* Team Story Quote Card */}
              <div className={styles.quoteCard}>
                <blockquote className={styles.quoteText}>
                  &ldquo;There&apos;s a lot more to building a drone than what you see on the outside. Every part has a purpose, every connection matters, and getting everything to work together takes time, patience, and a lot of testing. That&apos;s what makes this kind of work interesting to us. We get to take an idea, work through the challenges, figure out what works and what doesn&apos;t, and slowly turn it into something real. We don&apos;t expect everything to be perfect on the first try, but we do believe in putting in the work until it gets there. For us, building drones isn&apos;t just about the finished machine. It&apos;s about everything that goes into making it work.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Second Product Showcase: Autonomous Rover on Right with White Semicircle */}
        <section className={styles.roverProductSection}>
          {/* White Semicircle Backdrop behind Rover on Right for depth */}
          <div className={styles.whiteSemicircleRight} aria-hidden="true" />

          <div className={styles.roverProductContainer}>
            {/* Left: Narrative & Description Column */}
            <div className={styles.roverContentCol}>
              {/* Profile Header & Story placeholder */}
              <div className={styles.teamProfileHeader}>
                <div className={styles.teamAvatarRing}>
                  <img
                    src="/logo.png"
                    alt="CUBOIC"
                    className={styles.teamAvatarImg}
                  />
                </div>
                <div className={styles.teamMeta}>
                  <div className={styles.teamNameRow}>
                    <span className={styles.teamHandle}>cuboic.team</span>
                    {/* Blue Verified Badge */}
                    <svg
                      className={styles.verifiedBadge}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-label="Verified"
                    >
                      <circle cx="12" cy="12" r="10" fill="#3897f0" />
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="#ffffff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className={styles.teamRole}>Robotics &amp; Autonomous Mobility</span>
                </div>
              </div>

              {/* Story Quote Card */}
              <div className={styles.quoteCard}>
                <blockquote className={styles.quoteText}>
                  &ldquo;Building a rover is an interesting challenge because so many different things have to work together. The frame, wheels, suspension, electronics, and control systems all play their part, and even a small change in one area can affect the way the whole machine behaves. A lot of the work happens through testing, making adjustments, and figuring out how to make things work better. We enjoy that process at Cuboic, getting hands-on with the engineering, learning from what doesn&apos;t work, and finding ways to improve with every iteration. In the end, it&apos;s about building something that doesn&apos;t just look good on paper, but can actually move, respond, and do what it&apos;s meant to do.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Right: Rover Model Bleeding Off Right Screen (40% hidden) */}
            <div className={styles.roverVisualCol}>
              <div className={styles.roverImageWrapper}>
                <img
                  src="/cuboic_rover.png"
                  alt="CUBOIC All-Terrain Autonomous Rover"
                  className={styles.roverImage}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section — Full-width template with dark theme and live map */}
        <ContactSection />

        {/* Footer — White background with massive CUBOIC wordmark */}
        <Footer />
      </div>
    </main>
  );
}

