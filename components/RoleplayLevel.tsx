"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Zap, Heart, MessageCircle, Trophy, ArrowLeft } from "lucide-react"

interface Choice {
  text: string
  points: number
  principle: string
  nextScene: number
  feedback: string
}

interface Scene {
  id: number
  title: string
  description: string
  capibaraExpression: string
  situation: string
  choices: Choice[]
}

interface RoleplayLevelProps {
  levelId: number
  onComplete: (score: number, badges: string[]) => void
  onExit: () => void
}

const communicationScenes: Scene[] = [
  {
    id: 1,
    title: "🌿 Primer Encuentro en la Oficina",
    description:
      "Es tu primer día en una nueva empresa. Te encuentras con Capi, tu nuevo compañero de equipo, en la cocina. Parece tímido y evita el contacto visual.",
    capibaraExpression: "😟",
    situation: "Situación: Necesitas establecer una buena primera impresión y crear rapport con tu nuevo colega.",
    choices: [
      {
        text: "Me acerco con una sonrisa y digo: 'Hola, soy [tu nombre]. ¿Tú debes ser Capi? He escuchado cosas geniales sobre tu trabajo.'",
        points: 20,
        principle: "Reciprocidad + Simpatía",
        nextScene: 2,
        feedback:
          "¡Excelente! Usaste el principio de reciprocidad al dar un cumplido primero, y simpatía al mostrar interés genuino.",
      },
      {
        text: "Le digo directamente: 'Hola, soy el nuevo. ¿Puedes explicarme cómo funcionan las cosas aquí?'",
        points: 10,
        principle: "Comunicación directa",
        nextScene: 3,
        feedback: "Funcional, pero podrías haber sido más cálido para establecer mejor conexión.",
      },
      {
        text: "Espero a que él hable primero mientras reviso mi teléfono.",
        points: 2,
        principle: "Pasividad",
        nextScene: 4,
        feedback: "Oportunidad perdida. La comunicación proactiva es clave para construir relaciones.",
      },
    ],
  },
  {
    id: 2,
    title: "🤝 Construyendo Confianza",
    description:
      "Capi se ilumina con tu comentario y sonríe. Te cuenta que está trabajando en un proyecto desafiante y se siente un poco abrumado.",
    capibaraExpression: "😊",
    situation: "Situación: Tu colega se está abriendo contigo. Es momento de profundizar la conexión.",
    choices: [
      {
        text: "'Entiendo perfectamente esa sensación. En mi trabajo anterior tuve un proyecto similar. ¿Te gustaría que conversemos sobre estrategias que me funcionaron?'",
        points: 25,
        principle: "Reciprocidad + Autoridad + Compromiso",
        nextScene: 5,
        feedback:
          "¡Perfecto! Compartiste experiencia (autoridad), ofreciste ayuda (reciprocidad) y te comprometiste a apoyar.",
      },
      {
        text: "'No te preocupes, seguro lo resolverás. Los proyectos siempre se ven más difíciles al principio.'",
        points: 12,
        principle: "Optimismo básico",
        nextScene: 6,
        feedback: "Positivo, pero podrías haber ofrecido apoyo más concreto para fortalecer la relación.",
      },
      {
        text: "'Ah, qué mal. Bueno, yo también tengo mucho que aprender aquí.'",
        points: 5,
        principle: "Empatía superficial",
        nextScene: 7,
        feedback: "Muy básico. Perdiste la oportunidad de establecer una conexión más profunda.",
      },
    ],
  },
  {
    id: 3,
    title: "📋 Ajustando el Enfoque",
    description:
      "Capi responde de manera educada pero formal. Notas que mantiene cierta distancia. Decides cambiar tu estrategia.",
    capibaraExpression: "😐",
    situation: "Situación: Tu enfoque inicial fue muy directo. Necesitas crear más calidez en la interacción.",
    choices: [
      {
        text: "'Disculpa si sonó muy formal. La verdad es que estoy un poco nervioso por el primer día. ¿Cómo te fue a ti cuando empezaste aquí?'",
        points: 18,
        principle: "Vulnerabilidad + Reciprocidad",
        nextScene: 5,
        feedback: "¡Genial! Mostraste vulnerabilidad auténtica y usaste una pregunta para crear reciprocidad.",
      },
      {
        text: "'Perfecto, entonces ¿me puedes mostrar dónde está mi escritorio?'",
        points: 8,
        principle: "Funcionalidad",
        nextScene: 6,
        feedback: "Cumple el objetivo básico, pero no construye relación personal.",
      },
      {
        text: "'Ok, supongo que cada uno tiene su estilo de trabajo.'",
        points: 3,
        principle: "Desconexión",
        nextScene: 7,
        feedback: "Te estás alejando en lugar de acercarte. La persistencia empática es importante.",
      },
    ],
  },
  {
    id: 4,
    title: "🔄 Segunda Oportunidad",
    description:
      "Capi termina su café y se prepara para irse. Te das cuenta de que necesitas actuar ahora o perderás la oportunidad de conectar.",
    capibaraExpression: "😕",
    situation: "Situación: Última oportunidad para establecer una conexión positiva antes de que se vaya.",
    choices: [
      {
        text: "'¡Espera! Perdón por no presentarme antes. Soy [tu nombre] y me encantaría conocer más sobre el equipo. ¿Tienes un minuto?'",
        points: 15,
        principle: "Recuperación + Interés genuino",
        nextScene: 5,
        feedback: "Buena recuperación. Reconociste el error y mostraste interés genuino.",
      },
      {
        text: "'Oye, ¿sabes dónde puedo encontrar a mi supervisor?'",
        points: 6,
        principle: "Funcional tardío",
        nextScene: 6,
        feedback: "Muy básico para una primera interacción. Podrías haber sido más personal.",
      },
      {
        text: "Dejo que se vaya sin decir nada.",
        points: 1,
        principle: "Inacción",
        nextScene: 7,
        feedback: "Oportunidad completamente perdida. La comunicación requiere acción proactiva.",
      },
    ],
  },
  {
    id: 5,
    title: "🌟 Conexión Exitosa",
    description:
      "¡Excelente! Has establecido una conexión genuina con Capi. Él se ofrece a presentarte al resto del equipo y a ayudarte durante tu primera semana.",
    capibaraExpression: "🤗",
    situation: "Resultado: Tu enfoque empático y auténtico ha creado el inicio de una gran relación profesional.",
    choices: [
      {
        text: "Continuar al siguiente desafío",
        points: 30,
        principle: "Éxito en construcción de rapport",
        nextScene: 8,
        feedback: "¡Felicitaciones! Dominaste los principios de comunicación efectiva en el primer encuentro.",
      },
    ],
  },
  {
    id: 6,
    title: "👍 Progreso Moderado",
    description:
      "Capi te ayuda con lo básico y es cordial, pero la interacción se mantiene en un nivel superficial. Hay potencial para mejorar.",
    capibaraExpression: "🙂",
    situation: "Resultado: Funcional pero sin conexión profunda. Aprendiste que la calidez personal es importante.",
    choices: [
      {
        text: "Reflexionar y continuar",
        points: 15,
        principle: "Aprendizaje continuo",
        nextScene: 8,
        feedback: "Bien. Reconoces que hay espacio para mejorar en crear conexiones más profundas.",
      },
    ],
  },
  {
    id: 7,
    title: "⚠️ Oportunidad de Aprendizaje",
    description:
      "La interacción no logró crear una conexión significativa. Capi se mantiene distante y formal contigo.",
    capibaraExpression: "😔",
    situation:
      "Resultado: Reflexiona sobre cómo la comunicación proactiva y empática es esencial para construir relaciones.",
    choices: [
      {
        text: "Aprender de la experiencia",
        points: 8,
        principle: "Reflexión y crecimiento",
        nextScene: 8,
        feedback: "Importante lección: la comunicación efectiva requiere iniciativa, empatía y autenticidad.",
      },
    ],
  },
  {
    id: 8,
    title: "🎯 Reflexión y Aprendizaje",
    description:
      "Has completado el primer nivel de comunicación. Cada decisión aplicó diferentes principios de comunicación efectiva en el entorno profesional.",
    capibaraExpression: "🎓",
    situation: "¡Nivel completado! Revisa tus resultados y los principios que aplicaste.",
    choices: [],
  },
]

