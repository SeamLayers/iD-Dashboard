export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  companies: {
    all: ['companies'],
    list: (params) => ['companies', 'list', params],
    detail: (id) => ['companies', 'detail', id],
    mine: ['companies', 'mine'],
  },
  branches: {
    all: ['branches'],
    list: (params) => ['branches', 'list', params],
    detail: (id) => ['branches', 'detail', id],
  },
  departments: {
    all: ['departments'],
    list: (params) => ['departments', 'list', params],
    detail: (id) => ['departments', 'detail', id],
  },
  employees: {
    all: ['employees'],
    list: (params) => ['employees', 'list', params],
    detail: (id) => ['employees', 'detail', id],
  },
  projects: {
    all: ['projects'],
    list: (params) => ['projects', 'list', params],
    detail: (id) => ['projects', 'detail', id],
  },
  employeeProjects: {
    all: ['employee-projects'],
    list: (params) => ['employee-projects', 'list', params],
    detail: (id) => ['employee-projects', 'detail', id],
  },
  notifications: {
    all: ['notifications'],
    list: ['notifications', 'list'],
  },
  businessCards: {
    all: ['business-cards'],
    list: (params) => ['business-cards', 'list', params],
    detail: (id) => ['business-cards', 'detail', id],
    analytics: (id) => ['business-cards', 'analytics', id],
  },
  businessCardTemplates: {
    all: ['business-card-templates'],
    list: (params) => ['business-card-templates', 'list', params],
    detail: (id) => ['business-card-templates', 'detail', id],
  },
  roles: {
    all: ['roles'],
    list: (params) => ['roles', 'list', params],
    detail: (id) => ['roles', 'detail', id],
  },
};
