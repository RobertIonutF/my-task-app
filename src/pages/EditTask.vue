<template>
    <div class="container mt-4">
        <h2>Edit Task</h2>
        <form @submit.prevent="updateTask">
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
            <div class="row">
                <div class="col">
                    <button type="submit" class="btn btn-primary">Update Task</button>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <button class="btn btn-primary" @click="goBack">Go Back</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';

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
        const taskId = ref(router.currentRoute.value.params.id);

        onMounted(async () => {
            if (auth.currentUser && taskId.value) {
                try {
                    const taskDoc = await getDoc(doc(db, 'tasks', taskId.value));
                    if (taskDoc.exists() && taskDoc.data().userId === auth.currentUser.uid) {
                        const taskData = taskDoc.data();
                        task.value = {
                            name: taskData.name,
                            description: taskData.description,
                            dueDate: taskData.dueDate,
                            priorityLevel: taskData.priorityLevel,
                            status: taskData.status
                        };
                    } else {
                        console.error("Task not found or you do not have permission to edit this task.");
                        router.push('/tasks-view'); // Redirect to tasks page or wherever appropriate
                    }
                } catch (error) {
                    console.error("Error fetching task: ", error);
                }
            }
        });

        const updateTask = async () => {
            if (!auth.currentUser) {
                alert("You must be logged in to update a task.");
                return;
            }

            try {
                const taskRef = doc(db, 'tasks', taskId.value);
                await updateDoc(taskRef, {
                    name: task.value.name,
                    description: task.value.description,
                    dueDate: task.value.dueDate,
                    priorityLevel: task.value.priorityLevel,
                    status: task.value.status,
                    lastUpdated: serverTimestamp() // Use Firebase server timestamp
                });
                alert("Task updated successfully");
                router.push('/tasks-view'); // Redirect to tasks page or wherever appropriate
            } catch (error) {
                console.error("Error updating task: ", error);
                alert(error.message);
            }
        };

        const goBack = () => {
            router.push(`/tasks/${taskId.value}`);
        };

        return {
            task,
            updateTask,
            goBack
        };
    }
};
</script>