const badges = [
  { name: "Empático", threshold: 50, icon: Heart, description: "Mostraste gran empatía y comprensión" },
  { name: "Comunicador", threshold: 70, icon: MessageCircle, description: "Excelente habilidad de comunicación" },
  { name: "Constructor de Relaciones", threshold: 90, icon: Star, description: "Maestro en crear conexiones" },
  { name: "Líder Natural", threshold: 110, icon: Trophy, description: "Liderazgo excepcional" },
]

export default function RoleplayLevel({ levelId, onComplete, onExit }: RoleplayLevelProps) {
  const [currentScene, setCurrentScene] = useState(1)
  const [score, setScore] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)
  const [choiceHistory, setChoiceHistory] = useState<number[]>([])

  const scene = communicationScenes.find((s) => s.id === currentScene)

  const makeChoice = (choiceIndex: number) => {
    if (!scene) return

    const choice = scene.choices[choiceIndex]
    const newScore = score + choice.points

    setLastChoice(choice)
    setShowFeedback(true)
    setScore(newScore)
    setChoiceHistory([...choiceHistory, choiceIndex])

    // Check for new badges
    const newBadges = badges
      .filter((badge) => newScore >= badge.threshold && !earnedBadges.includes(badge.name))
      .map((badge) => badge.name)

    if (newBadges.length > 0) {
      setEarnedBadges([...earnedBadges, ...newBadges])
    }

    setTimeout(() => {
      setShowFeedback(false)
      if (choice.nextScene === 8) {
        onComplete(newScore, [...earnedBadges, ...newBadges])
      } else {
        setCurrentScene(choice.nextScene)
      }
    }, 3000)
  }

  const getScoreLevel = () => {
    if (score >= 100) return { level: "Maestro Comunicador", color: "text-yellow-500", bg: "bg-yellow-100" }
    if (score >= 80) return { level: "Comunicador Experto", color: "text-green-500", bg: "bg-green-100" }
    if (score >= 60) return { level: "Buen Comunicador", color: "text-blue-500", bg: "bg-blue-100" }
    if (score >= 40) return { level: "Aprendiz", color: "text-purple-500", bg: "bg-purple-100" }
    return { level: "Principiante", color: "text-gray-500", bg: "bg-gray-100" }
  }

  if (!scene) return null

  if (showFeedback && lastChoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full animate-bounce-in">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-4">¡Excelente elección!</h3>
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-primary mb-2">+{lastChoice.points} puntos</p>
              <Badge className="mb-3">{lastChoice.principle}</Badge>
              <p className="text-muted-foreground">{lastChoice.feedback}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">Puntuación total: {score}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onExit} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-bold text-lg">{score}</span>
                </div>
                <div className="flex gap-1">
                  {earnedBadges.map((badge, index) => {
                    const badgeInfo = badges.find((b) => b.name === badge)
                    if (!badgeInfo) return null
                    const IconComponent = badgeInfo.icon
                    return (
                      <Badge key={index} variant="secondary" className="animate-pulse-glow">
                        <IconComponent className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
            <Progress value={(currentScene / 8) * 100} className="bg-white/20" />
            <p className="text-sm text-white/80">Escena {currentScene} de 8</p>
          </CardHeader>
        </Card>

        {/* Scene Content */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="text-xl text-balance">{scene.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4 animate-bounce-in">{scene.capibaraExpression}</div>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-4">{scene.description}</p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-primary">{scene.situation}</p>
              </div>
            </div>

            {/* Choices */}
            {scene.choices.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">¿Cómo respondes?</h3>
                {scene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => makeChoice(index)}
                    variant="outline"
                    className="w-full p-6 h-auto text-left justify-start hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-full p-3 mt-1 flex-shrink-0">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-pretty leading-relaxed text-base">{choice.text}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            +{choice.points} pts
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {choice.principle}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Final Results */}
            {currentScene === 8 && (
              <div className="text-center space-y-6 animate-bounce-in">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-4">¡Nivel Completado!</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg ${getScoreLevel().bg} mb-4`}>
                    <p className={`text-xl font-semibold ${getScoreLevel().color}`}>{getScoreLevel().level}</p>
                  </div>
                  <p className="text-muted-foreground text-lg">Puntuación final: {score} puntos</p>

                  {earnedBadges.length > 0 && (
                    <div className="mt-6">
                      <p className="font-semibold mb-3 text-lg">Insignias obtenidas:</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {earnedBadges.map((badge, index) => {
                          const badgeInfo = badges.find((b) => b.name === badge)
                          if (!badgeInfo) return null
                          const IconComponent = badgeInfo.icon
                          return (
                            <div
                              key={index}
                              className="bg-primary text-primary-foreground rounded-lg p-3 animate-pulse-glow"
                            >
                              <IconComponent className="w-6 h-6 mx-auto mb-1" />
                              <p className="text-sm font-semibold">{badge}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => onComplete(score, earnedBadges)}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                >
                  Continuar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Tips */}
        <Card className="bg-muted/30 border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🧠 Principios de Comunicación Efectiva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Reciprocidad</div>
                <div className="text-muted-foreground">Da valor antes de pedirlo</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Simpatía</div>
                <div className="text-muted-foreground">Conecta emocionalmente</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Autoridad</div>
                <div className="text-muted-foreground">Comparte experiencia relevante</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Compromiso</div>
                <div className="text-muted-foreground">Mantén coherencia en acciones</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Vulnerabilidad</div>
                <div className="text-muted-foreground">Sé auténtico y humano</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold text-primary mb-1">Escucha Activa</div>
                <div className="text-muted-foreground">Presta atención genuina</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
