<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">TaskApp</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="user">
                        <router-link class="nav-link" to="/tasks">Tasks</router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="user">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Settings
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
                        </ul>
                    </li>
                </ul>
                <button class="btn btn-outline-danger" v-if="user" @click="logoutUser">Logout</button>
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item" v-if="!user">
                        <router-link class="nav-link" to="/login">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="!user">
                        <router-link class="nav-link" to="/register">Register</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut

export default {
  name: 'TheNavbar',
  setup() {
    const user = ref(null);
    const router = useRouter();

    onMounted(() => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser;
        console.log('User state change. Current user is:', firebaseUser);
        router.push('/');
      });
    });

    const logoutUser = async () => {
      try {
        await signOut(auth); 
        router.push('/login'); 
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    return { user, logoutUser }; 
  },
};
</script>
  