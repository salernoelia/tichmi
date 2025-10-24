<script
    setup
    lang="ts"
>
import { onMounted, ref, computed } from 'vue'
import PWABadge from './components/PWABadge.vue'
import Sidebar from './components/Sidebar.vue'
import CreateQuiz from './components/CreateQuiz.vue'
import QuizInterface from './components/QuizInterface.vue'
import ScoreDisplay from './components/ScoreDisplay.vue'
import { Button } from './components/ui/button'
import { usePGLite } from './composables/usePGLite'
import type { Quiz, QuizResult } from './types/quiz'

const pglite = usePGLite()

const quizzes = ref<Quiz[]>([])
const selectedQuizId = ref<number | null>(null)
const view = ref<'create' | 'quiz' | 'results'>('create')
const lastScore = ref<{ score: number; totalQuestions: number } | null>(null)
const quizResults = ref<QuizResult[]>([])

const selectedQuiz = computed(() =>
    quizzes.value.find(q => q.id === selectedQuizId.value) || null
)

async function loadQuizzes() {
    const data = await pglite.getAllQuizzes()
    quizzes.value = data.map(q => ({
        ...q,
        cards: q.cards as any,
        createdAt: q.createdAt ? new Date(q.createdAt) : undefined,
        updatedAt: q.updatedAt ? new Date(q.updatedAt) : undefined,
    }))
}

async function handleQuizCreated(quiz: Quiz) {
    const created = await pglite.createQuiz(quiz.title, quiz.topic, quiz.cards)
    await loadQuizzes()
    selectedQuizId.value = created.id
    view.value = 'quiz'
}

function handleNewQuiz() {
    selectedQuizId.value = null
    view.value = 'create'
    lastScore.value = null
}

async function handleSelectQuiz(id: number) {
    selectedQuizId.value = id
    view.value = 'quiz'
    lastScore.value = null

    const results = await pglite.getQuizResults(id)
    quizResults.value = results.map(r => ({
        ...r,
        answers: r.answers as any,
        completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
    }))
}

async function handleQuizSubmit(score: number, totalQuestions: number, answers: Record<number, string>) {
    if (!selectedQuizId.value) return

    const userAnswers = Object.entries(answers).map(([cardId, answerId]) => {
        const card = selectedQuiz.value?.cards.find(c => c.cardId === parseInt(cardId))
        const answer = card?.answers.find(a => a.id === answerId)
        return {
            cardId: parseInt(cardId),
            selectedAnswerId: answerId,
            isCorrect: answer?.isCorrect || false,
        }
    })

    await pglite.saveQuizResult(selectedQuizId.value, score, totalQuestions, userAnswers)
    lastScore.value = { score, totalQuestions }
    view.value = 'results'

    const results = await pglite.getQuizResults(selectedQuizId.value)
    quizResults.value = results.map(r => ({
        ...r,
        answers: r.answers as any,
        completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
    }))
}

function handleRetake() {
    view.value = 'quiz'
    lastScore.value = null
}

function handleClose() {
    selectedQuizId.value = null
    view.value = 'create'
    lastScore.value = null
}

onMounted(async () => {
    await pglite.createTables()
    await loadQuizzes()
})
</script>

<template>
    <div class="flex h-screen bg-background">
        <Sidebar
            :quizzes="quizzes"
            @new-quiz="handleNewQuiz"
            @select-quiz="handleSelectQuiz"
        />

        <main class="flex-1 overflow-auto p-6">
            <div class="max-w-4xl mx-auto">
                <CreateQuiz
                    v-if="view === 'create'"
                    @created="handleQuizCreated"
                />

                <div
                    v-else-if="view === 'quiz' && selectedQuiz"
                    class="space-y-4"
                >
                    <QuizInterface
                        :key="selectedQuiz.id"
                        :quiz="selectedQuiz"
                        @submit="handleQuizSubmit"
                        @retake="handleRetake"
                        @close="handleClose"
                    />
                </div>

                <div
                    v-else-if="view === 'results' && lastScore"
                    class="space-y-4"
                >
                    <ScoreDisplay
                        :score="lastScore.score"
                        :total-questions="lastScore.totalQuestions"
                        :results="quizResults"
                    />

                    <div class="flex gap-2">
                        <Button
                            @click="handleRetake"
                            class="flex-1"
                        >
                            Retake Quiz
                        </Button>
                        <Button
                            variant="outline"
                            @click="handleClose"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </main>

        <PWABadge />
    </div>
</template>

<style scoped></style>
