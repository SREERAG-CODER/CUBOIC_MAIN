'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PhoneStoryShowcase.module.css';

const EMPLOYEES = [
  {
    id: 1,
    image: '/stories/v-team-1.jpg',
    name: 'CUBOIC Core Team',
    role: 'Autonomous Rover Project',
    handle: 'cuboic.team',
    time: 'Just now',
    tag: '#Robotics #TeamCUBOIC #Autonomous',
    fit: 'cover',
  },
  {
    id: 2,
    image: '/stories/v-team-2.jpg',
    name: 'Hardware & Systems',
    role: 'Autonomous Rover Prototype',
    handle: 'cuboic.lab',
    time: '2h ago',
    tag: '#Hardware #Chassis #CUBOIC',
    fit: 'cover',
  },
  {
    id: 3,
    image: '/stories/v-team-3.jpg',
    name: 'Mechatronics Dev',
    role: 'Suspension & Steering Rig',
    handle: 'cuboic.eng',
    time: '4h ago',
    tag: '#Engineering #Assembly #Prototype',
    fit: 'cover',
  },
  {
    id: 4,
    image: '/stories/v-team-4-workshop.jpg',
    name: 'Hardware Dev',
    role: 'Electronics & Optics Integration',
    handle: 'cuboic.hardware',
    time: '6h ago',
    tag: '#Hardware #Robotics #Innovation',
    fit: 'cover',
  },
];

const STORY_DURATION = 5000; // 5 seconds per story

export default function PhoneStoryShowcase({ onIndexChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const progressIntervalRef = useRef(null);

  // Notify parent whenever currentIndex changes
  useEffect(() => {
    if (onIndexChange) onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  // Auto-advance story timer
  useEffect(() => {
    if (isPaused) return;

    const stepMs = 50;
    const increment = (stepMs / STORY_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % EMPLOYEES.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(progressIntervalRef.current);
  }, [isPaused, currentIndex]);

  const goToStory = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
    setLiked(false);
  };

  const handleNext = () => {
    goToStory((currentIndex + 1) % EMPLOYEES.length);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToStory(currentIndex - 1);
    } else {
      goToStory(EMPLOYEES.length - 1);
    }
  };

  // Tap navigation: left side = prev, right side = next
  const handleScreenClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.35) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentEmployee = EMPLOYEES[currentIndex];

  return (
    <div className={styles.showcaseWrapper}>
      {/* Straight-facing, Minimalist Phone Frame */}
      <div 
        className={styles.phoneBody}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Screen Container (curved edges, no notch) */}
        <div className={styles.screen} onClick={handleScreenClick}>
          {/* Photos Container with smooth crossfade */}
          <div className={styles.mediaContainer}>
            {EMPLOYEES.map((item, idx) => (
              <div
                key={item.id}
                className={`${styles.imageSlide} ${
                  idx === currentIndex ? styles.activeSlide : ''
                }`}
              >
                {/* Ambient Blurred Backdrop (Instagram Story effect) */}
                <div
                  className={styles.blurBackdrop}
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />

                {/* Sharp Foreground Photo preserving normal proportions */}
                <div
                  className={styles.foregroundPhoto}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: item.fit === 'cover' ? 'cover' : 'contain',
                  }}
                />
              </div>
            ))}
            <div className={styles.screenVignette} />
          </div>

          {/* Top Story Header: Progress Bars & Profile Info */}
          <div className={styles.storyHeader}>
            <div className={styles.progressContainer}>
              {EMPLOYEES.map((item, idx) => {
                let fillWidth = '0%';
                if (idx < currentIndex) fillWidth = '100%';
                else if (idx === currentIndex) fillWidth = `${progress}%`;

                return (
                  <div key={item.id} className={styles.progressBarTrack}>
                    <div 
                      className={styles.progressBarFill}
                      style={{ width: fillWidth }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Profile info row */}
            <div className={styles.profileRow}>
              <div className={styles.profileAvatar}>
                <img
                  src="/logo.png"
                  alt="CUBOIC"
                  className={styles.avatarImage}
                />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.nameRow}>
                  <span className={styles.profileName}>cuboic.team</span>
                  <span className={styles.verifiedBadge}>✓</span>
                  <span className={styles.storyTimestamp}>{currentEmployee.time}</span>
                </div>
                <span className={styles.profileSub}>{currentEmployee.name}</span>
              </div>
              <button 
                className={styles.closeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                title="Next story"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Bottom Story Content & Interactions */}
          <div className={styles.storyFooter} onClick={(e) => e.stopPropagation()}>
            {/* Employee Tag & Role Card */}
            <div className={styles.employeeCard}>
              <span className={styles.employeeRole}>{currentEmployee.role}</span>
              <span className={styles.employeeTags}>{currentEmployee.tag}</span>
            </div>

            {/* Instagram Story Bottom Interaction Bar */}
            <div className={styles.interactionBar}>
              <div className={styles.inputPill}>
                <span>Send message...</span>
              </div>

              <button 
                className={`${styles.iconButton} ${liked ? styles.liked : ''}`}
                onClick={() => setLiked(!liked)}
                title="Like story"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#ff3b5c' : 'none'} stroke={liked ? '#ff3b5c' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <button 
                className={styles.iconButton}
                onClick={handleNext}
                title="Share / Next"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
