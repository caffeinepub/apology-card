import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  swayDuration: number;
  emoji: string;
}

const HEART_EMOJIS = ["❤️", "🩷", "💕", "💗", "💖", "💝", "🌹"];

const BG_ORBS = [
  { w: 60, h: 60, bg: "oklch(0.75 0.12 10)", top: "5%", left: "5%" },
  { w: 100, h: 100, bg: "oklch(0.77 0.12 15)", top: "15%", left: "85%" },
  { w: 140, h: 140, bg: "oklch(0.79 0.12 20)", top: "70%", left: "8%" },
  { w: 180, h: 180, bg: "oklch(0.81 0.12 25)", top: "80%", left: "88%" },
  { w: 220, h: 220, bg: "oklch(0.83 0.12 30)", top: "20%", left: "45%" },
  { w: 260, h: 260, bg: "oklch(0.85 0.12 35)", top: "60%", left: "92%" },
  { w: 300, h: 300, bg: "oklch(0.77 0.12 15)", top: "40%", left: "2%" },
  { w: 340, h: 340, bg: "oklch(0.79 0.12 20)", top: "10%", left: "60%" },
];

function FloatingHearts({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);

  const spawnHeart = useCallback(() => {
    const id = counterRef.current++;
    const heart: FloatingHeart = {
      id,
      x: Math.random() * 100,
      size: 16 + Math.random() * 28,
      duration: 2.5 + Math.random() * 2,
      swayDuration: 1.2 + Math.random() * 0.8,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    };
    setHearts((prev) => [...prev, heart]);
    setTimeout(
      () => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      },
      (heart.duration + 0.5) * 1000,
    );
  }, []);

  useEffect(() => {
    if (active) {
      for (let i = 0; i < 12; i++) {
        setTimeout(spawnHeart, i * 120);
      }
      intervalRef.current = setInterval(spawnHeart, 350);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, spawnHeart]);

  return (
    <>
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.x}vw`,
            bottom: "-60px",
            fontSize: `${heart.size}px`,
            ["--duration" as string]: `${heart.duration}s`,
            ["--sway-duration" as string]: `${heart.swayDuration}s`,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </>
  );
}

export default function App() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.88 0.08 15 / 0.7) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.82 0.10 20 / 0.5) 0%, transparent 60%), oklch(0.96 0.02 15)",
      }}
    >
      {/* Decorative background orbs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {BG_ORBS.map((orb) => (
          <div
            key={`${orb.top}-${orb.left}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${orb.w}px`,
              height: `${orb.h}px`,
              background: orb.bg,
              top: orb.top,
              left: orb.left,
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>

      <FloatingHearts active={accepted} />

      {/* Card */}
      <motion.article
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-3xl px-8 py-10 sm:px-12 sm:py-14 text-center"
          style={{
            background: "oklch(0.99 0.008 20 / 0.95)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid oklch(0.88 0.06 15 / 0.5)",
            boxShadow:
              "0 20px 60px -12px oklch(0.52 0.22 15 / 0.4), 0 4px 20px -4px oklch(0.52 0.22 15 / 0.2)",
          }}
        >
          {/* Heart icon */}
          <motion.div
            className="heart-animate text-6xl sm:text-7xl mb-6 inline-block"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400 }}
            aria-hidden="true"
          >
            ❤️
          </motion.div>

          {/* Heading */}
          <h1
            className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            style={{ color: "oklch(0.42 0.18 15)" }}
          >
            I&apos;m So Sorry
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div
              className="h-px w-12"
              style={{ background: "oklch(0.80 0.10 15)" }}
            />
            <span className="text-lg" aria-hidden="true">
              🌹
            </span>
            <div
              className="h-px w-12"
              style={{ background: "oklch(0.80 0.10 15)" }}
            />
          </div>

          {/* Message */}
          <div
            className="font-body text-lg sm:text-xl leading-relaxed space-y-4 text-left mb-8"
            style={{ color: "oklch(0.32 0.06 20)" }}
          >
            <p>
              I&apos;ve been thinking a lot about what happened, and I realize I
              messed up. I hate knowing that I caused you any stress or hurt.
            </p>
            <p>
              <strong style={{ color: "oklch(0.42 0.18 15)" }}>
                You deserve my best
              </strong>
              , and I clearly missed the mark this time. I value us more than
              being right, and I really want to make this up to you.
            </p>
            <p className="italic" style={{ color: "oklch(0.48 0.10 15)" }}>
              Can we talk when you&apos;re ready?
            </p>
          </div>

          {/* CTA / Success state */}
          <AnimatePresence mode="wait">
            {!accepted ? (
              <motion.button
                key="btn"
                data-ocid="apology.primary_button"
                onClick={() => setAccepted(true)}
                className="shimmer-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-body text-xl font-semibold tracking-wide transition-transform"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: "0 8px 30px -6px oklch(0.52 0.22 15 / 0.5)",
                }}
              >
                Click to Accept My Apology
              </motion.button>
            ) : (
              <motion.div
                key="success"
                data-ocid="apology.success_state"
                className="rounded-2xl px-6 py-5"
                style={{
                  background: "oklch(0.95 0.06 15 / 0.5)",
                  border: "1.5px solid oklch(0.85 0.10 15 / 0.6)",
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <p
                  className="font-display text-2xl sm:text-3xl font-bold"
                  style={{ color: "oklch(0.42 0.18 15)" }}
                >
                  Thank you for being so patient with me. I love you! ❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>

      {/* Footer */}
      <footer
        className="mt-10 text-center font-body text-sm"
        style={{ color: "oklch(0.58 0.05 20)" }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.52 0.12 15)" }}
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
