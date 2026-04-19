"use client"

import type React from "react"
import { motion, type Variants } from "motion/react"

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

interface LandingRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function LandingReveal({
  children,
  delay = 0,
  className,
}: LandingRevealProps): React.ReactElement {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={revealVariants}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
