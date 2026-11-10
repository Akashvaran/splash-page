
import { useEffect, useRef, useState } from "react";

import {
  motion,
  animate,
  useMotionValue,
  useTransform
} from "framer-motion";

import {
  Users,
  CalendarCheck,
  IdCard,
  ChartNoAxesCombined,
  Wallet,
  Target
} from "lucide-react";

import "./SplashScreen.css";

// --------------------------------
// Animation Configuration
// --------------------------------

const ORBIT_DELAY = 1.2;
const ORBIT_DURATION = 3;

const TOTAL_DURATION = ORBIT_DELAY + ORBIT_DURATION;

const ORBIT_RADIUS = 105;

const icons = [
  { Icon: Users, color: "#B77AFF" },
  { Icon: CalendarCheck, color: "#36D9FF" },
  { Icon: IdCard, color: "#FF86B7" },
  { Icon: ChartNoAxesCombined, color: "#43E5B5" },
  { Icon: Wallet, color: "#FFC15D" },
  { Icon: Target, color: "#A28BFF" }
];

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const easeInOut = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;



function OrbitIcon({ Icon, color, baseAngle, orbit }) {

  const getPosition = (value) => {

    const rotation = easeInOut(
      clamp((value - 0.05) / 0.95)
    );

    const angle =
      ((baseAngle + rotation * 360 - 90) * Math.PI) / 180;

    const shrink = easeInOut(
      clamp((value - 0.72) / 0.28)
    );

    const radius = ORBIT_RADIUS * (1 - shrink);

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  const x = useTransform(orbit, (value) =>
    getPosition(value).x
  );

  const y = useTransform(orbit, (value) =>
    getPosition(value).y
  );

  const scale = useTransform(
    orbit,
    [0, 0.08, 0.72, 1],
    [0, 1, 1, 0]
  );

  const opacity = useTransform(
    orbit,
    [0, 0.08, 0.72, 0.92, 1],
    [0, 1, 1, 0.8, 0]
  );

  return (
    <motion.div
      className="orbit-icon"
      style={{
        x,
        y,
        scale,
        opacity
      }}
    >
      <motion.div
        className="floating-icon"
        style={{
          "--icon-color": color
        }}
        animate={{
          y: [0, -5, 0]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon
          size={20}
          strokeWidth={2.2}
          color={color}
        />
      </motion.div>
    </motion.div>
  );
}

export default function SplashScreen({ onComplete }) {

  const [progress, setProgress] = useState(0);

  const completed = useRef(false);

  const callbackRef = useRef(onComplete);

  callbackRef.current = onComplete;

  const orbit = useMotionValue(0);

  const logoScale = useTransform(
    orbit,
    [0, 0.1, 1],
    [1, 1, 1.08]
  );

  useEffect(() => {

    let progressFrame;
    let completionTimer;

    const startTime = performance.now();

    const controls = animate(orbit, 1, {
      duration: TOTAL_DURATION,
      ease: "linear",
      onUpdate: (value) => {

        const percentage = Math.round(
          value * 100
        );

        setProgress(percentage);
      },

      onComplete: () => {

        setProgress(100);

        if (!completed.current) {

          completed.current = true;

          completionTimer = setTimeout(() => {
            callbackRef.current?.();
          }, 400);
        }
      }
    });


    const updateProgress = () => {

      const elapsed = performance.now() - startTime;

      const activeTime = Math.max(
        0,
        elapsed - ORBIT_DELAY * 1000
      );

      const percentage = clamp(
        activeTime / (TOTAL_DURATION * 1000 - ORBIT_DELAY * 1000)
      );

      setProgress(Math.round(percentage * 100));

      if (percentage < 1) {
        progressFrame = requestAnimationFrame(updateProgress);
      }
    };

    progressFrame = requestAnimationFrame(updateProgress);

    return () => {
      controls.stop();
      cancelAnimationFrame(progressFrame);
      clearTimeout(completionTimer);
    };

  }, [orbit]);

  return (

    <main className="splash-screen">


      <div className="background-grid" />

      <div className="glow glow-purple" />
      <div className="glow glow-blue" />
      <div className="glow glow-pink" />



      {Array.from({ length: 18 }).map((_, index) => (

        <motion.div
          key={index}
          className="particle"
          style={{
            left: `${(index * 37 + 11) % 95}%`,
            top: `${(index * 23 + 9) % 90}%`
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.6, 1.5, 0.6],
            y: [0, -12, 0]
          }}
          transition={{
            duration: 2 + (index % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.12
          }}
        />

      ))}



      <motion.div
        className="logo-container"
        initial={{
          opacity: 0,
          scale: 0.3,
          rotateY: -180,
          rotateX: 40
        }}
        animate={{
          opacity: 1,
          scale: [0.3, 1.12, 1],
          rotateY: 0,
          rotateX: 0
        }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{
          scale: logoScale
        }}
      >

        <motion.div
          className="logo-box"
          animate={{
            y: [0, -6, 0],
            rotateZ: [0, 2, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >

          <img
            src="/image.png"
            alt="Dudu HR Logo"
            className="logo-image"
          />

          <div className="logo-shine" />

        </motion.div>

        <div className="logo-shadow" />

      </motion.div>

      <div className="icon-layer">

        {icons.map(({ Icon, color }, index) => (

          <OrbitIcon
            key={index}
            Icon={Icon}
            color={color}
            baseAngle={(360 / icons.length) * index}
            orbit={orbit}
          />

        ))}

      </div>


      <motion.div
        className="brand-section"
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}
        transition={{
          delay: 0.4,
          duration: 1,
          ease: "easeOut"
        }}
      >

        <h1 className="brand-name">

          <span className="brand-dudu">
            Dudu
          </span>

          {" "}

          <span className="brand-hr">
            HR
          </span>

        </h1>

        <p className="tagline">
          YOUR COMPLETE HR ECOSYSTEM
        </p>

        <div className="brand-decoration">
          <span />
          <span />
          <span />
        </div>

      </motion.div>


      <div className="progress-section">

        <div className="progress-track">

          <motion.div
            className="progress-fill"
            style={{
              width: `${progress}%`
            }}
          />

          <div className="progress-highlight" />

        </div>


        <div className="progress-info">

          <span>
            {progress < 100
              ? "Initializing HR workspace..."
              : "Workspace ready"}
          </span>

          <strong>
            {progress}%
          </strong>

        </div>


        <motion.div
          className="loading-status"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >

          {progress === 100
            ? "READY TO LAUNCH"
            : "PREPARING YOUR EXPERIENCE"}

          <span> ✦ </span>

        </motion.div>


        <p className="bottom-caption">
          POWERED BY DUDU HR
        </p>

      </div>

    </main>
  );
}
