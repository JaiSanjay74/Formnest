import "./Index style/main.css"

import { createApp } from 'vue'
import App from './FormNest.vue'
import nav from "./Components/Nav.vue"
import login from "./Components/Login.vue"
import profile from "./Components/Profile.vue"
import forms from "./Components/Forms.vue"
import signup from "./Components/Signup.vue"

var app = createApp(App)

app.component("Navbar",nav)
app.component("Login",login)
app.component("Signup",signup)
app.component("Forms",forms)
app.component("Profile",profile)
app.mount('#app')
