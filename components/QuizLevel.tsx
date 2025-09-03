"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ArrowLeft, Brain, Target } from "lucide-react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
  category: string
}

interface QuizLevelProps {
  levelId: number
  onComplete: (score: number, badges: string[]) => void
  onExit: () => void
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál es el principio más importante para establecer rapport en una primera conversación?",
    options: [
      "Hablar sobre tus logros profesionales",
      "Encontrar puntos en común y mostrar interés genuino",
      "Hacer preguntas directas sobre el trabajo",
      "Mantener una postura dominante",
    ],
    correctAnswer: 1,
    explanation:
      "El rapport se construye encontrando conexiones genuinas y mostrando interés real en la otra persona. Esto activa el principio de simpatía de Cialdini.",
    points: 20,
    category: "Construcción de Rapport",
  },
  {
    id: 2,
    question: "Cuando alguien comparte un problema contigo, ¿cuál es la mejor respuesta inicial?",
    options: [
      "Ofrecer una solución inmediata",
      "Cambiar de tema para aliviar la tensión",
      "Validar sus sentimientos y hacer preguntas para entender mejor",
      "Contar una experiencia similar tuya",
    ],
    correctAnswer: 2,
    explanation:
      "La escucha activa requiere primero validar los sentimientos de la persona y buscar entender completamente antes de ofrecer soluciones.",
    points: 25,
    category: "Escucha Activa",
  },
  {
    id: 3,
    question: "¿Qué porcentaje de la comunicación se transmite a través del lenguaje corporal?",
    options: ["25%", "40%", "55%", "70%"],
    correctAnswer: 2,
    explanation:
      "Según Albert Mehrabian, el 55% de la comunicación es lenguaje corporal, 38% tono de voz y solo 7% palabras. El lenguaje no verbal es crucial.",
    points: 15,
    category: "Comunicación No Verbal",
  },
  {
    id: 4,
    question: "En una situación de conflicto, ¿cuál es la estrategia más efectiva?",
    options: [
      "Defender tu posición firmemente",
      "Evitar el conflicto completamente",
      "Buscar entender la perspectiva del otro antes de responder",
      "Usar tu autoridad para resolver rápidamente",
    ],
    correctAnswer: 2,
    explanation:
      "La resolución efectiva de conflictos comienza con la comprensión empática. Esto reduce la defensividad y abre espacio para soluciones colaborativas.",
    points: 30,
    category: "Resolución de Conflictos",
  },
  {
    id: 5,
    question: "¿Cuál es la técnica más efectiva para dar feedback constructivo?",
    options: [
      "Sandwich: positivo-negativo-positivo",
      "Ser directo y honesto sin rodeos",
      "SBI: Situación-Comportamiento-Impacto + pregunta abierta",
      "Esperar a la evaluación anual",
    ],
    correctAnswer: 2,
    explanation:
      "El modelo SBI (Situación-Comportamiento-Impacto) es más efectivo porque es específico, observable y se enfoca en comportamientos modificables, no en la persona.",
    points: 25,
    category: "Feedback Efectivo",
  },
  {
    id: 6,
    question: "¿Qué hace que una presentación sea más persuasiva?",
    options: [
      "Muchos datos y estadísticas",
      "Historias que conecten emocionalmente + datos de apoyo",
      "Hablar rápido para cubrir más contenido",
      "Usar jerga técnica para mostrar expertise",
    ],
    correctAnswer: 1,
    explanation:
      "Las historias activan múltiples áreas del cerebro y crean conexión emocional, mientras que los datos proporcionan respaldo lógico. La combinación es poderosa.",
    points: 20,
    category: "Presentaciones",
  },
]

export default function QuizLevel({ levelId, onComplete, onExit }: QuizLevelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const question = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === question.correctAnswer
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + question.points)
      setCorrectAnswers(correctAnswers + 1)
    }

    setShowResult(true)

    setTimeout(() => {
      if (isLastQuestion) {
        const finalScore = isCorrect ? score + question.points : score
        const badges = []

        if (correctAnswers + (isCorrect ? 1 : 0) === quizQuestions.length) {
          badges.push("Perfeccionista")
        }
        if (finalScore >= 120) {
          badges.push("Experto en Comunicación")
        }
        if (correctAnswers + (isCorrect ? 1 : 0) >= 5) {
          badges.push("Conocedor")
        }

        onComplete(finalScore, badges)
      } else {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }, 3000)
  }

  const getScorePercentage = () => {
    const maxScore = quizQuestions.reduce((sum, q) => sum + q.points, 0)
    return Math.round((score / maxScore) * 100)
  }

  if (showResult) {
    const isCorrect = selectedAnswer === question.correctAnswer
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full animate-bounce-in">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{isCorrect ? "✅" : "❌"}</div>
            <h3 className="text-2xl font-bold mb-4">{isCorrect ? "¡Correcto!" : "Incorrecto"}</h3>

            {isCorrect && (
              <div className="bg-green-100 rounded-lg p-4 mb-4">
                <p className="text-lg font-semibold text-green-700 mb-2">+{question.points} puntos</p>
                <Badge className="bg-green-500">{question.category}</Badge>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
              <p className="font-semibold mb-2">Explicación:</p>
              <p className="text-muted-foreground">{question.explanation}</p>
              {!isCorrect && (
                <p className="text-sm text-primary mt-2">
                  Respuesta correcta: {question.options[question.correctAnswer]}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">
                Puntuación: {score} ({getScorePercentage()}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onExit} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span className="font-bold">Quiz de Comunicación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-bold text-lg">{score}</span>
                </div>
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="bg-white/20" />
            <p className="text-sm text-white/80">
              Pregunta {currentQuestion + 1} de {quizQuestions.length}
            </p>
          </CardHeader>
        </Card>

        {/* Question */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-primary" />
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant="secondary">{question.points} pts</Badge>
            </div>
            <CardTitle className="text-xl text-balance leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
                    selectedAnswer === index
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/5 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        selectedAnswer === index
                          ? "border-primary-foreground text-primary-foreground"
                          : "border-primary text-primary"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-pretty leading-relaxed">{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {correctAnswers} respuestas correctas de {currentQuestion}
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="bg-primary hover:bg-primary/90"
              >
                {isLastQuestion ? "Finalizar Quiz" : "Siguiente Pregunta"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso del Quiz</span>
              <span className="font-semibold">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
