"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Lightbulb } from "lucide-react"

interface LevelComponentProps {
  levelId: number
  userData: any
  onComplete: (xp: number, coins: number) => void
  onBack: () => void
  onLoseLife: () => void
}

export default function LevelComponent({ levelId, userData, onComplete, onBack, onLoseLife }: LevelComponentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctOnFirstTry, setCorrectOnFirstTry] = useState(0)
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set())

  const currentPet = userData.unlockedPets.find((petId: string) => petId === userData.currentPet)
  const petData = {
    "baby-capybara": { icon: "🐹", name: "Capi Bebé" },
    "adult-capybara": { icon: "🦫", name: "Capi Adulto" },
    "golden-capybara": { icon: "✨🦫", name: "Capi Dorado" },
    "ninja-capybara": { icon: "🥷🦫", name: "Capi Ninja" },
  }[userData.currentPet] || { icon: "🐹", name: "Capi Bebé" }

  const levelBackgrounds = {
    1: "/assets/worlds/campamento.png",
    2: "/assets/worlds/selva.png",
    3: "/assets/worlds/rio.png",
    4: "/assets/worlds/montana.png",
    5: "/assets/worlds/mercado.png",
  }

  const levelData = {
    1: {
      title: "Primeros Encuentros",
      type: "roleplay",
      duration: 8,
      xpReward: 50,
      coinReward: 20,
      background: levelBackgrounds[1],
      story:
        "Llegas a un campamento de capibaras exploradoras en medio de la selva. Es tu primer día y necesitas presentarte al grupo. Tu objetivo es causar una buena primera impresión.",
      hint: "Recuerda: una sonrisa genuina y mostrar interés por los demás son claves universales para conectar.",
      steps: [
        {
          situation: "¿Cómo saludarás a una capibara desconocida que se acerca a ti?",
          options: [
            { text: "Con una sonrisa cálida y contacto visual directo", correct: true, points: 20 },
            { text: "Con un saludo rápido sin mirar mucho", correct: false, points: 0 },
            { text: "Esperando a que ella hable primero", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! El contacto visual y la sonrisa genuina transmiten confianza y apertura.",
            incorrect:
              "Una sonrisa cálida y contacto visual directo son fundamentales para una buena primera impresión.",
          },
        },
        // ... existing steps ...
      ],
    },
    // ... existing level data ...
  }

  const currentLevelData = levelData[levelId as keyof typeof levelData]

  if (!currentLevelData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Nivel en Desarrollo</h2>
        <p className="text-muted-foreground mb-4">Este nivel estará disponible pronto.</p>
        <Button onClick={onBack}>Volver al curso</Button>
      </div>
    )
  }

  const currentStepData = currentLevelData.steps[currentStep]

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const option = currentStepData.options[optionIndex]

    if (option.correct) {
      setScore(score + option.points)
      setIsCorrect(true)
      if (!attemptedQuestions.has(currentStep)) {
        setCorrectOnFirstTry(correctOnFirstTry + 1)
      }
    } else {
      setIsCorrect(false)
      onLoseLife() // Lose a life for wrong answer
      setAttemptedQuestions(new Set(attemptedQuestions).add(currentStep))
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isCorrect) {
      // Only advance if answer is correct
      if (currentStep < currentLevelData.steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setSelectedOption(null)
        setShowFeedback(false)
        setHintUsed(false)
        setIsCorrect(null)
      } else {
        // Level completed
        onComplete(currentLevelData.xpReward, currentLevelData.coinReward)
      }
    } else {
      // Reset for immediate retry on same question
      setSelectedOption(null)
      setShowFeedback(false)
      setIsCorrect(null)
      // Don't advance currentStep - stay on same question
    }
  }

  const showHint = () => {
    if (!hintUsed) {
      setHintUsed(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="border-amber-300 text-amber-700 bg-transparent">
          ← Volver al curso
        </Button>
        <h1 className="text-2xl font-bold text-amber-800">{currentLevelData.title}</h1>
        <div className="text-3xl animate-bounce">{petData.icon}</div>
        <div className="flex items-center gap-2 ml-auto">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-600">
            {userData.lives}/{userData.maxLives}
          </span>
        </div>
      </div>

      <Card className="relative overflow-hidden border-2 border-amber-300">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('${currentLevelData.background}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <CardContent className="p-8 relative z-10">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-amber-700 mb-2">
              <span>Progreso</span>
              <span>
                {correctOnFirstTry} correctas / {currentLevelData.steps.length} preguntas
              </span>
            </div>
            <Progress value={((currentStep + 1) / currentLevelData.steps.length) * 100} />
          </div>

          {currentStep === 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800">{currentLevelData.story}</p>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{petData.icon}</div>
              <div>
                <p className="text-sm text-amber-600">{petData.name} está aquí para ayudarte</p>
                {hintUsed && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">💡 {currentLevelData.hint}</p>
                  </div>
                )}
              </div>
            </div>
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
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-amber-800">{currentStepData.situation}</h3>
            <div className="space-y-3">
              {currentStepData.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                  variant={selectedOption === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedOption === index
                      ? isCorrect
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
                isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <p className={`font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? currentStepData.feedback.correct : currentStepData.feedback.incorrect}
              </p>
              <Button onClick={handleNext} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                {isCorrect
                  ? currentStep < currentLevelData.steps.length - 1
                    ? "Siguiente"
                    : "Completar nivel"
                  : "Intentar de nuevo"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
