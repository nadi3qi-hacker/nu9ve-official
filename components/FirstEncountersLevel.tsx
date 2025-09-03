"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Lightbulb, Star, ArrowRight } from "lucide-react"

interface Choice {
  id: string
  text: string
  points: number
  feedback: string
  capibaraTip: string
}

interface Scenario {
  id: number
  situation: string
  character: string
  choices: Choice[]
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation:
      "Te encuentras en una conferencia de networking y ves a alguien interesante cerca de la mesa de café. ¿Cómo te acercas?",
    character: "Profesional de marketing",
    choices: [
      {
        id: "a",
        text: "Me acerco directamente y digo: 'Hola, soy [nombre], ¿en qué trabajas?'",
        points: 60,
        feedback: "Directo pero un poco abrupto. Podrías ser más cálido en tu aproximación.",
        capibaraTip: "Recuerda que la primera impresión es clave. ¡Sonríe siempre y muestra interés genuino!",
      },
      {
        id: "b",
        text: "Espero a que termine de servirse café y comento: 'Este café huele increíble, ¿has probado los pasteles?'",
        points: 90,
        feedback: "¡Excelente! Iniciaste con algo neutral y amigable que invita a la conversación.",
        capibaraTip: "¡Perfecto! Usar el entorno como punto de partida es una técnica genial 🎉",
      },
      {
        id: "c",
        text: "Me quedo esperando a que esa persona me hable primero",
        points: 20,
        feedback: "Muy pasivo. Las oportunidades de networking requieren que tomes la iniciativa.",
        capibaraTip: "¡Vamos, explorador! La confianza se construye con práctica. ¡Inténtalo de nuevo!",
      },
    ],
  },
  {
    id: 2,
    situation: "La conversación va bien y quieres conocer más sobre su trabajo. ¿Qué preguntas?",
    character: "Profesional de marketing",
    choices: [
      {
        id: "a",
        text: "¿Cuánto ganas en tu trabajo?",
        points: 10,
        feedback: "¡Demasiado personal! Esta pregunta puede hacer que la persona se sienta incómoda.",
        capibaraTip: "¡Ups! Evita temas muy personales al principio. Mejor enfócate en sus intereses profesionales.",
      },
      {
        id: "b",
        text: "¿Qué es lo que más te gusta de trabajar en marketing?",
        points: 95,
        feedback: "¡Perfecto! Esta pregunta muestra interés genuino y permite que la persona comparta su pasión.",
        capibaraTip: "¡Excelente elección! Las preguntas sobre pasiones crean conexiones auténticas ✨",
      },
      {
        id: "c",
        text: "Ah, marketing... debe ser fácil, ¿no?",
        points: 30,
        feedback: "Esto puede sonar condescendiente. Evita minimizar el trabajo de otros.",
        capibaraTip: "Recuerda mostrar respeto por el trabajo de otros. ¡Cada profesión tiene sus desafíos!",
      },
    ],
  },
]

export default function FirstEncountersLevel() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showCapibaraTip, setShowCapibaraTip] = useState(false)

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice.id)
    setShowFeedback(true)
    setTotalPoints((prev) => prev + choice.points)

    // Show capybara tip after a delay
    setTimeout(() => {
      setShowCapibaraTip(true)
    }, 1500)
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
      setShowCapibaraTip(false)
    }
  }

  const currentScene = scenarios[currentScenario]
  const selectedChoiceData = currentScene.choices.find((c) => c.id === selectedChoice)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden">
      {/* Animated jungle background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/jungle-campfire-night-scene-animated.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <Card className="mb-6 border-amber-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-8 h-8 text-amber-600" />
                <div>
                  <CardTitle className="text-2xl text-amber-800">Primeros Encuentros</CardTitle>
                  <p className="text-amber-600">Aprende a hacer una primera impresión positiva</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-amber-500 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  {totalPoints} puntos
                </Badge>
                <div className="text-4xl animate-bounce">🦫</div>
              </div>
            </div>
            <Progress value={((currentScenario + 1) / scenarios.length) * 100} className="mt-4" />
            <p className="text-sm text-amber-600">
              Escenario {currentScenario + 1} de {scenarios.length}
            </p>
          </CardHeader>
        </Card>

        {/* Main scenario */}
        <Card className="mb-6 border-amber-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
                {currentScene.character}
              </Badge>
              <h3 className="text-xl font-semibold text-amber-800 mb-4">{currentScene.situation}</h3>
            </div>

            {/* Choices */}
            <div className="space-y-4">
              {currentScene.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant={selectedChoice === choice.id ? "default" : "outline"}
                  className={`w-full text-left p-6 h-auto justify-start ${
                    selectedChoice === choice.id
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "border-amber-200 text-amber-800 hover:bg-amber-50"
                  }`}
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={showFeedback}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-lg">{choice.id.toUpperCase()})</span>
                    <span className="text-base leading-relaxed">{choice.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {showFeedback && selectedChoiceData && (
          <Card className="mb-6 border-green-200 bg-green-50/90 backdrop-blur-sm animate-in slide-in-from-bottom duration-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">
                  {selectedChoiceData.points >= 80 ? "🎉" : selectedChoiceData.points >= 60 ? "👍" : "💭"}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-2">+{selectedChoiceData.points} puntos</h4>
                  <p className="text-green-700">{selectedChoiceData.feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capybara tip */}
        {showCapibaraTip && selectedChoiceData && (
          <Card className="mb-6 border-blue-200 bg-blue-50/90 backdrop-blur-sm animate-in slide-in-from-right duration-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl animate-bounce">🦫</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Consejo de Capi</h4>
                  </div>
                  <p className="text-blue-700">{selectedChoiceData.capibaraTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next button */}
        {showFeedback && (
          <div className="text-center">
            {currentScenario < scenarios.length - 1 ? (
              <Button
                onClick={nextScenario}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 text-lg"
              >
                Siguiente Escenario
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg">
                ¡Completar Nivel!
                <Star className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
