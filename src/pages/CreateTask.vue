<template>
    <div class="container mt-4">
        <h2>Create New Task</h2>
        <form @submit.prevent="createTask">
            <div class="mb-3">
                <label for="taskName" class="form-label">Task Name</label>
                <input type="text" class="form-control" id="taskName" v-model="task.name" required>
            </div>
            <div class="mb-3">
                <label for="taskDescription" class="form-label">Description</label>
                <textarea class="form-control" id="taskDescription" v-model="task.description" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="dueDate" class="form-label">Due Date</label>
                <input type="date" class="form-control" id="dueDate" v-model="task.dueDate">
            </div>
            <div class="mb-3">
                <label for="priorityLevel" class="form-label">Priority Level</label>
                <select class="form-control" id="priorityLevel" v-model="task.priorityLevel">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" v-model="task.status">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <!-- Add more fields as needed -->
            <button type="submit" class="btn btn-primary">Create Task</button>
        </form>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default {
    setup() {
        const router = useRouter();
        const auth = getAuth();
        const task = ref({
            name: '',
            description: '',
            dueDate: '',
            priorityLevel: 'High',
            status: 'Pending'
        });

        const createTask = async () => {
            if (!auth.currentUser) {
                alert("You must be logged in to create a task.");
                return;
            }

            try {
                await addDoc(collection(db, "tasks"), {
                    ...task.value,
                    userId: auth.currentUser.uid,
                    creationDate: serverTimestamp(), // Use Firebase server timestamp
                    lastUpdated: serverTimestamp(),
                });
                alert("Task created successfully");
                router.push('/tasks-view'); // Redirect to tasks page or wherever appropriate
            } catch (error) {
                console.error("Error adding task: ", error);
                alert(error.message);
            }
        };

        return {
            task,
            createTask
        };
    }
};
</script>
  
<style>
/* Add styles here if needed */
</style>