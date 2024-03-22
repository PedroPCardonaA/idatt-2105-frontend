import { createApp, h } from 'vue';
import ErrorPopup from '../components/ErrorPopup.vue';

function throwErrorPopup(message) {
  const app = document.querySelector('#error-container');
  const errorInstance = createApp({
    render: () => h(ErrorPopup, { message })
  }).mount(app.appendChild(document.createElement('div')));
}

export { throwErrorPopup };