<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import packageInfo from '../package.json'
import { DrawerComponent } from './components/drawer-lit';
import { drawerButtons } from './components/DrawerButtons';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
     const route = useRoute()
    const buttons = ref(drawerButtons)
    const activeButtonId = ref(buttons.value.find(button => button.isActive)?.id || '')
    const version = ref(`Selia v${packageInfo.version}`)
    const openLogo = ref('https://selia.co/wp-content/uploads/2023/08/logotipo-1.png')
    const closedLogo = ref('https://play-lh.googleusercontent.com/CKIG_2YsW7VZstTqdILroadwnoieunCOAvaz2jrkxgpADIbXTNohCiBRi923sqi9-7I')

    const handleDrawerSelect = (event: CustomEvent) => {
      activeButtonId.value = event.detail.id
      buttons.value.forEach(button => {
        button.isActive = button.id === event.detail.id
      })
      router.push(event.detail.route)
    }

        
    watch(() => route.path, (newPath) => {
      const activeButton = buttons.value.find(button => button.path === newPath)
      if (activeButton) {
        activeButtonId.value = activeButton.id
      }
    }, { immediate: true })

    onMounted(() => {
      if (!customElements.get('drawer-component')) {
        customElements.define('drawer-component', DrawerComponent)
      }
    })


    return {
      buttons,
      version,
      openLogo,
      closedLogo,
      activeButtonId,
      handleDrawerSelect,
    }
  }
})
</script>

<template>
  <div id="app">
    <drawer-component :buttons="buttons" :version="version" :openLogo="openLogo" :closedLogo="closedLogo"
      :activeButtonId="activeButtonId" @drawer-select="handleDrawerSelect" />
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.router-view {
  margin-left: 60px;
  transition: margin-left 0.3s ease;
}

.router-view.drawer-open {
  margin-left: 250px;
}
</style>