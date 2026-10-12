"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";
import ExploreText from "./components/ExploreText";
import GridLightBackground from "./components/GridLightBackground";
import Navbar from "./components/Navbar";
import PhoneStoryShowcase from "./components/PhoneStoryShowcase";
import Counter from "./components/Counter";

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
        {/* Top Center Brand Name - Clickable to Reload */}
        <div className={styles.topBrand}>
          <button
            type="button"
            onClick={handleReload}
            className={styles.brandButton}
            aria-label="Reload CUBOIC website"
            title="Reload website"
          >
            CUBOIC
          </button>
        </div>

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
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            OVERVIEW
          </button>
          <h3 className={styles.dividerHeading}>GET INSPIRED</h3>
          <p className={styles.dividerSub}>Explore what we are making</p>
        </div>

        {/* Third Section — continues same grid background */}
        <section className={styles.thirdSection} id="products">
          {/* Elevated White Board with depth effect */}
          <div className={styles.whiteBoard}>
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

                {/* Counter */}
                <div className={styles.storyCounter}>
                  <span className={styles.counterCurrent}>
                    {String(activeStory + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.counterSeparator}>/</span>
                  <span className={styles.counterTotal}>
                    {String(STORY_CONTENT.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fourth Section — Multidisciplinary Capabilities / Company (Continues Grid Background) */}
        <section className={styles.fourthSection} id="company">
          <div className={styles.fourthSectionContainer}>
            {/* Section Header */}
            <div className={styles.fourthHeader}>
              <div className={styles.badgePill}>
                <span className={styles.badgeDot} />
                <span>04 / DISCIPLINES</span>
              </div>
              <h2 className={styles.fourthHeading}>
                <span>ENGINEERING AT THE EDGE</span>
                <span className={styles.fourthHeadingAccent}>OF WHAT&apos;S POSSIBLE.</span>
              </h2>
              <p className={styles.fourthDescription}>
                We design and build full-stack intelligent machines from first principles — fusing rugged mechanical engineering, autonomous embedded systems, and spatial intelligence.
              </p>
            </div>

            {/* Core Capability Cards */}
            <div className={styles.cardsGrid}>
              {/* Card 1: Ground Robotics */}
              <div className={styles.capabilityCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src="/robotics.jpg"
                    alt="Autonomous Ground Robotics"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardImageOverlay} />
                  <span className={styles.cardTag}>01 • GROUND</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Autonomous Ground Robotics</h3>
                  <p className={styles.cardText}>
                    Quadruped dynamic gait control and high-payload terrain systems engineered for unstructured environments and real-world deployment.
                  </p>
                  <div className={styles.pillList}>
                    <span className={styles.techPill}>Dynamic SLAM</span>
                    <span className={styles.techPill}>Edge RTOS</span>
                    <span className={styles.techPill}>Torque Control</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Aerial Systems */}
              <div className={styles.capabilityCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src="/aerial.jpg"
                    alt="Aerial Systems & UAVs"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardImageOverlay} />
                  <span className={styles.cardTag}>02 • AERIAL</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Aerial Systems & UAVs</h3>
                  <p className={styles.cardText}>
                    High-endurance multirotors and precision flight computers built for autonomous waypoint navigation, vision-guided telemetry, and surveillance.
                  </p>
                  <div className={styles.pillList}>
                    <span className={styles.techPill}>Sensor Fusion</span>
                    <span className={styles.techPill}>Waypoint Autonomy</span>
                    <span className={styles.techPill}>Thermal Vision</span>
                  </div>
                </div>
              </div>

              {/* Card 3: AI & Spatial Compute */}
              <div className={styles.capabilityCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src="/ai-systems.jpg"
                    alt="Machine Intelligence & Edge AI"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardImageOverlay} />
                  <span className={styles.cardTag}>03 • INTELLIGENCE</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Machine Intelligence & Edge AI</h3>
                  <p className={styles.cardText}>
                    Spatial perception pipelines, neuromorphic computing models, and low-latency computer vision algorithms executed entirely on edge silicon.
                  </p>
                  <div className={styles.pillList}>
                    <span className={styles.techPill}>Neural Vision</span>
                    <span className={styles.techPill}>Spatial Compute</span>
                    <span className={styles.techPill}>Sub-10ms Inference</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className={styles.metricsRow}>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>
                  <Counter end={4} suffix="+" />
                </span>
                <span className={styles.metricLabel}>Engineering Disciplines</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>
                  <Counter end={100} suffix="%" />
                </span>
                <span className={styles.metricLabel}>In-House Hardware & Code</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>
                  <Counter end={99} prefix="99." suffix="%" />
                </span>
                <span className={styles.metricLabel}>Mission Reliability</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>
                  <Counter end={24} suffix="/7" />
                </span>
                <span className={styles.metricLabel}>Autonomous Operation</span>
              </div>
            </div>

            {/* Bottom Callout Banner */}
            <div className={styles.bottomBanner}>
              <div className={styles.bannerGlow} />
              <div className={styles.bannerContent}>
                <span className={styles.bannerTag}>CUBOIC COLLABORATIVE</span>
                <h3 className={styles.bannerTitle}>Have a vision that defies standard engineering?</h3>
                <p className={styles.bannerSub}>Let&apos;s build the future together. Partner with our multidisciplinary collective.</p>
              </div>
              <a
                href="mailto:contact@cuboic.com"
                className={styles.bannerButton}
              >
                CONNECT WITH US →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

