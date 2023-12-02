<template>
    <div class="container mt-4">
        <h2>Task Details</h2>
        <div v-if="user && task">
            <h3>{{ task.name }}</h3>
            <p>{{ task.description }}</p>
            <p>Due Date: {{ task.dueDate }}</p>
            <p>Priority Level: {{ task.priorityLevel }}</p>
            <p>Status: {{ task.status }}</p>
            <button class="btn btn-primary" @click="goBack">Go Back</button>
            <button class="btn btn-success" @click="editTask">Edit</button>
            <button class="btn btn-danger" @click="confirmDelete">Delete</button>
        </div>
        <div v-else-if="user && !task">
            <p>Task not found or you do not have permission to view this task.</p>
        </div>
        <div v-else>
            <p>You must be logged in to view this task.</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';

export default {
    setup() {
        const router = useRouter();
        const auth = getAuth();
        const task = ref(null);
        const taskId = ref(router.currentRoute.value.params.id);
        const user = ref(auth.currentUser);

        onMounted(async () => {
            if (auth.currentUser && taskId.value) {
                try {
                    const taskDoc = await getDoc(doc(db, 'tasks', taskId.value));
                    if (taskDoc.exists() && taskDoc.data().userId === auth.currentUser.uid) {
                        task.value = { id: taskDoc.id, ...taskDoc.data() };
                    } else {
                        console.error("Task not found or you do not have permission to view this task.");
                    }
                } catch (error) {
                    console.error("Error fetching task: ", error);
                }
            }
        });

        const goBack = () => {
            router.push('/tasks-view');
        };

        const editTask = () => {
            // Navigate to the edit page for the task
            router.push(`/tasks/${taskId.value}/update`);
        };

        const confirmDelete = () => {
            if (window.confirm("Are you sure you want to delete this task?")) {
                // Delete the task and navigate back
                deleteTask();
            }
        };

        const deleteTask = async () => {
            if (auth.currentUser && taskId.value) {
                try {
                    await deleteDoc(doc(db, 'tasks', taskId.value));
                    alert("Task deleted successfully.");
                    router.push('/tasks-view');
                } catch (error) {
                    console.error("Error deleting task: ", error);
                }
            }
        };

        return {
            user,
            task,
            taskId,
            goBack,
            editTask,
            confirmDelete,
        };
    },
};
</script>