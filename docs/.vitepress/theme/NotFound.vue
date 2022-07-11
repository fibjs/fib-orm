<template>
  <div class="theme">
    <h1>404</h1>
    <blockquote>{{ getMsg() }}</blockquote>
    <a :href="site.base" aria-label="go to home">Take me home.</a>
  </div>
</template>

<script setup lang="ts">
import {
  useData,
  useRouter
} from 'vitepress'

const { site } = useData()

const router = useRouter();

const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]

function getMsg() {
  return msgs[Math.floor(Math.random() * msgs.length)]
}

const baseNoSlash = (site.value.base || '/').replace(/\/$/, '');
if (router.route.path === `${baseNoSlash}.html`) {
  window.location.href = `${baseNoSlash}/`;
}
</script>
