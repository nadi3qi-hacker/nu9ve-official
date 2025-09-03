"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    icon: string
    color: string
    totalLevels: number
    completedLevels: number
  }
  isActive?: boolean
  onSelect: () => void
  className?: string
}

export default function CourseCard({ course, isActive = false, onSelect, className = "" }: CourseCardProps) {
  const progressPercentage = (course.completedLevels / course.totalLevels) * 100

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 border-2
        ${
          isActive
            ? "border-amber-400 shadow-2xl scale-105 z-10"
            : "border-amber-200 shadow-lg hover:shadow-xl opacity-75 hover:opacity-90"
        }
        ${className}
      `}
      onClick={onSelect}
      style={{
        aspectRatio: "3/4",
        minHeight: "320px",
      }}
    >
      <div className={`h-3 bg-gradient-to-r ${course.color}`} />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="text-4xl mb-2">{course.icon}</div>
          <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
            {course.completedLevels}/{course.totalLevels}
          </div>
        </div>
        <CardTitle className="text-lg text-amber-800 leading-tight">{course.title}</CardTitle>
        <p className="text-sm text-amber-600 line-clamp-2">{course.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="flex justify-between text-xs text-amber-700 mb-1">
            <span>Progreso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Button
          className={`w-full ${
            isActive
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
              : "bg-amber-100 hover:bg-amber-200 text-amber-800"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {course.completedLevels === 0 ? "Comenzar" : "Continuar"}
        </Button>
      </CardContent>

      {course.completedLevels === course.totalLevels && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          ✓ Completado
        </div>
      )}
    </Card>
  )
}
