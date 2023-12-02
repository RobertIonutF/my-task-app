<template>
    <div class="container mt-4">
        <h1>Tasks</h1>
        <p>Here you can manage your tasks.</p>

        <!-- Buttons to add and view tasks -->
        <div class="row">
            <div class="col">
                <button class="btn btn-primary" @click="addTask">Add Task</button>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col">
                <button class="btn btn-primary" @click="viewTasks">View Tasks</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { useRouter } from 'vue-router';

export default {
    name: 'Tasks',
    setup() {
        const router = useRouter();

        const addTask = () => {
            router.push('/create-task');
        };

        const viewTasks = () => {
            router.push('/tasks-view');
        };

        return {
            addTask,
            viewTasks
        };
    }
};
</script>