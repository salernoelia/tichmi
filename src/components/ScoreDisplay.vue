<template>
    <Card>
        <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="text-center space-y-2">
                <div
                    class="text-6xl font-bold"
                    :class="scoreColor"
                >
                    {{ score }}/{{ totalQuestions }}
                </div>
                <p class="text-lg text-muted-foreground">
                    {{ percentage }}% - {{ scoreMessage }}
                </p>
            </div>

            <div
                v-if="results.length > 0"
                class="space-y-2"
            >
                <Label>Previous Attempts</Label>
                <div class="space-y-1">
                    <div
                        v-for="(result, index) in results.slice(0, 5)"
                        :key="result.id"
                        class="flex justify-between items-center p-2 rounded bg-muted/50 text-sm"
                    >
                        <span>Attempt {{ results.length - index }}</span>
                        <Badge :variant="getResultVariant(result.score, result.totalQuestions)">
                            {{ result.score }}/{{ result.totalQuestions }} ({{ Math.round((result.score /
                                result.totalQuestions) * 100) }}%)
                        </Badge>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script
    setup
    lang="ts"
>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { QuizResult } from '@/types/quiz'

interface Props {
    score: number
    totalQuestions: number
    results?: QuizResult[]
}

const props = withDefaults(defineProps<Props>(), {
    results: () => []
})

const percentage = computed(() => Math.round((props.score / props.totalQuestions) * 100))

const scoreColor = computed(() => {
    const pct = percentage.value
    if (pct >= 90) return 'text-green-600'
    if (pct >= 70) return 'text-blue-600'
    if (pct >= 50) return 'text-yellow-600'
    return 'text-red-600'
})

const scoreMessage = computed(() => {
    const pct = percentage.value
    if (pct === 100) return 'Perfect!'
    if (pct >= 90) return 'Excellent!'
    if (pct >= 70) return 'Good Job!'
    if (pct >= 50) return 'Keep Practicing!'
    return 'Try Again!'
})

function getResultVariant(score: number, total: number): 'default' | 'secondary' | 'destructive' {
    const pct = (score / total) * 100
    if (pct >= 70) return 'default'
    if (pct >= 50) return 'secondary'
    return 'destructive'
}
</script>
