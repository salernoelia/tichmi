<template>
    <Card>
        <CardHeader>
            <CardTitle>Create New Quiz</CardTitle>
            <CardDescription>Enter a topic and optionally upload a PDF document</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Label for="topic">Quiz Topic</Label>
                <Input
                    id="topic"
                    v-model="topic"
                    placeholder="e.g., Calculus Derivatives"
                    @keyup.enter="handleGenerate"
                />
            </div>

            <div class="space-y-2">
                <Label for="pdf">PDF Document (Optional)</Label>
                <div
                    :class="cn(
                        'border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors',
                        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="handleDrop"
                    @click="fileInput?.click()"
                >
                    <input
                        ref="fileInput"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        class="hidden"
                        @change="handleFileChange"
                    />

                    <div v-if="!uploadedFile">
                        <p class="text-sm font-medium">Drop a PDF or document here</p>
                        <p class="text-xs text-muted-foreground mt-1">or click to browse</p>
                    </div>

                    <div
                        v-else
                        class="flex items-center justify-center gap-2"
                    >
                        <span class="text-sm font-medium">{{ uploadedFile.name }}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            @click.stop="uploadedFile = null"
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                @click="handleGenerate"
                :disabled="isGenerating"
                class="w-full"
            >
                {{ isGenerating ? 'Generating...' : 'Generate Quiz' }}
            </Button>

            <p
                v-if="error"
                class="text-sm text-red-500"
            >{{ error }}</p>
        </CardContent>
    </Card>
</template>

<script
    setup
    lang="ts"
>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useQuizGenerator } from '@/composables/useQuizGenerator'
import { usePDFUpload } from '@/composables/usePDFUpload'
import type { Quiz } from '@/types/quiz'

const emit = defineEmits<{
    created: [quiz: Quiz]
}>()

const topic = ref('')
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const { isGenerating, error: genError, generateQuiz } = useQuizGenerator()
const { uploadPDF, error: uploadError } = usePDFUpload()

const error = ref<string | null>(null)

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
        uploadedFile.value = target.files[0]
    }
}

function handleDrop(event: DragEvent) {
    isDragging.value = false
    const file = event.dataTransfer?.files[0]
    if (file) {
        uploadedFile.value = file
    }
}

async function handleGenerate() {
    if (!topic.value) return

    error.value = null
    let pdfData = null

    if (uploadedFile.value) {
        pdfData = await uploadPDF(uploadedFile.value)
        if (uploadError.value) {
            error.value = uploadError.value
            return
        }
    }

    const quiz = await generateQuiz(topic.value, pdfData ?? undefined)

    if (genError.value) {
        error.value = genError.value
        return
    }

    if (quiz) {
        emit('created', quiz)
        topic.value = ''
        uploadedFile.value = null
    }
}
</script>
