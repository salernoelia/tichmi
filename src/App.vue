<script setup>
import { onMounted, ref } from "vue";
import PWABadge from "./components/PWABadge.vue";
import { usePGLite } from "./composables/usePGLite";

const pglite = usePGLite();

const data = ref()

onMounted(async () => {
    await pglite.createTables();
    data.value = await pglite.fetchData();
});

</script>

<template>
    <PWABadge />

    <div class="flex flex-row">
        <h1>2afs</h1>
        <h1>2afs</h1>
        <h1>2afs</h1>
    </div>
    {{ data }}

</template>

<style scoped></style>
