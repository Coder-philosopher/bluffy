'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { KeyboardEvent } from 'react'
import Image from 'next/image'

type CardProps = {
  src: string
  alt: string
  height?: number       // e.g., 144 = 9rem
  width?: number
   className?: string;        // e.g., 112 = 7rem
  borderColor?: string  // Tailwind color class (no dot), e.g., 'border-gray-500'
  shadowColor?: string  // Tailwind shadow class (optional)
  selected?: boolean
  tabIndex?: number
  onClick?: () => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
}

export const Card = ({
  src,
  alt,
  height = 144,
  width = 112,
  borderColor = 'border-gray-500',
  selected = false,
  tabIndex,
  onClick,
  onKeyDown,
  className
}: CardProps) => {
  return (
    <motion.div
      role="button"
      aria-label={alt}
      tabIndex={tabIndex ?? (onClick ? 0 : -1)}
      
      whileTap={{
        scale: 0.96,
        rotate: -1.2,
        boxShadow: '0 2px 10px 0 rgba(0,0,0,0.15)',
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 22,
        mass: 0.7,
      }}
      className={clsx(
        "relative inline-block cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      )}
      style={{
        width,
        height,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
        onKeyDown?.(e)
      }}
    >
      {/* Background card border + shadow */}
      <div
        className={clsx(
          "absolute inset-0 rounded-xl bg-white",
          borderColor,
          "border-[2.5px]",
          "shadow-lg",
          selected && "border-blue-500 ring-2 ring-blue-400"
        )}
        style={{
          zIndex: 1,
          boxShadow: selected
            ? '0 0 24px 3px rgba(59,130,246,0.22), 0 10px 28px rgba(0,0,0,0.15)'
            : '0 6px 28px rgba(0,0,0,0.13)',
        }}
      />

      {/* Card Image using Next.js Image */}
      <div className="relative z-10 w-full h-full rounded-lg overflow-hidden">
        <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        className={clsx("object-contain pointer-events-none select-none", className)}
        priority
      />
      </div>

      {/* Optional: blue radial glow if selected */}
      {selected && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 90%)",
          }}
        />
      )}

      
    </motion.div>
  )
}
