import { useClipboard } from 'vue-clipboard3';

export default function (app) {
    app.provide('clipboard', useClipboard());
}