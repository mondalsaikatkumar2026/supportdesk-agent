"use client";

import type { MouseEvent, ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type AuthShellProps = {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  heading: string;
  text: string;
  children: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  image,
  imageAlt,
  heading,
  text,
  children,
}: AuthShellProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 16 });
  const sy = useSpring(y, { stiffness: 120, damping: 16 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-50 lg:grid-cols-2">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl" />

      {/* Left: 3D image panel (desktop only) */}
      <section
        className="relative hidden items-center justify-center p-10 lg:flex"
        style={{ perspective: 1200 }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative h-[620px] w-full max-w-xl overflow-hidden rounded-[2rem] shadow-2xl shadow-indigo-900/30 ring-1 ring-white/40"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-indigo-950/30 to-transparent" />

          {/* Floating glass badge (top) */}
          <motion.div
            style={{ transform: "translateZ(60px)" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 top-6 flex items-center gap-3 rounded-2xl bg-white/20 px-4 py-3 text-white shadow-xl backdrop-blur-md ring-1 ring-white/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-lg font-bold text-indigo-600">
              S
            </span>
            <span className="text-sm font-semibold tracking-wide">SupportDesk Agent</span>
          </motion.div>

          {/* Floating glass badge (right) */}
          <motion.div
            style={{ transform: "translateZ(80px)" }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute right-6 top-28 rounded-2xl bg-white/20 px-4 py-3 text-white shadow-xl backdrop-blur-md ring-1 ring-white/30"
          >
            <p className="text-xs text-white/80">Average reply time</p>
            <p className="text-xl font-bold">2 min</p>
          </motion.div>

          {/* Bottom text */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className="absolute inset-x-0 bottom-0 p-8 text-white"
          >
            <h2 className="text-3xl font-extrabold leading-tight">{heading}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{text}</p>
          </div>
        </motion.div>
      </section>

      {/* Right: form */}
      <section className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl bg-white/80 p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-10"
        >
          <div className="mb-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/40 lg:hidden">
              S
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </section>
    </main>
  );
}