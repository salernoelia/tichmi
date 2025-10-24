<template>
    <div :class="cn('relative overflow-hidden', $attrs.class ?? '')">
        <div class="h-full w-full overflow-auto">
            <slot />
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
import { cn } from '@/lib/utils'
</script>
