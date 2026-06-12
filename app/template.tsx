"use client";

import { motion } from "framer-motion";

/** Subtle fade on every route transition (App Router re-mounts templates per navigation). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
