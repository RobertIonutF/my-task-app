import {createRouter, createWebHistory} from 'vue-router';
import {getAuth} from 'firebase/auth';

import Home from './pages/Home.vue'
import Tasks from './pages/Tasks.vue'

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';

import CreateTask from './pages/CreateTask.vue';
import TasksGrid from './components/TasksGrid.vue';
import Task from './components/Task.vue';
import EditTask from './pages/EditTask.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: Tasks,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            publicOnly: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            publicOnly: true
        }
    }, {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/create-task',
        name: 'CreateTask',
        component: CreateTask,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks-view',
        name: 'TasksGrid',
        component: TasksGrid,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/:id',
        name: 'Task',
        component: Task,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/:id/update',
        name: 'EditTask',
        component: EditTask,
        meta: {
            requiresAuth: true
        }
    }
];

const router = createRouter({history: createWebHistory(), routes});

router.beforeEach((to, from, next) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isPublicOnly = to.matched.some(record => record.meta.publicOnly);

    if (requiresAuth && !user) {
        next('/login');
    } else if (isPublicOnly && user) {
        next('/');
    } else {
        next();
    }
});

export default router;
