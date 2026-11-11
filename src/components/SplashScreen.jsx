
import { useEffect } from "react";

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

const ORBIT_DELAY = 1.3;
const ORBIT_DURATION = 4.5;

const ORBIT_RADIUS = 105;

const icons = [
  { Icon: Users, color: "#B77AFF" },
  { Icon: CalendarCheck, color: "#36D9FF" },
  { Icon: IdCard, color: "#FF86B7" },
  { Icon: ChartNoAxesCombined, color: "#43E5B5" },
  { Icon: Wallet, color: "#FFC15D" },
  { Icon: Target, color: "#A28BFF" }
];

const clamp = (value) =>
  Math.min(1, Math.max(0, value));

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

  const x = useTransform(orbit, value =>
    getPosition(value).x
  );

  const y = useTransform(orbit, value =>
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
          size={21}
          color={color}
          strokeWidth={2.2}
        />
      </motion.div>
    </motion.div>
  );
}


export default function SplashScreen({ onComplete }) {

  const orbit = useMotionValue(0);

  useEffect(() => {

    const controls = animate(orbit, 1, {
      duration: ORBIT_DURATION,
      delay: ORBIT_DELAY,
      ease: "linear",

      onComplete: () => {
        onComplete?.();
      }
    });

    return () => controls.stop();

  }, [orbit, onComplete]);

  return (

    <main className="splash-screen">

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
          delay: 1,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1]
        }}
      >

        <motion.div
          className="logo-box"

          animate={{
            rotateY: [0, 0, 8, -8, 0],
            rotateX: [0, 0, 3, -3, 0]
          }}

          transition={{
            delay: 1.2,
            duration: 3,
            ease: "easeIn"
          }}
        >

          <img
            src="/image.png"
            alt="Dudu HR Logo"
            className="logo-image"
          />

        </motion.div>

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

    </main>
  );
}
