import NoneLayout from '@/views/layout/NoneLayout';

const outerRouter = {
    path: '/outer',
    name: 'outer',
    redirect: '/outer/auth',
    component: NoneLayout,
    hidden: true,
    meta: {
        title: '公司设置'
    },
    children: [
        {
            path: 'auth',
            component: () => import('@/views/outer/auth'),
            name: 'outerAuth',
            hidden: true
        },
        {
            path: 'file',
            component: () => import('@/views/outer/file'),
            name: 'outerFile',
            hidden: true
        },
        {
            path: 'user',
            component: () => import('@/views/outer/user'),
            name: 'outerUser',
            hidden: true
        },
        {
            path: 'org',
            component: () => import('@/views/outer/org'),
            name: 'outerOrg',
            hidden: true
        }
    ]
};

export default outerRouter;
