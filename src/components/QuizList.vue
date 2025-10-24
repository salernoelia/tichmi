<template>
    <div class="flex flex-col gap-2">
        <Button
            v-for="quiz in quizzes"
            :key="quiz.id"
            variant="ghost"
            class="justify-start"
            @click="$emit('select', quiz.id!)"
        >
            <div class="flex flex-col items-start w-full">
                <span class="font-medium">{{ quiz.title }}</span>
                <span class="text-xs text-muted-foreground">{{ quiz.topic }}</span>
            </div>
        </Button>

        <Button
            v-if="quizzes.length === 0"
            variant="ghost"
            disabled
            class="justify-start text-muted-foreground"
        >
            No quizzes yet
        </Button>
    </div>
</template>

<script
    setup
    lang="ts"
>
import type { Quiz } from '@/types/quiz'
import { Button } from '@/components/ui/button'

interface Props {
    quizzes: Quiz[]
}

defineProps<Props>()
defineEmits<{
    select: [id: number]
}>()
</script>
