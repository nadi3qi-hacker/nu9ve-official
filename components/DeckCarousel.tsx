"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CourseCard from "./CourseCard"

interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  totalLevels: number
  completedLevels: number
}

interface DeckCarouselProps {
  courses: Course[]
  onCourseSelect: (courseId: string) => void
}

export default function DeckCarousel({ courses, onCourseSelect }: DeckCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="relative h-96 flex items-center justify-center perspective-1000">
        {courses.map((course, index) => {
          const offset = index - activeIndex
          const isActive = index === activeIndex

          return (
            <div
              key={course.id}
              className={`
                absolute transition-all duration-500 ease-out
                ${isActive ? "z-20" : "z-10"}
              `}
              style={{
                transform: `
                  translateX(${offset * 120}px) 
                  translateZ(${isActive ? 0 : -100}px)
                  rotateY(${offset * -15}deg)
                  scale(${isActive ? 1 : 0.85})
                `,
                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.6,
              }}
            >
              <CourseCard
                course={course}
                isActive={isActive}
                onSelect={() => onCourseSelect(course.id)}
                className="w-64"
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="sm"
          className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-amber-500" : "bg-amber-200"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={goToNext}
          variant="outline"
          size="sm"
          className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
