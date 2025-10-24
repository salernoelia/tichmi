<template>
    <Card>
        <CardHeader>
            <CardTitle>{{ quiz.title }}</CardTitle>
            <CardDescription>{{ quiz.topic }}</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="space-y-6">
                <div
                    v-for="(card, index) in quiz.cards"
                    :key="card.cardId"
                    class="space-y-4"
                >
                    <div class="flex items-start gap-2">
                        <Badge variant="outline">{{ index + 1 }}</Badge>
                        <p class="font-medium">{{ card.question }}</p>
                    </div>

                    <div class="space-y-2 pl-8">
                        <button
                            v-for="answer in card.answers"
                            :key="answer.id"
                            :class="cn(
                                'w-full text-left p-3 rounded-md border transition-all',
                                selectedAnswers[card.cardId] === answer.id && !submitted
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50',
                                submitted && answer.id === selectedAnswers[card.cardId] && answer.isCorrect
                                    ? 'border-green-500 bg-green-500/10'
                                    : submitted && answer.id === selectedAnswers[card.cardId] && !answer.isCorrect
                                        ? 'border-red-500 bg-red-500/10'
                                        : submitted && answer.isCorrect
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : ''
                            )"
                            :disabled="submitted"
                            @click="selectAnswer(card.cardId, answer.id)"
                        >
                            <div class="flex items-start gap-2">
                                <span class="font-mono text-sm">{{ answer.id }}.</span>
                                <span>{{ answer.text }}</span>
                            </div>

                            <div
                                v-if="submitted && answer.id === selectedAnswers[card.cardId]"
                                class="mt-2 pt-2 border-t text-sm"
                            >
                                <p class="text-muted-foreground">{{ answer.hint }}</p>
                                <p class="mt-1">{{ answer.explanation }}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex gap-2">
                <Button
                    v-if="!submitted"
                    @click="submitQuiz"
                    :disabled="Object.keys(selectedAnswers).length !== quiz.cards.length"
                    class="flex-1"
                >
                    Submit Quiz
                </Button>
                <Button
                    v-if="submitted"
                    @click="$emit('retake')"
                    class="flex-1"
                >
                    Retake Quiz
                </Button>
                <Button
                    v-if="submitted"
                    variant="outline"
                    @click="$emit('close')"
                >
                    Close
                </Button>
            </div>
        </CardContent>
    </Card>
</template>

<script
    setup
    lang="ts"
>
import { ref, reactive } from 'vue'
import type { Quiz } from '@/types/quiz'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
    quiz: Quiz
}

const props = defineProps<Props>()
const emit = defineEmits<{
    submit: [score: number, totalQuestions: number, answers: Record<number, string>]
    retake: []
    close: []
}>()

const selectedAnswers = reactive<Record<number, string>>({})
const submitted = ref(false)

function selectAnswer(cardId: number, answerId: string) {
    if (!submitted.value) {
        selectedAnswers[cardId] = answerId
    }
}

function submitQuiz() {
    submitted.value = true

    let correctCount = 0
    props.quiz.cards.forEach(card => {
        const selectedAnswer = card.answers.find(a => a.id === selectedAnswers[card.cardId])
        if (selectedAnswer?.isCorrect) {
            correctCount++
        }
    })

    emit('submit', correctCount, props.quiz.cards.length, { ...selectedAnswers })
}
</script>
