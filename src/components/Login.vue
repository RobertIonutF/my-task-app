<template>
    <div class="container mt-4">
        <h2>Login</h2>
        <form @submit.prevent="loginUser">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebaseConfig';

import { signInWithEmailAndPassword } from "firebase/auth";

export default {
    setup() {
        const email = ref('');
        const password = ref('');
        const router = useRouter();

        const loginUser = async () => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

                if (userCredential.user.emailVerified) {
                    alert('You are logged in!');
                    router.push('/'); 
                } else {
                    alert('Please verify your email address.');
                    await auth.signOut(); 
                    router.push('/login');
                }
            } catch (error) {
                alert(error.message);
            }
        };

        return {
            email,
            password,
            loginUser
        };
    }
};
</script>