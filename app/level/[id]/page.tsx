"use client"
import { useRouter } from "next/navigation"
import RoleplayLevel from "@/components/RoleplayLevel"
import QuizLevel from "@/components/QuizLevel"

interface LevelPageProps {
  params: {
    id: string
  }
}

export default function LevelPage({ params }: LevelPageProps) {
  const router = useRouter()
  const levelId = Number.parseInt(params.id)

  // Determinar el tipo de nivel basado en el ID
  const getLevelType = (id: number) => {
    if (id === 1) return "roleplay"
    if (id === 2) return "quiz"
    if (id === 3) return "video"
    if (id === 4) return "story"
    if (id === 5) return "interactive"
    return "roleplay"
  }

  const levelType = getLevelType(levelId)

  const handleComplete = (score: number, badges: string[]) => {
    // Aquí guardarías el progreso en localStorage o base de datos
    console.log(`Level ${levelId} completed with score: ${score}, badges: ${badges}`)
    router.push("/")
  }

  const handleExit = () => {
    router.push("/")
  }

  if (levelType === "roleplay") {
    return <RoleplayLevel levelId={levelId} onComplete={handleComplete} onExit={handleExit} />
  }

  if (levelType === "quiz") {
    return <QuizLevel levelId={levelId} onComplete={handleComplete} onExit={handleExit} />
  }

  // Placeholder para otros tipos de niveles
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Nivel {levelId}</h1>
        <p className="text-muted-foreground mb-4">Tipo: {levelType}</p>
        <p className="text-sm text-muted-foreground">Este tipo de nivel estará disponible pronto</p>
      </div>
    </div>
  )
}
