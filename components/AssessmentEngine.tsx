"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Lightbulb, Award, Star } from "lucide-react"

interface AssessmentItem {
  id: string
  question: string
  options: {
    text: string
    correct: boolean
    points: number
  }[]
  feedback: {
    correct: string
    incorrect: string
  }
  hint?: string
}

interface AssessmentLevel {
  id: string
  title: string
  type: "roleplay" | "quiz" | "story" | "interactive"
  hasContinuity: boolean
  items: AssessmentItem[]
  background?: string
  story?: string
}

interface AssessmentEngineProps {
  level: AssessmentLevel
  userData: any
  onComplete: (result: AssessmentResult) => void
  onBack: () => void
  onLoseLife: () => void
}

interface AssessmentResult {
  score: number
  mistakes: number
  firstTryCorrect: number
  medal: "platinum" | "gold" | "silver"
  timeMs: number
}

export default function AssessmentEngine({ level, userData, onComplete, onBack, onLoseLife }: AssessmentEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [firstTryCorrect, setFirstTryCorrect] = useState(0)
  const [retryQueue, setRetryQueue] = useState<AssessmentItem[]>([])
  const [isRetryRound, setIsRetryRound] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [startTime] = useState(Date.now())
  const [attemptedItems, setAttemptedItems] = useState<Set<string>>(new Set())
  const [shuffledItems, setShuffledItems] = useState<AssessmentItem[]>([])

  const petData = {
    "baby-capybara": { icon: "🐹", name: "Capi Bebé" },
    "adult-capybara": { icon: "🦫", name: "Capi Adulto" },
    "golden-capybara": { icon: "✨🦫", name: "Capi Dorado" },
    "ninja-capybara": { icon: "🥷🦫", name: "Capi Ninja" },
  }[userData.currentPet] || { icon: "🐹", name: "Capi Bebé" }

  // Initialize shuffled items for quiz levels
  useEffect(() => {
    if (!level.hasContinuity) {
      // Shuffle items with stable seed for resume capability
      const shuffled = [...level.items].sort(() => Math.random() - 0.5)
      setShuffledItems(shuffled)
    } else {
      setShuffledItems(level.items)
    }
  }, [level])

  const currentItems = isRetryRound ? retryQueue : shuffledItems
  const currentItem = currentItems[currentIndex]

  const calculateMedal = (mistakeCount: number): "platinum" | "gold" | "silver" => {
    if (mistakeCount === 0) return "platinum"
    if (mistakeCount <= 2) return "gold"
    return "silver"
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const option = currentItem.options[optionIndex]
    const isFirstTry = !attemptedItems.has(currentItem.id)

    if (option.correct) {
      const points = isFirstTry ? option.points + 25 : option.points // First-try bonus
      setScore((prev) => prev + points)

      if (isFirstTry) {
        setFirstTryCorrect((prev) => prev + 1)
      }

      if (isRetryRound) {
        // Remove from retry queue
        setRetryQueue((prev) => prev.filter((item) => item.id !== currentItem.id))
      }
    } else {
      setMistakes((prev) => prev + 1)
      setScore((prev) => prev - 50) // Penalty for wrong answer
      onLoseLife()
      setAttemptedItems((prev) => new Set(prev).add(currentItem.id))

      if (!level.hasContinuity && !isRetryRound) {
        // Add to retry queue for quiz levels
        setRetryQueue((prev) => [...prev, currentItem])
      }
    }

    setShowFeedback(true)
  }

  const handleNext = () => {
    const option = currentItem.options[selectedOption!]

    if (level.hasContinuity) {
      // Continuity flow: always advance regardless of correctness
      if (currentIndex < currentItems.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        resetForNextItem()
      } else {
        completeAssessment()
      }
    } else {
      // Quiz flow: advance only if correct, or handle retry logic
      if (option.correct) {
        if (isRetryRound) {
          // In retry round, check if queue is empty
          if (retryQueue.filter((item) => item.id !== currentItem.id).length === 0) {
            completeAssessment()
          } else {
            setCurrentIndex(0) // Reset to first item in retry queue
            resetForNextItem()
          }
        } else {
          // First pass: advance to next item
          if (currentIndex < currentItems.length - 1) {
            setCurrentIndex((prev) => prev + 1)
            resetForNextItem()
          } else {
            // First pass complete, check if retry round needed
            if (retryQueue.length > 0) {
              setIsRetryRound(true)
              setCurrentIndex(0)
              resetForNextItem()
            } else {
              completeAssessment()
            }
          }
        }
      } else {
        // Wrong answer: stay on same item for immediate retry
        resetForNextItem()
      }
    }
  }

  const resetForNextItem = () => {
    setSelectedOption(null)
    setShowFeedback(false)
    setHintUsed(false)
  }

  const completeAssessment = () => {
    const timeMs = Date.now() - startTime
    const medal = calculateMedal(mistakes)

    const result: AssessmentResult = {
      score,
      mistakes,
      firstTryCorrect,
      medal,
      timeMs,
    }

    onComplete(result)
  }

  const showHint = () => {
    if (!hintUsed && currentItem.hint) {
      setHintUsed(true)
    }
  }

  const getMedalIcon = (medal: string) => {
    switch (medal) {
      case "platinum":
        return <Award className="w-5 h-5 text-blue-500" />
      case "gold":
        return <Award className="w-5 h-5 text-yellow-500" />
      case "silver":
        return <Award className="w-5 h-5 text-gray-400" />
      default:
        return <Star className="w-5 h-5 text-gray-300" />
    }
  }

  if (!currentItem) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="border-amber-300 text-amber-700 bg-transparent">
          ← Volver al curso
        </Button>
        <h1 className="text-2xl font-bold text-amber-800">{level.title}</h1>
        <div className="text-3xl animate-bounce">{petData.icon}</div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-bold text-red-600">
              {userData.lives}/{userData.maxLives}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getMedalIcon(calculateMedal(mistakes))}
            <span className="text-sm text-gray-600">
              {mistakes === 0 ? "Platino" : mistakes <= 2 ? "Oro" : "Plata"}
            </span>
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden border-2 border-amber-300">
        {level.background && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('${level.background}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        <CardContent className="p-8 relative z-10">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-amber-700 mb-2">
              <span>{isRetryRound ? "Repaso" : "Progreso"}</span>
              <span>
                {isRetryRound ? `${retryQueue.length} por repasar` : `${currentIndex + 1} / ${currentItems.length}`}
              </span>
            </div>
            <Progress
              value={
                isRetryRound
                  ? ((retryQueue.length - retryQueue.filter((item) => item.id !== currentItem.id).length) /
                      retryQueue.length) *
                    100
                  : ((currentIndex + 1) / currentItems.length) * 100
              }
            />
          </div>

          {currentIndex === 0 && level.story && !isRetryRound && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800">{level.story}</p>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{petData.icon}</div>
              <div>
                <p className="text-sm text-amber-600">{petData.name} está aquí para ayudarte</p>
                {hintUsed && currentItem.hint && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">💡 {currentItem.hint}</p>
                  </div>
                )}
              </div>
            </div>
            {currentItem.hint && (
              <Button
                onClick={showHint}
                disabled={hintUsed}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 bg-transparent"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {hintUsed ? "Pista usada" : "Pedir pista"}
              </Button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-amber-800">{currentItem.question}</h3>
            <div className="space-y-3">
              {currentItem.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                  variant={selectedOption === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedOption === index
                      ? option.correct
                        ? "bg-green-500 hover:bg-green-600 text-white border-green-600"
                        : "bg-red-500 hover:bg-red-600 text-white border-red-600"
                      : "border-amber-300 text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                currentItem.options[selectedOption!].correct
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`font-medium ${
                  currentItem.options[selectedOption!].correct ? "text-green-800" : "text-red-800"
                }`}
              >
                {currentItem.options[selectedOption!].correct
                  ? currentItem.feedback.correct
                  : currentItem.feedback.incorrect}
              </p>
              <Button onClick={handleNext} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                {currentItem.options[selectedOption!].correct
                  ? (isRetryRound && retryQueue.filter((item) => item.id !== currentItem.id).length === 0) ||
                    (!isRetryRound && currentIndex === currentItems.length - 1 && retryQueue.length === 0)
                    ? "Completar nivel"
                    : "Siguiente"
                  : "Intentar de nuevo"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
