"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Heart,
  Award,
  Coins,
  Gem,
  ShoppingBag,
  Map,
  User,
  Play,
  Lock,
  CheckCircle,
  Sparkles,
  Volume2,
  Eye,
  MessageCircle,
  Users,
  Presentation,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface UserData {
  level: number
  xp: number
  coins: number
  gems: number
  lives: number
  maxLives: number
  lastDailyChest: string | null
  completedLevels: number[]
  badges: string[]
  currentPet: string
  unlockedPets: string[]
}

interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  totalLevels: number
  unlockedLevels: number
  completedLevels: number
}

interface Level {
  id: number
  title: string
  type: "roleplay" | "quiz" | "story" | "video" | "interactive"
  duration: number
  xpReward: number
  coinReward: number
  isCompleted: boolean
  isUnlocked: boolean
}

const initialUserData: UserData = {
  level: 1,
  xp: 0,
  coins: 100,
  gems: 5,
  lives: 5,
  maxLives: 5,
  lastDailyChest: null,
  completedLevels: [],
  badges: [],
  currentPet: "baby-capybara",
  unlockedPets: ["baby-capybara"],
}

const courses: Course[] = [
  {
    id: "communication-v1",
    title: "Comunicación Efectiva",
    description: "Domina el arte de comunicarte con confianza y empatía",
    icon: "💬",
    color: "from-amber-400 to-orange-500",
    totalLevels: 12,
    unlockedLevels: 3,
    completedLevels: 0,
  },
  {
    id: "communication-v2",
    title: "Comunicación Efectiva v2",
    description: "Versión avanzada con nuevos escenarios y desafíos",
    icon: "🗣️",
    color: "from-orange-500 to-red-500",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-v3",
    title: "Comunicación Efectiva v3",
    description: "Edición especial con casos de estudio empresariales",
    icon: "📢",
    color: "from-yellow-400 to-amber-500",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-v4",
    title: "Comunicación v4",
    description: "Técnicas avanzadas de persuasión y liderazgo",
    icon: "🎯",
    color: "from-amber-500 to-yellow-600",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-premium",
    title: "Comunicación Premium",
    description: "Masterclass exclusiva con casos reales de éxito",
    icon: "👑",
    color: "from-yellow-600 to-orange-700",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
]

const communicationLevels: Level[] = [
  {
    id: 1,
    title: "Primeros Encuentros",
    type: "roleplay",
    duration: 8,
    xpReward: 50,
    coinReward: 20,
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 2,
    title: "Escucha Activa",
    type: "interactive",
    duration: 6,
    xpReward: 40,
    coinReward: 15,
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 3,
    title: "Lenguaje Corporal",
    type: "video",
    duration: 10,
    xpReward: 60,
    coinReward: 25,
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 4,
    title: "Manejo de Conflictos",
    type: "story",
    duration: 12,
    xpReward: 80,
    coinReward: 30,
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 5,
    title: "Presentaciones Efectivas",
    type: "quiz",
    duration: 15,
    xpReward: 100,
    coinReward: 40,
    isCompleted: false,
    isUnlocked: false,
  },
]

const pets = [
  { id: "baby-capybara", name: "Capi Bebé", icon: "🐹", price: 0, unlocked: true },
  { id: "adult-capybara", name: "Capi Adulto", icon: "🦫", price: 200, unlocked: false },
  { id: "golden-capybara", name: "Capi Dorado", icon: "✨🦫", price: 1000, unlocked: false },
  { id: "ninja-capybara", name: "Capi Ninja", icon: "🥷🦫", price: 1500, unlocked: false },
]

const petData = {
  "baby-capybara": { name: "Capi Bebé", icon: "🐹" },
  "adult-capybara": { name: "Capi Adulto", icon: "🦫" },
  "golden-capybara": { name: "Capi Dorado", icon: "✨🦫" },
  "ninja-capybara": { name: "Capi Ninja", icon: "🥷🦫" },
}

function LevelComponent({
  levelId,
  onComplete,
  onBack,
  userData,
  onLoseLife,
}: {
  levelId: number
  onComplete: (xp: number, coins: number) => void
  onBack: () => void
  userData: UserData
  onLoseLife: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]) // Track wrong answers to retry
  const [hintUsed, setHintUsed] = useState(false) // Track if hint was used
  const [isCorrect, setIsCorrect] = useState(false) // Track if answer was correct for feedback color

  // Level content data with complete content from the attachment
  const levelData = {
    1: {
      title: "Primeros Encuentros",
      type: "roleplay",
      duration: 8,
      xpReward: 50,
      coinReward: 20,
      background: "jungle-campfire-night-scene-animated.png",
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
        {
          situation: "Durante la conversación, ¿mantienes contacto visual?",
          options: [
            { text: "Sí, de manera natural y respetuosa", correct: true, points: 20 },
            { text: "No, me da pena mirar a los ojos", correct: false, points: 0 },
            { text: "Solo cuando hablo yo", correct: false, points: 5 },
          ],
          feedback: {
            correct: "Perfecto. El contacto visual muestra interés genuino y construye confianza.",
            incorrect: "El contacto visual natural (no fijo) demuestra respeto e interés por la otra persona.",
          },
        },
        {
          situation: "El interlocutor responde de manera tímida. ¿Qué haces?",
          options: [
            { text: "Le doy espacio y hablo más suave", correct: true, points: 20 },
            { text: "Trato de animarlo hablando más fuerte", correct: false, points: 0 },
            { text: "Cambio de tema inmediatamente", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Adaptar tu energía a la del otro muestra inteligencia emocional.",
            incorrect: "Cuando alguien es tímido, es mejor bajar la intensidad y darle espacio para abrirse.",
          },
        },
        {
          situation: "Una capibara te ofrece la mano para saludar. ¿Qué tipo de apretón usas?",
          options: [
            { text: "Firme pero no excesivo, con contacto visual", correct: true, points: 20 },
            { text: "Muy suave, casi sin fuerza", correct: false, points: 0 },
            { text: "Muy fuerte para mostrar seguridad", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Excelente. Un apretón firme pero respetuoso transmite confianza sin intimidar.",
            incorrect: "Un apretón de manos debe ser firme pero no excesivo, acompañado de contacto visual.",
          },
        },
        {
          situation: "Te presentan al grupo. ¿Cómo te presentas?",
          options: [
            { text: "Digo mi nombre y algo que me gusta hacer", correct: true, points: 20 },
            { text: "Solo digo mi nombre", correct: false, points: 5 },
            { text: "Hago una broma para romper el hielo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Compartir un interés personal ayuda a otros a conectar contigo.",
            incorrect: "Agregar algo personal (un interés o pasión) ayuda a crear conexiones más profundas.",
          },
        },
      ],
    },
    2: {
      title: "Escucha Activa",
      type: "interactive",
      duration: 6,
      xpReward: 40,
      coinReward: 15,
      background: "dense-jungle-sounds.png",
      story:
        "En el corazón de la selva, dos capibaras están compartiendo sus experiencias. Tu misión es desarrollar tu habilidad de escucha activa prestando atención a cada detalle.",
      hint: "La escucha activa no es solo oír palabras, es entender emociones y necesidades detrás del mensaje.",
      steps: [
        {
          situation: "Una capibara habla de su día difícil. ¿Qué técnica usarías para demostrar que escuchas?",
          options: [
            { text: "Repetir palabras clave y asentir", correct: true, points: 20 },
            { text: "Interrumpir para dar consejos", correct: false, points: 0 },
            { text: "Cambiar el tema a algo positivo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Parafrasear y usar lenguaje corporal muestra que realmente escuchas.",
            incorrect: "Escuchar activamente significa reflejar lo que oyes sin interrumpir o juzgar.",
          },
        },
        {
          situation: "Escuchas a una capibara contar una historia emotiva. ¿Qué frase muestra mejor escucha?",
          options: [
            { text: "'Entiendo cómo te sientes'", correct: true, points: 20 },
            { text: "'Lo mismo me pasó a mí'", correct: false, points: 0 },
            { text: "'No te preocupes, no es tan grave'", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Perfecto. Validar las emociones del otro es clave en la escucha activa.",
            incorrect: "Evita minimizar o hacer sobre ti. Enfócate en validar sus sentimientos.",
          },
        },
        {
          situation: "Una capibara te cuenta 3 cosas importantes. ¿En qué orden de importancia las escuchaste?",
          options: [
            { text: "Su preocupación por la familia, el trabajo, el clima", correct: true, points: 20 },
            { text: "El clima, el trabajo, la familia", correct: false, points: 0 },
            { text: "El trabajo, el clima, la familia", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Muy bien! Identificaste correctamente que la familia era su mayor preocupación.",
            incorrect: "Escuchar activamente incluye identificar qué es más importante para la otra persona.",
          },
        },
        {
          situation: "El interlocutor baja la voz mientras habla. ¿Qué haces?",
          options: [
            { text: "Me acerco ligeramente y mantengo atención", correct: true, points: 20 },
            { text: "Ignoro el cambio de volumen", correct: false, points: 0 },
            { text: "Le pido que hable más fuerte", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Excelente. Adaptarte físicamente muestra respeto e interés genuino.",
            incorrect: "Cuando alguien baja la voz, suele ser porque el tema es importante o personal.",
          },
        },
        {
          situation: "Una capibara te cuenta un problema personal. ¿Cuál es la mejor respuesta?",
          options: [
            { text: "'Debe ser difícil para ti. ¿Cómo te sientes?'", correct: true, points: 20 },
            { text: "'Deberías hacer esto...'", correct: false, points: 0 },
            { text: "'Al menos no es tan malo como...'", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Validar emociones y hacer preguntas abiertas profundiza la conexión.",
            incorrect: "Evita dar consejos inmediatos o comparar. Primero valida sus emociones.",
          },
        },
      ],
    },
    3: {
      title: "Lenguaje Corporal",
      type: "video",
      duration: 10,
      xpReward: 60,
      coinReward: 25,
      background: "natural-landscape-body-language.png",
      story:
        "En un claro del bosque, observas diferentes capibaras interactuando. Tu misión es interpretar y usar el lenguaje corporal efectivamente.",
      hint: "El cuerpo comunica más que las palabras. Observa posturas, gestos y expresiones para entender el mensaje completo.",
      steps: [
        {
          situation: "Observas una capibara con brazos cruzados durante una conversación. ¿Qué comunica?",
          options: [
            { text: "Posible resistencia o incomodidad", correct: true, points: 20 },
            { text: "Está relajada y cómoda", correct: false, points: 0 },
            { text: "Tiene frío solamente", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! Los brazos cruzados suelen indicar una barrera emocional o física.",
            incorrect: "Los brazos cruzados generalmente indican resistencia, defensa o incomodidad.",
          },
        },
        {
          situation: "Ves una sonrisa natural vs una forzada. ¿Cómo las diferencias?",
          options: [
            { text: "La natural involucra los ojos, la forzada solo la boca", correct: true, points: 20 },
            { text: "La natural es más grande", correct: false, points: 0 },
            { text: "No hay diferencia real", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Una sonrisa genuina activa los músculos alrededor de los ojos.",
            incorrect: "Las sonrisas genuinas involucran toda la cara, especialmente los ojos (sonrisa Duchenne).",
          },
        },
        {
          situation: "¿Qué postura corporal muestra más seguridad y apertura?",
          options: [
            { text: "Espalda recta, hombros relajados, brazos abiertos", correct: true, points: 20 },
            { text: "Encorvado con manos en los bolsillos", correct: false, points: 0 },
            { text: "Rígido con brazos a los lados", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Perfecto! Esta postura transmite confianza sin intimidar.",
            incorrect: "Una postura abierta y relajada transmite confianza y accesibilidad.",
          },
        },
        {
          situation: "Durante una presentación, ¿qué hacer con las manos?",
          options: [
            { text: "Usarlas para acompañar y enfatizar el mensaje", correct: true, points: 20 },
            { text: "Mantenerlas ocultas o quietas", correct: false, points: 0 },
            { text: "Cruzarlas para verse profesional", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Los gestos naturales con las manos refuerzan tu mensaje.",
            incorrect: "Las manos son herramientas poderosas para comunicar. Úsalas de manera natural.",
          },
        },
        {
          situation: "¿Cuántos segundos es ideal mantener contacto visual en una conversación?",
          options: [
            { text: "3-5 segundos, luego desviar naturalmente", correct: true, points: 20 },
            { text: "Todo el tiempo sin parar", correct: false, points: 0 },
            { text: "Solo cuando hablas tú", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! El contacto visual natural evita intimidar pero mantiene conexión.",
            incorrect: "El contacto visual debe ser natural: 3-5 segundos, luego desviar brevemente.",
          },
        },
      ],
    },
    4: {
      title: "Manejo de Conflictos",
      type: "story",
      duration: 12,
      xpReward: 80,
      coinReward: 30,
      background: "conflict-resolution-scene.png",
      story:
        "Dos capibaras están en desacuerdo sobre qué ruta tomar para llegar al río. La tensión está aumentando y necesitas mediar para resolver el conflicto.",
      hint: "En conflictos, busca primero entender antes de ser entendido. La empatía desarma la tensión.",
      steps: [
        {
          situation: "Dos capibaras discuten por un recurso limitado. ¿Qué haces primero?",
          options: [
            { text: "Escucho a ambas partes por separado", correct: true, points: 20 },
            { text: "Tomo una decisión rápida", correct: false, points: 0 },
            { text: "Les digo que se calmen", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Excelente! Entender todas las perspectivas es el primer paso para resolver conflictos.",
            incorrect: "Antes de resolver, necesitas entender completamente el problema desde todas las perspectivas.",
          },
        },
        {
          situation: "Una parte está muy alterada emocionalmente. ¿Qué tono de voz usarías?",
          options: [
            { text: "Calmado y pausado, más bajo que el suyo", correct: true, points: 20 },
            { text: "Firme y autoritario", correct: false, points: 0 },
            { text: "Al mismo nivel de intensidad", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Un tono calmado ayuda a reducir la tensión emocional.",
            incorrect: "Bajar el tono y hablar pausadamente ayuda a calmar la situación.",
          },
        },
        {
          situation: "La tensión sube entre las partes. ¿Qué haces?",
          options: [
            { text: "Hago una pausa y respiro profundo", correct: true, points: 20 },
            { text: "Acelero para resolver rápido", correct: false, points: 0 },
            { text: "Dejo que se desahoguen", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Muy bien! Las pausas estratégicas permiten que las emociones se calmen.",
            incorrect: "Cuando la tensión sube, una pausa estratégica puede cambiar toda la dinámica.",
          },
        },
        {
          situation: "Buscas una solución. ¿En qué te enfocas?",
          options: [
            { text: "En puntos en común e intereses compartidos", correct: true, points: 20 },
            { text: "En quién tiene la razón", correct: false, points: 0 },
            { text: "En las diferencias para resolverlas", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Excelente! Los puntos en común son la base para construir soluciones.",
            incorrect: "Enfócate en lo que une, no en lo que divide. Los intereses comunes son clave.",
          },
        },
        {
          situation: "Una parte no quiere hablar más. ¿Qué haces?",
          options: [
            { text: "Respeto su espacio y propongo retomar después", correct: true, points: 20 },
            { text: "Insisto en que debe participar", correct: false, points: 0 },
            { text: "Resuelvo sin su opinión", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Respetar los límites mantiene la confianza y abre futuras oportunidades.",
            incorrect: "Forzar la participación puede empeorar el conflicto. Respeta los límites.",
          },
        },
      ],
    },
    5: {
      title: "Presentaciones Efectivas",
      type: "quiz",
      duration: 15,
      xpReward: 100,
      coinReward: 40,
      background: "presentation-stage-natural.png",
      story:
        "Es tu turno de presentar un proyecto importante al consejo de capibaras ancianas. Debes demostrar todas tus habilidades de comunicación para ser claro, convincente y memorable.",
      hint: "Una gran presentación cuenta una historia clara: problema, solución, beneficios. Conecta emocionalmente con tu audiencia.",
      steps: [
        {
          situation: "¿Cuál es la mejor manera de iniciar tu presentación?",
          options: [
            { text: "Con una historia breve relacionada al tema", correct: true, points: 20 },
            { text: "Con estadísticas y datos duros", correct: false, points: 5 },
            { text: "Disculpándome por posibles errores", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Las historias capturan atención y crean conexión emocional inmediata.",
            incorrect: "Las historias conectan emocionalmente desde el inicio y hacen tu mensaje memorable.",
          },
        },
        {
          situation: "¿Cuánto tiempo máximo deberías usar para la introducción?",
          options: [
            { text: "1-2 minutos máximo", correct: true, points: 20 },
            { text: "5 minutos para dar contexto completo", correct: false, points: 0 },
            { text: "30 segundos, directo al grano", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! Una introducción concisa mantiene la atención y genera expectativa.",
            incorrect: "La introducción debe ser breve pero suficiente para enganchar y contextualizar.",
          },
        },
        {
          situation: "Notas que el público se distrae. ¿Qué haces?",
          options: [
            { text: "Hago una pregunta directa o cambio el ritmo", correct: true, points: 20 },
            { text: "Continúo como si nada pasara", correct: false, points: 0 },
            { text: "Hablo más fuerte para captar atención", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Involucrar activamente al público recupera su atención.",
            incorrect: "Cuando pierdes atención, involucra al público con preguntas o cambios de ritmo.",
          },
        },
        {
          situation: "Olvidas parte de tu discurso. ¿Qué haces?",
          options: [
            { text: "Respiro, hago una pausa y retomo naturalmente", correct: true, points: 20 },
            { text: "Me disculpo y admito que olvidé", correct: false, points: 0 },
            { text: "Improviso algo completamente diferente", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Perfecto! La confianza y naturalidad mantienen la credibilidad.",
            incorrect: "Las pausas naturales y retomar con confianza mantienen tu credibilidad intacta.",
          },
        },
        {
          situation: "Para el cierre de tu presentación, ¿qué es más efectivo?",
          options: [
            { text: "Resumir puntos clave y hacer un llamado a la acción", correct: true, points: 20 },
            { text: "Agradecer y terminar abruptamente", correct: false, points: 5 },
            { text: "Presumir sobre tu trabajo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Un cierre fuerte refuerza tu mensaje y motiva a la acción.",
            incorrect: "El cierre debe reforzar tu mensaje principal y motivar a la audiencia a actuar.",
          },
        },
      ],
    },
  }

  const currentLevelData = levelData[levelId as keyof typeof levelData]
  const currentStepData = currentLevelData?.steps[currentStep]
  const currentPet = pets.find((p) => p.id === userData.currentPet)

  if (!currentLevelData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Nivel en construcción</h2>
        <p className="text-muted-foreground mb-4">Este nivel estará disponible pronto.</p>
        <Button onClick={onBack}>Volver al curso</Button>
      </div>
    )
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const option = currentStepData.options[optionIndex]

    if (option.correct) {
      setScore(score + option.points)
      setIsCorrect(true) // Track correct answer for green feedback
    } else {
      setIsCorrect(false) // Track incorrect answer for red feedback
      setWrongAnswers([...wrongAnswers, currentStep]) // Add to retry list
      onLoseLife() // Lose a life for wrong answer
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentStep < currentLevelData.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setHintUsed(false) // Reset hint for next question
    } else {
      // Check if need to retry wrong answers
      if (wrongAnswers.length > 0) {
        // Go to first wrong answer to retry
        setCurrentStep(wrongAnswers[0])
        setWrongAnswers(wrongAnswers.slice(1))
        setSelectedOption(null)
        setShowFeedback(false)
        setHintUsed(false)
      } else {
        // Level completed
        onComplete(currentLevelData.xpReward, currentLevelData.coinReward)
      }
    }
  }

  const showHint = () => {
    if (!hintUsed) {
      setHintUsed(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Level header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="border-amber-300 text-amber-700 bg-transparent">
          ← Volver al curso
        </Button>
        <h1 className="text-2xl font-bold text-amber-800">{currentLevelData.title}</h1>
        <div className="text-3xl animate-bounce">{currentPet?.icon}</div>
        <div className="flex items-center gap-2 ml-auto">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-600">
            {userData.lives}/{userData.maxLives}
          </span>
        </div>
      </div>

      {/* Level content */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/${currentLevelData.background}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <CardContent className="p-8 relative z-10">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-amber-700 mb-2">
              <span>Progreso</span>
              <span>
                {currentStep + 1} de {currentLevelData.steps.length}
                {wrongAnswers.length > 0 && ` (${wrongAnswers.length} por repetir)`}
              </span>
            </div>
            <Progress value={((currentStep + 1) / currentLevelData.steps.length) * 100} />
          </div>

          {/* Story intro (only on first step) */}
          {currentStep === 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800">{currentLevelData.story}</p>
            </div>
          )}

          {/* Pet hint section - separate from feedback */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentPet?.icon}</div>
              <div>
                <p className="text-sm text-amber-600 font-medium">{currentPet?.name} está aquí para ayudarte</p>
                {!hintUsed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showHint}
                    className="mt-1 border-amber-300 hover:bg-amber-50 text-white bg-amber-700"
                  >
                    💡 Pedir pista (1 por nivel)
                  </Button>
                )}
              </div>
            </div>
            {hintUsed && (
              <div className="max-w-md p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-lg">{currentPet?.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Pista de {currentPet?.name}:</p>
                    <p className="text-sm text-blue-700">{currentLevelData.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current situation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-800">Situación:</h3>
            <p className="text-amber-700 bg-white/80 p-4 rounded-lg">{currentStepData.situation}</p>
          </div>

          {/* Options */}
          {!showFeedback && (
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-800">¿Qué harías?</h4>
              {currentStepData.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto border-amber-200 hover:bg-amber-50 text-white bg-amber-700"
                  onClick={() => handleOptionSelect(index)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}

          {showFeedback && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-2xl ${isCorrect ? "animate-bounce" : ""}`}>{isCorrect ? "✅" : "❌"}</div>
                  <span className={`font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                    {isCorrect ? "¡Correcto!" : "Incorrecto"}
                  </span>
                  {!isCorrect && <span className="text-red-600 text-sm">(-1 vida)</span>}
                </div>
                <p className={isCorrect ? "text-green-800" : "text-red-800"}>
                  {isCorrect ? currentStepData.feedback.correct : currentStepData.feedback.incorrect}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-amber-600">
                  Puntos ganados: +{currentStepData.options[selectedOption!].points}
                </div>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  {currentStep < currentLevelData.steps.length - 1 || wrongAnswers.length > 0
                    ? "Continuar"
                    : "Completar Nivel"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const DeckCarousel = ({
  courses,
  onCourseSelect,
}: { courses: Course[]; onCourseSelect: (courseId: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length)
  }

  const getCardPosition = (index: number) => {
    const position = (index - currentIndex + courses.length) % courses.length
    if (position === 0) return "center"
    if (position === 1 || position === courses.length - 1) return "side"
    return "hidden"
  }

  return (
    <div className="relative h-[550px] flex items-center justify-center px-8">
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        {courses.map((course, index) => {
          const position = getCardPosition(index)
          const isActive = position === "center"
          const isLeft = index < currentIndex || (currentIndex === 0 && index === courses.length - 1)

          if (position === "hidden") return null

          return (
            <div
              key={course.id}
              className={`absolute transition-all duration-700 ease-out transform ${
                position === "center"
                  ? "z-20 scale-110 opacity-100 translate-x-0"
                  : position === "side"
                    ? isLeft
                      ? "z-10 scale-85 opacity-50 -translate-x-80"
                      : "z-10 scale-85 opacity-50 translate-x-80"
                    : "opacity-0"
              }`}
              style={{
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div
                className={`w-80 h-[450px] rounded-3xl p-8 shadow-2xl border-2 transition-all duration-700 bg-gradient-to-br ${course.color} ${
                  isActive
                    ? "cursor-pointer hover:scale-105 hover:shadow-3xl border-white/40 hover:border-white/60"
                    : "cursor-default border-white/20"
                }`}
                onClick={isActive ? () => onCourseSelect(course.id) : undefined}
                tabIndex={isActive ? 0 : -1}
                role="button"
                data-active={isActive}
                onKeyDown={(e) => {
                  if (isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onCourseSelect(course.id)
                  }
                }}
              >
                <div className="h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-6xl mb-6 text-center drop-shadow-lg">{course.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-center drop-shadow-md">{course.title}</h3>
                    <p className="text-white/90 mb-6 text-center leading-relaxed drop-shadow-sm">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-white/90">
                      <span className="font-medium">Progreso</span>
                      <span className="font-bold">
                        {course.completedLevels} / {course.totalLevels}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                      <div
                        className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(course.completedLevels / course.totalLevels) * 100}%` }}
                      />
                    </div>

                    {isActive && (
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm font-bold py-3 rounded-xl transition-all duration-300">
                        {course.completedLevels > 0 ? "Continuar Aventura" : "Comenzar Aventura"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handlePrev}
        className="absolute left-4 z-30 w-16 h-16 rounded-full border-2 border-white/40 text-white hover:bg-white/20 bg-black/20 backdrop-blur-md hover:border-white/60 transition-all duration-300"
        aria-label="Curso anterior"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleNext}
        className="absolute right-4 z-30 w-16 h-16 rounded-full border-2 border-white/40 text-white hover:bg-white/20 bg-black/20 backdrop-blur-md hover:border-white/60 transition-all duration-300"
        aria-label="Siguiente curso"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir al curso ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Nu9veAcademy() {
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [currentView, setCurrentView] = useState<"welcome" | "dashboard" | "course" | "level" | "shop" | "profile">(
    "welcome",
  )
  const [showDailyChest, setShowDailyChest] = useState(true)
  const [chestAnimation, setChestAnimation] = useState(false)
  const [lifeTimer, setLifeTimer] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)

  // const [selectedCourse, setSelectedCourse] = useState<string>("communication-v1")

  useEffect(() => {   
    const interval = setInterval(() => {
      setUserData((prev) => {
        if (prev.lives < prev.maxLives) {
          const newTimer = lifeTimer + 1
          if (newTimer >= 15) {
            setLifeTimer(0)
            return { ...prev, lives: prev.lives + 1 }
          } else {
            setLifeTimer(newTimer)
            return prev
          }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [lifeTimer])

  // Check for daily chest availability
  useEffect(() => {
    const today = new Date().toDateString()
    if (userData.lastDailyChest !== today) {
      setShowDailyChest(true)
    }
  }, [userData.lastDailyChest])

  const openDailyChest = () => {
    setChestAnimation(true)
    const rewards = {
      coins: Math.floor(Math.random() * 50) + 25,
      gems: Math.floor(Math.random() * 3) + 1,
      xp: Math.floor(Math.random() * 30) + 20,
    }

    setTimeout(() => {
      setUserData((prev) => ({
        ...prev,
        coins: prev.coins + rewards.coins,
        gems: prev.gems + rewards.gems,
        xp: prev.xp + rewards.xp,
        lastDailyChest: new Date().toDateString(),
      }))
      setShowDailyChest(false)
      setChestAnimation(false)
    }, 2000)
  }

  const buyLife = () => {
    if (userData.lives < userData.maxLives && userData.coins >= 15) {
      setUserData((prev) => ({
        ...prev,
        lives: prev.lives + 1,
        coins: prev.coins - 15,
      }))
    }
  }

  const startLevel = (levelId: number) => {
    setCurrentLevel(levelId)
    setCurrentView("level")
  }

  // const buyPet = (petId: string, price: number) => {
  //   if (userData.coins >= price) {
  //     setUserData((prev) => ({
  //       ...prev,
  //       coins: prev.coins - price,
  //       unlockedPets: [...prev.unlockedPets, petId],
  //     }))
  //   }
  // }

  // const selectPet = (petId: string) => {
  //   setUserData((prev) => ({
  //     ...prev,
  //     currentPet: petId,
  //   }))
  // }

  const loseLife = () => {
    setUserData((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }))
  }

  const completeLevel = (levelId: number, xp: number, coins: number) => {
    setUserData((prev) => {
      const newCompletedLevels = [...prev.completedLevels]
      if (!newCompletedLevels.includes(levelId)) {
        newCompletedLevels.push(levelId)
      }

      return {
        ...prev,
        xp: prev.xp + xp,
        coins: prev.coins + coins,
        completedLevels: newCompletedLevels,
      }
    })

    const nextLevelIndex = communicationLevels.findIndex((level) => level.id === levelId + 1)
    if (nextLevelIndex !== -1) {
      communicationLevels[nextLevelIndex].isUnlocked = true
    }

    setCurrentView("course")
  }

  const renderWelcome = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background jungle scene */}
      <div className="absolute inset-0 bg-[url('/jungle-campfire-night-scene-animated.png')] opacity-30 bg-cover bg-center"></div>

      <Card className="max-w-md w-full mx-4 relative z-10 border-2 border-amber-300 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Animated capybara */}
          <div className="text-8xl mb-6 animate-bounce">🦫</div>

          {/* Welcome message */}
          <h1 className="text-3xl font-bold text-amber-800 mb-4">¡Hola, Explorador! 🌅</h1>
          <div className="text-amber-700 mb-6 space-y-2">
            <p className="text-lg">
              Bienvenido a tu viaje en la <strong>Comunicación Efectiva</strong>.
            </p>
            <p>Aquí aprenderás a expresarte con confianza, empatía y claridad.</p>
            <p className="text-sm text-amber-600">
              ¡Tu mascota estará contigo en cada paso, lista para ayudarte cuando lo necesites!
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex justify-between text-sm text-amber-700 mb-2">
              <span>Progreso del Curso</span>
              <span>0 de 8 niveles completados</span>
            </div>
            <Progress value={0} className="bg-amber-200" />
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 text-lg shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Comenzar Aventura
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                onClick={() => {
                  // Future: implement login
                  setCurrentView("dashboard")
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                onClick={() => setCurrentView("dashboard")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Continuar como Invitado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDashboard = () => (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/jungle-adventure-background.jpg')`,
          filter: "brightness(0.7)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-yellow-900/20"></div>

      <div className="relative z-10 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">
                {petData[userData.currentPet as keyof typeof petData]?.icon || "🐹"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800 mb-1">¡Hola, Explorador!</h1>
                <p className="text-amber-600">Continúa tu aventura de aprendizaje</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-800">{userData.coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-cyan-500" />
                <span className="font-semibold text-cyan-800">{userData.gems}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-800">
                  {userData.lives}/{userData.maxLives}
                </span>
                {userData.lives < userData.maxLives && (
                  <div className="text-xs text-red-600 ml-1">+1 en {15 - lifeTimer}s</div>
                )}
              </div>
              {userData.lives < userData.maxLives && userData.coins >= 15 && (
                <Button onClick={buyLife} size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
                  +1 ❤️ (15🪙)
                </Button>
              )}
            </div>
          </div>

          <div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-800">Progreso General</h2>
              <div className="text-sm text-amber-600">{userData.completedLevels.length} niveles completados</div>
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (userData.completedLevels.length / courses.reduce((acc, course) => acc + course.totalLevels, 0)) * 100
                }
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Cofre diario */}
        {showDailyChest && (
          <Card className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/treasure-chest-jungle-background.png')] opacity-10"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className={`text-6xl mb-4 ${chestAnimation ? "animate-bounce" : "animate-pulse"}`}>🎁</div>
              <h3 className="text-xl font-bold mb-2 text-amber-800">¡Cofre Diario Disponible!</h3>
              <p className="text-amber-600 mb-4">Tu capibara ha encontrado un tesoro especial</p>
              <Button
                onClick={openDailyChest}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                disabled={chestAnimation}
              >
                {chestAnimation ? "Abriendo..." : "Abrir Cofre"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-3xl font-bold mb-8 text-white text-center drop-shadow-lg">Selecciona tu Curso</h2>
          <DeckCarousel
            courses={courses.map((course) => ({
              ...course,
              completedLevels: userData.completedLevels.filter((level) => {
                if (course.id === "communication-v1") return level >= 1 && level <= 12
                if (course.id === "communication-v2") return level >= 13 && level <= 24
                if (course.id === "communication-v3") return level >= 25 && level <= 36
                if (course.id === "communication-v4") return level >= 37 && level <= 48
                if (course.id === "communication-premium") return level >= 49 && level <= 60
                return false
              }).length,
            }))}
            onCourseSelect={(courseId) => {
              // setSelectedCourse(courseId)
              setCurrentView("course")
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderShop = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView("dashboard")}
            className="border-amber-300 text-amber-700"
          >
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-amber-800">🛍️ Tienda de Mascotas</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="border-2 border-amber-200 hover:border-amber-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">{pet.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-amber-800">{pet.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-amber-700">{pet.price === 0 ? "Gratis" : pet.price}</span>
                </div>
                {userData.unlockedPets.includes(pet.id) ? (
                  <div className="space-y-2">
                    {userData.currentPet === pet.id ? (
                      <Button disabled className="w-full bg-green-100 text-green-800">
                        ✓ Equipada
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setUserData((prev) => ({ ...prev, currentPet: pet.id }))}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Equipar
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      if (userData.coins >= pet.price) {
                        setUserData((prev) => ({
                          ...prev,
                          coins: prev.coins - pet.price,
                          unlockedPets: [...prev.unlockedPets, pet.id],
                          currentPet: pet.id,
                        }))
                      }
                    }}
                    disabled={userData.coins < pet.price}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300"
                  >
                    {userData.coins >= pet.price ? "Comprar" : "Sin monedas"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-8xl">{pets.find((p) => p.id === userData.currentPet)?.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">Explorador Nu9ve</h2>
              <p className="text-muted-foreground">Nivel {userData.level}</p>
              <Progress value={userData.xp % 100} className="w-48 mt-2" />
              <p className="text-sm text-muted-foreground mt-1">{userData.xp % 100}/100 XP para el siguiente nivel</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-bold text-lg">{userData.completedLevels.length}</p>
              <p className="text-sm text-muted-foreground">Niveles Completados</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-bold text-lg">{userData.badges.length}</p>
              <p className="text-sm text-muted-foreground">Insignias Obtenidas</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="font-bold text-lg">{userData.unlockedPets.length}</p>
              <p className="text-sm text-muted-foreground">Mascotas Desbloqueadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCourse = () => {
    const getLevelIcon = (type: string) => {
      switch (type) {
        case "roleplay":
          return <MessageCircle className="w-6 h-6 text-blue-500" />
        case "interactive":
          return <Volume2 className="w-6 h-6 text-green-500" />
        case "video":
          return <Eye className="w-6 h-6 text-purple-500" />
        case "story":
          return <Users className="w-6 h-6 text-orange-500" />
        case "quiz":
          return <Presentation className="w-6 h-6 text-red-500" />
        default:
          return <Play className="w-6 h-6" />
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView("dashboard")}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-amber-800">Comunicación Efectiva</h1>
          <div className="text-3xl animate-bounce">🦫</div>
        </div>

        <div className="relative">
          <div className="grid gap-6">
            {communicationLevels.map((level, index) => {
              const isUnlocked = index === 0 || userData.completedLevels.includes(index)
              const isCompleted = userData.completedLevels.includes(level.id)

              return (
                <Card
                  key={level.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isUnlocked ? "cursor-pointer hover:shadow-xl hover:scale-[1.02]" : "opacity-50"
                  } ${isCompleted ? "border-green-500 bg-green-50 shadow-green-200 shadow-lg" : "border-amber-200"}`}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url('/--getlevelbackground-level-id--.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {isCompleted ? (
                            <div className="relative">
                              <CheckCircle className="w-12 h-12 text-green-500" />
                              <div className="absolute -top-1 -right-1 text-xl">✨</div>
                            </div>
                          ) : isUnlocked ? (
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {level.id}
                            </div>
                          ) : (
                            <Lock className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getLevelIcon(level.type)}
                            <h3 className="text-lg font-bold text-amber-800">{level.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-amber-600">
                            <span>⏱️ {level.duration} min</span>
                            <span>⭐ {level.xpReward} XP</span>
                            <span>🪙 {level.coinReward} monedas</span>
                            <Badge variant="outline" className="border-amber-300 text-amber-700">
                              {level.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-amber-600 mt-2">
                            {level.id === 1 && "Aprende a hacer una primera impresión positiva"}
                            {level.id === 2 && "Técnicas para escuchar activamente"}
                            {level.id === 3 && "Domina el lenguaje corporal efectivo"}
                            {level.id === 4 && "Resuelve conflictos con confianza"}
                            {level.id === 5 && "Presenta ideas de manera impactante"}
                          </p>
                        </div>
                      </div>
                      {isUnlocked && (
                        <Button
                          onClick={() => startLevel(level.id)}
                          disabled={!isUnlocked}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                        >
                          {isCompleted ? "Repetir" : "Jugar"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentView === "welcome" && renderWelcome()}
      {currentView !== "welcome" && (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <nav className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-pulse">🦫</div>
                  <h1 className="text-xl font-bold text-amber-800">Nu9ve Academy</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={currentView === "dashboard" ? "default" : "ghost"}
                    onClick={() => setCurrentView("dashboard")}
                    size="sm"
                    className={
                      currentView === "dashboard"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "text-amber-700 hover:bg-amber-50"
                    }
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === "shop" ? "default" : "ghost"}
                    onClick={() => setCurrentView("shop")}
                    size="sm"
                    className={
                      currentView === "shop" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-700 hover:bg-amber-50"
                    }
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Tienda
                  </Button>
                  <Button
                    variant={currentView === "profile" ? "default" : "ghost"}
                    onClick={() => setCurrentView("profile")}
                    size="sm"
                    className={
                      currentView === "profile" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-700 hover:bg-amber-50"
                    }
                  >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-4 py-8">
            {currentView === "dashboard" && renderDashboard()}
            {currentView === "course" && renderCourse()}
            {currentView === "shop" && renderShop()}
            {currentView === "profile" && renderProfile()}
            {currentView === "level" && currentLevel && (
              <LevelComponent
                levelId={currentLevel}
                onComplete={(xp, coins) => completeLevel(currentLevel, xp, coins)}
                onBack={() => setCurrentView("course")}
                userData={userData}
                onLoseLife={loseLife}
              />
            )}
          </main>
        </div>
      )}
    </>
  )
}
