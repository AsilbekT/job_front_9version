export default [
  {
    id: 1,
    label: 'Home',
    items: [
      {
        name: 'Find Jobs',
        routePath: '/',
      },
    ],
  },
  {
    id: 10,
    label: 'Profile',
    items: (user) => {
      if (!user) {
        return [
          {
            name: 'Login',
            routePath: '/login',
          },
          {
            name: 'Register',
            routePath: '/register',
          },
        ];
      }
      return user.is_employer
        ? [
            {
              name: "Employers' Dashboard",
              routePath: '/employer/dashboard',
            },
            {
              name: 'Company Profile',
              routePath: '/employer/company-profile',
            },
            {
              name: 'Post a New Job',
              routePath: '/employer/post-jobs',
            },
            {
              name: 'Manage Jobs',
              routePath: '/employer/manage-jobs',
            },
            {
              name: 'All Applicants',
              routePath: '/employer/all-applicants',
            },
            {
              name: 'Change Password',
              routePath: '/candidate/change-password',
            },
          ]
        : [
            {
              name: 'My Profile',
              routePath: '/candidate/my-resume',
            },
            {
              name: 'Applications Submitted',
              routePath: '/candidate/applied-jobs',
            },
            // {
            //   name: 'My Resume',
            //   routePath: '/candidate/cv-manager',
            // },
            {
              name: 'Change Password',
              routePath: '/candidate/change-password',
            },
          ];
    },
  },
];
