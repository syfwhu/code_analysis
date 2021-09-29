export default [
  {
    path: '/home',
    name: 'home',
    icon: 'smile',
    component: './Home',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Home',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'modules',
    icon: 'table',
    path: '/modules',
    component: './Modules',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
