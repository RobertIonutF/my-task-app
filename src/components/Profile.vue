<template>
    <div class="container mt-4">
      <h2>Profile</h2>
      <div>
        <p>Email: {{ userEmail }}</p>
      </div>
      <form @submit.prevent="changePassword">
        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
        </div>
        <button type="submit" class="btn btn-primary">Change Password</button>
      </form>
      <button @click="deleteAccount" class="btn btn-danger mt-3">Delete Account</button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebaseConfig';
  import { updatePassword, deleteUser } from 'firebase/auth';
  
  export default {
    setup() {
      const newPassword = ref('');
      const router = useRouter();
      const user = auth.currentUser;
      const userEmail = user ? user.email : '';
      const userPhoto = user ? user.photoURL : 'default-profile-pic-url'; // Replace with default image URL
  
      const changePassword = async () => {
        if (user) {
          try {
            await updatePassword(user, newPassword.value);
            alert('Password successfully updated');
            newPassword.value = '';
          } catch (error) {
            alert(error.message);
          }
        }
      };
  
      const deleteAccount = async () => {
        const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmDelete && user) {
          try {
            await deleteUser(user);
            router.push('/login');
          } catch (error) {
            alert(error.message);
          }
        }
      };
  
      return { newPassword, userEmail, userPhoto, changePassword, deleteAccount };
    }
  };
  </script>
  