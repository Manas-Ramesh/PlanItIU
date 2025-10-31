'use client'

import { useState, useEffect } from 'react'

interface TypingAnimationProps {
  text: string
  speed?: number
  pauseTime?: number
  className?: string
}

export default function TypingAnimation({ text, speed = 150, pauseTime = 4975, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isDeleting && currentIndex < text.length) {
      // Typing forward
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isDeleting && currentIndex >= text.length) {
      // Finished typing, wait before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, pauseTime)

      return () => clearTimeout(timeout)
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting backward
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1))
      }, speed / 2) // Delete faster than typing

      return () => clearTimeout(timeout)
    } else if (isDeleting && displayedText.length === 0) {
      // Finished deleting, reset and start again
      setIsDeleting(false)
      setCurrentIndex(0)
    }
  }, [currentIndex, text, speed, pauseTime, isDeleting, displayedText])

  return (
    <div className={`${className}`}>
      <span className="text-white font-bold text-4xl md:text-5xl">
        {displayedText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  )
}

