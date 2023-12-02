<template>
    <div class="container mt-4">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
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
import { auth } from '../firebaseConfig';

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default {
    setup() {
        const email = ref('');
        const password = ref('');

        const registerUser = async () => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
                await sendEmailVerification(userCredential.user);
                await auth.signOut();
            } catch (error) {
                alert(error.message);
            }
        };

        return {
            email,
            password,
            registerUser
        };
    }
};
</script>