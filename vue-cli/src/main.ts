import {createApp} from 'vue'
import App from "./App.vue"


  

// createApp放入App组件，然后通过mount方法将其挂在到页面的某个元素上
createApp(App).mount(document.getElementById("app"));