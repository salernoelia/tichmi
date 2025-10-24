<template>
    <aside class="w-64 border-r bg-muted/40 flex flex-col">
        <div class="p-4 border-b">
            <h1 class="text-xl font-bold">Tichmi</h1>
            <p class="text-xs text-muted-foreground">Interactive Learning</p>
        </div>

        <ScrollArea class="flex-1 p-4">
            <div class="space-y-4">
                <div>
                    <h2 class="text-sm font-semibold mb-2 text-muted-foreground">Actions</h2>
                    <Button
                        variant="outline"
                        class="w-full justify-start"
                        @click="$emit('new-quiz')"
                    >
                        <span class="mr-2">+</span>
                        New Quiz
                    </Button>
                </div>

                <div v-if="quizzes.length > 0">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-semibold text-muted-foreground">Quizzes</h2>
                        <Badge variant="secondary">{{ quizzes.length }}</Badge>
                    </div>
                    <QuizList
                        :quizzes="quizzes"
                        @select="$emit('select-quiz', $event)"
                    />
                </div>
            </div>
        </ScrollArea>
    </aside>
</template>

<script
    setup
    lang="ts"
>
import type { Quiz } from '@/types/quiz'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import QuizList from './QuizList.vue'

interface Props {
    quizzes: Quiz[]
}

defineProps<Props>()
defineEmits<{
    'new-quiz': []
    'select-quiz': [id: number]
}>()
</script>
