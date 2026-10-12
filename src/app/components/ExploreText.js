"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ExploreText.module.css";

export default function ExploreText({ text = "EXPLORE" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, vx: 0, lastX: 0, lastTime: 0 });
  const slicesRef = useRef([]);
  const canvasRectRef = useRef(null);
  const isVisibleRef = useRef(true);
  const isRunningRef = useRef(false);
  const offscreenRef = useRef(null);
  const [, setDimensions] = useState({ width: 0, height: 0 });

  const startAnimationLoop = useRef(null);

  const setupAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    // Cap DPR at 1.5 to prevent massive memory buffers on high-density screens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Responsive font sizing: bigger, majestic hero-scale presence
    const containerWidth = container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
    const fontSize = Math.max(100, Math.min(Math.round(containerWidth * 0.195), 220));

    // Proportional stripe geometry & wave reach
    const stripeHeight = Math.max(6.2, Math.round(fontSize / 18));
    const stripeGap = Math.max(3.2, Math.round(stripeHeight * 0.45));
    const influenceRadius = Math.round(fontSize * 1.35);
    const maxOffset = Math.round(fontSize * 0.3);

    // Measure text dimensions on offscreen canvas
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas");
    }
    const offscreen = offscreenRef.current;
    const offCtx = offscreen.getContext("2d");
    const fontStr = `900 ${fontSize}px "Montserrat", -apple-system, BlinkMacSystemFont, sans-serif`;
    offCtx.font = fontStr;

    if ("letterSpacing" in offCtx) {
      offCtx.letterSpacing = "0.12em";
    }

    const textMetrics = offCtx.measureText(text);
    const textWidth = Math.ceil(textMetrics.width + fontSize * 0.2);
    const textHeight = Math.ceil(fontSize * 1.25);

    // Canvas dimensions with allowances for displacement
    const paddingX = Math.round(maxOffset * 1.4 + 15);
    const paddingY = Math.round(fontSize * 0.1 + 8);
    const totalW = textWidth + paddingX * 2;
    const totalH = textHeight + paddingY * 2;

    offscreen.width = totalW * dpr;
    offscreen.height = totalH * dpr;
    offCtx.scale(dpr, dpr);

    offCtx.font = fontStr;
    if ("letterSpacing" in offCtx) {
      offCtx.letterSpacing = "0.14em";
    }
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillStyle = "#ffffff";
    offCtx.fillText(text, totalW / 2, totalH / 2);

    // Prepare main canvas
    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;
    canvasRectRef.current = canvas.getBoundingClientRect();
    setDimensions({ width: totalW, height: totalH });

    // Build slices list
    const step = stripeHeight + stripeGap;
    const numSlices = Math.ceil(totalH / step);
    const slices = [];

    for (let i = 0; i < numSlices; i++) {
      const y = i * step;
      slices.push({
        y,
        currentOffset: slicesRef.current[i]?.currentOffset || 0,
        targetOffset: 0,
        height: stripeHeight,
      });
    }

    slicesRef.current = slices;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const rect = canvasRectRef.current || canvas.getBoundingClientRect();
      const currentMouseX = mouse.active ? mouse.x - rect.left : -9999;
      const currentMouseY = mouse.active ? mouse.y - rect.top : -9999;

      let isMoving = false;

      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        const sliceCenterY = slice.y + slice.height / 2;

        if (mouse.active) {
          const dy = sliceCenterY - currentMouseY;
          const distY = Math.abs(dy);

          if (distY < influenceRadius) {
            const factor = 1 - distY / influenceRadius;
            const wave = Math.sin((dy / influenceRadius) * Math.PI);
            const dx = totalW / 2 - currentMouseX;
            const pushDir = dx === 0 ? 1 : Math.sign(dx);

            const mousePush = pushDir * factor * maxOffset * (0.6 + 0.4 * Math.abs(wave));
            const velShift = Math.max(-30, Math.min(30, mouse.vx * 0.45)) * factor;

            slice.targetOffset = mousePush + velShift;
          } else {
            slice.targetOffset = 0;
          }
        } else {
          slice.targetOffset = 0;
        }

        // Smooth physics interpolation (spring ease)
        slice.currentOffset += (slice.targetOffset - slice.currentOffset) * 0.16;

        if (Math.abs(slice.targetOffset - slice.currentOffset) > 0.08 || Math.abs(slice.currentOffset) > 0.08) {
          isMoving = true;
        }

        // Draw horizontal slice from offscreen
        const srcY = slice.y * dpr;
        const srcH = slice.height * dpr;
        const destY = slice.y;
        const destX = slice.currentOffset;

        ctx.drawImage(
          offscreen,
          0,
          srcY,
          totalW * dpr,
          srcH,
          destX * dpr,
          destY * dpr,
          totalW * dpr,
          srcH
        );
      }

      // Decay mouse velocity
      mouse.vx *= 0.85;

      return isMoving || mouse.active;
    };

    // Animation loop that sleeps when completely settled to save CPU/RAM
    const render = () => {
      if (!isVisibleRef.current) {
        isRunningRef.current = false;
        return;
      }

      const keepGoing = drawFrame();

      if (keepGoing) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        // Slices have settled to 0 and mouse is idle: pause animation loop!
        isRunningRef.current = false;
      }
    };

    const startLoop = () => {
      if (!isRunningRef.current && isVisibleRef.current) {
        isRunningRef.current = true;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    startAnimationLoop.current = startLoop;

    // Draw initial static state
    drawFrame();
    startLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isRunningRef.current = false;
    };
  }, [text]);

  useEffect(() => {
    const cleanup = setupAndDraw();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRectRef.current = canvasRef.current.getBoundingClientRect();
      }
      setupAndDraw();
    };

    window.addEventListener("resize", handleResize);

    // Pause animation when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (canvasRef.current) {
            canvasRectRef.current = canvasRef.current.getBoundingClientRect();
          }
          if (startAnimationLoop.current) {
            startAnimationLoop.current();
          }
        } else {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          isRunningRef.current = false;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (cleanup) cleanup();
      if (offscreenRef.current) {
        offscreenRef.current.width = 0;
        offscreenRef.current.height = 0;
        offscreenRef.current = null;
      }
    };
  }, [setupAndDraw]);

  // Pointer interaction
  const handlePointerMove = (e) => {
    if (!canvasRectRef.current && canvasRef.current) {
      canvasRectRef.current = canvasRef.current.getBoundingClientRect();
    }
    const now = performance.now();
    const dt = Math.max(1, now - mouseRef.current.lastTime);
    const vx = ((e.clientX - mouseRef.current.lastX) / dt) * 16;

    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      active: true,
      vx,
      lastX: e.clientX,
      lastTime: now,
    };

    if (startAnimationLoop.current) {
      startAnimationLoop.current();
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.wrapper}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      role="region"
      aria-label="Interactive Explore banner"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.srOnly}>{text}</span>
    </div>
  );
}
