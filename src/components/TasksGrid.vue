<template>
    <div class="container mt-4">
        <h2>Tasks</h2>
        <div class="tasks-grid">
            <div class="task-card" v-for="task in tasks" :key="task.id">
                <h3>{{ task.name }}</h3>
                <p>{{ task.description }}</p>
                <p>Due Date: {{ task.dueDate }}</p>
                <p>Priority Level: {{ task.priorityLevel }}</p>
                <p>Status: {{ task.status }}</p>
                <button class="btn btn-primary" @click="viewTask(task.id)">View</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const tasks = ref([]);
        const auth = getAuth();
        const router = useRouter();

        onMounted(async () => {
            if (auth.currentUser) {
                try {
                    const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    tasks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } catch (error) {
                    console.error("Error fetching tasks: ", error);
                }
            }
        });

        const viewTask = (taskId) => {
            router.push(`/tasks/${taskId}`);
        };

        return {
            tasks,
            viewTask
        };
    }
};
</script>
  
<style>
.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
}

.task-card {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    /* Add more styling as needed */
}

/* For smaller screens */
@media (max-width: 600px) {
    .tasks-grid {
        grid-template-columns: 1fr;
    }
}
</style>