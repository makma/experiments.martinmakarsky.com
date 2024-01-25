<script setup lang="ts">
import VisitorDataRoot from "../components/VisitorDataRoot.vue";
</script>

<template>
  <main>
    <client-only>
      <visitor-data-root />
    </client-only>
  </main>
</template>

<style>
main {
  width: 100%;
}
</style>