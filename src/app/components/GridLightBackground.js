"use client";

import { useEffect, useRef } from "react";
import styles from "./GridLightBackground.module.css";

export default function GridLightBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let animId = null;
    let isVisible = false;

    const CELL_SIZE = 48; // Size of square grid cells in px
    const NUM_RUNNERS = 18; // Balanced runner count for vibrant visuals with low memory

    const PALETTE = [
      { stroke: "#ffffff", glow: "rgba(255, 255, 255, 0.95)" },
      { stroke: "#ffaa33", glow: "rgba(255, 170, 51, 0.95)" },
      { stroke: "#8edb00", glow: "rgba(142, 219, 0, 0.95)" },
      { stroke: "#00e5ff", glow: "rgba(0, 229, 255, 0.95)" },
      { stroke: "#d946ef", glow: "rgba(217, 70, 239, 0.95)" },
      { stroke: "#ff5555", glow: "rgba(255, 85, 85, 0.95)" },
      { stroke: "#38bdf8", glow: "rgba(56, 189, 248, 0.95)" },
      { stroke: "#facc15", glow: "rgba(250, 204, 21, 0.95)" },
    ];

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Glowing cell outlines and fills that fade smoothly (capped for memory efficiency)
    const glowingCells = [];
    const MAX_GLOWING_CELLS = 16;

    const spawnCellGlow = (gx, gy, color) => {
      if (glowingCells.length >= MAX_GLOWING_CELLS) return;
      glowingCells.push({
        gx,
        gy,
        color,
        alpha: 0.9,
        decay: 0.009 + Math.random() * 0.008,
      });
    };

    // 12 spatial spawn zones to guarantee even distribution across screen
    const ZONES_X = 3;
    const ZONES_Y = 4;

    class GridGraphRunner {
      constructor(zoneIndex) {
        this.zoneIndex = zoneIndex;
        this.init();
      }

      init() {
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

        const zx = this.zoneIndex % ZONES_X;
        const zy = Math.floor(this.zoneIndex / ZONES_X) % ZONES_Y;

        const colMin = Math.floor((zx / ZONES_X) * cols);
        const colMax = Math.floor(((zx + 1) / ZONES_X) * cols);
        const rowMin = Math.floor((zy / ZONES_Y) * rows);
        const rowMax = Math.floor(((zy + 1) / ZONES_Y) * rows);

        this.gx = Math.min(cols - 1, Math.max(0, colMin + Math.floor(Math.random() * Math.max(1, colMax - colMin))));
        this.gy = Math.min(rows - 1, Math.max(0, rowMin + Math.floor(Math.random() * Math.max(1, rowMax - rowMin))));

        this.dir = Math.floor(Math.random() * 4);
        this.pickNextNode();

        this.t = 0;
        this.speed = 0.03 + Math.random() * 0.02;
        this.history = []; // [{ gx, gy }]
        this.maxTrail = 9 + Math.floor(Math.random() * 6);
        this.alive = true;
        this.life = 130 + Math.floor(Math.random() * 160);

        if (Math.random() < 0.3) {
          spawnCellGlow(this.gx, this.gy, this.color);
        }
      }

      pickNextNode() {
        const DIRS = [
          { dx: 0, dy: -1 }, // 0: up
          { dx: 1, dy: 0 },  // 1: right
          { dx: 0, dy: 1 },  // 2: down
          { dx: -1, dy: 0 }, // 3: left
        ];

        const validDirs = [];
        for (let d = 0; d < 4; d++) {
          if (d === (this.dir + 2) % 4) continue;
          const nx = this.gx + DIRS[d].dx;
          const ny = this.gy + DIRS[d].dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            validDirs.push(d);
          }
        }

        if (validDirs.length === 0) {
          const revDir = (this.dir + 2) % 4;
          this.dir = revDir;
          this.nextGx = Math.max(0, Math.min(cols - 1, this.gx + DIRS[revDir].dx));
          this.nextGy = Math.max(0, Math.min(rows - 1, this.gy + DIRS[revDir].dy));
          return;
        }

        if (validDirs.includes(this.dir) && Math.random() < 0.60) {
          // Continue straight
        } else {
          this.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
        }

        this.nextGx = this.gx + DIRS[this.dir].dx;
        this.nextGy = this.gy + DIRS[this.dir].dy;
      }

      update() {
        if (this.alive) {
          this.t += this.speed;
          this.life--;

          if (this.t >= 1) {
            this.history.unshift({ gx: this.gx, gy: this.gy });
            if (this.history.length > this.maxTrail) {
              this.history.pop();
            }

            this.gx = this.nextGx;
            this.gy = this.nextGy;
            this.t = 0;

            if (Math.random() < 0.25) {
              spawnCellGlow(this.gx, this.gy, this.color);
            }

            if (this.life <= 0) {
              this.alive = false;
            } else {
              this.pickNextNode();
            }
          }
        } else {
          if (Math.random() < 0.35) {
            this.history.pop();
          }
        }
      }

      isDead() {
        return !this.alive && this.history.length === 0;
      }

      draw(ctx) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const histLen = this.history.length;

        // Zero-allocation path drawing: connect current node to history directly without creating arrays
        if (histLen > 0) {
          // Outer glow pass
          ctx.lineWidth = 4;
          ctx.shadowColor = this.color.glow;
          ctx.shadowBlur = 14;

          // Segment 0: this.gx, this.gy to history[0]
          ctx.strokeStyle = this.color.stroke;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          ctx.moveTo(this.gx * CELL_SIZE, this.gy * CELL_SIZE);
          ctx.lineTo(this.history[0].gx * CELL_SIZE, this.history[0].gy * CELL_SIZE);
          ctx.stroke();

          for (let i = 0; i < histLen - 1; i++) {
            const alpha = Math.max(0, 1 - (i / histLen)) * 0.45;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(this.history[i].gx * CELL_SIZE, this.history[i].gy * CELL_SIZE);
            ctx.lineTo(this.history[i + 1].gx * CELL_SIZE, this.history[i + 1].gy * CELL_SIZE);
            ctx.stroke();
          }

          // Inner core pass
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 6;

          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.moveTo(this.gx * CELL_SIZE, this.gy * CELL_SIZE);
          ctx.lineTo(this.history[0].gx * CELL_SIZE, this.history[0].gy * CELL_SIZE);
          ctx.stroke();

          for (let i = 0; i < histLen - 1; i++) {
            const alpha = Math.max(0, 1 - (i / histLen)) * 0.88;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(this.history[i].gx * CELL_SIZE, this.history[i].gy * CELL_SIZE);
            ctx.lineTo(this.history[i + 1].gx * CELL_SIZE, this.history[i + 1].gy * CELL_SIZE);
            ctx.stroke();
          }
        }

        // Active head segment
        if (this.alive) {
          const headX = (this.gx + (this.nextGx - this.gx) * this.t) * CELL_SIZE;
          const headY = (this.gy + (this.nextGy - this.gy) * this.t) * CELL_SIZE;
          const startX = this.gx * CELL_SIZE;
          const startY = this.gy * CELL_SIZE;

          // Soft glow head line
          ctx.lineWidth = 4;
          ctx.shadowColor = this.color.glow;
          ctx.shadowBlur = 14;
          ctx.strokeStyle = this.color.stroke;
          ctx.globalAlpha = 0.5;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(headX, headY);
          ctx.stroke();

          // Core head line
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = 0.95;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(headX, headY);
          ctx.stroke();

          // Glowing head pulse
          ctx.globalAlpha = 1;
          ctx.shadowColor = this.color.glow;
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(headX, headY, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    let runners = [];

    const setup = () => {
      const rect = container.getBoundingClientRect();
      width = Math.ceil(rect.width);
      height = Math.ceil(rect.height || window.innerHeight);

      // DPR 1 saves 75% memory on Retina/4K displays for ambient background canvas
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / CELL_SIZE) + 1;
      rows = Math.ceil(height / CELL_SIZE) + 1;

      runners = Array.from({ length: NUM_RUNNERS }, (_, i) => new GridGraphRunner(i % (ZONES_X * ZONES_Y)));
    };

    setup();

    const handleResize = () => {
      setup();
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });
    resizeObserver.observe(container);

    // Animation render loop
    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      // 1. Clear transparent canvas for hardware-accelerated CSS grid
      ctx.clearRect(0, 0, width, height);

      // 2. Fading glowing square cells
      for (let i = glowingCells.length - 1; i >= 0; i--) {
        const cell = glowingCells[i];
        cell.alpha -= cell.decay;

        if (cell.alpha <= 0) {
          glowingCells.splice(i, 1);
          continue;
        }

        const px = cell.gx * CELL_SIZE;
        const py = cell.gy * CELL_SIZE;

        ctx.save();
        ctx.globalAlpha = cell.alpha;
        ctx.strokeStyle = cell.color.stroke;
        ctx.shadowColor = cell.color.glow;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 1.4;

        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

        ctx.fillStyle = cell.color.glow;
        ctx.globalAlpha = cell.alpha * 0.16;
        ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        ctx.restore();
      }

      // 3. Update and draw runners
      for (let i = 0; i < runners.length; i++) {
        const runner = runners[i];
        runner.update();
        runner.draw(ctx);

        if (runner.isDead()) {
          runner.init();
        }
      }

      animId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause the render loop completely when offscreen!
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!animId) {
            animId = requestAnimationFrame(render);
          }
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.02 }
    );

    intersectionObserver.observe(container);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.gridContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.gridCanvas} />
      <div className={styles.overlay} />
    </div>
  );
}
