import { createApp, h } from 'vue';
import { defineNuxtPlugin } from '#app';
import Alert from '@/components/Alert.vue'; // Путь до вашего компонента Alert

export default defineNuxtPlugin((nuxtApp) => {
  const div = document.createElement('div');
  div.id = 'alert-container';
  document.body.appendChild(div);

  nuxtApp.provide('alert', {
    show(message, options) {
      const instance = createApp({
        render: () => h(Alert, { message, ...options }),
      });
      const alert = document.createElement('div');
      div.appendChild(alert);
      instance.mount(alert);

      setTimeout(() => {
        instance.unmount();
        if (div.contains(alert)) {
          div.removeChild(alert);
        }
      }, options.timeout || 3000);
    },
  });
});
