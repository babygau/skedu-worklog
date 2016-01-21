export const ADMIN_ACTION = 'ADMIN_ACTION'
export const USER_ACTION = 'USER_ACTION'
export const AUTHENTICATION_ACTION = 'AUTHENTICATION_ACTION'
export const EDIT_USER_ACTION = 'EDIT_USER_ACTION'
export const EDIT_WORKLOG_ACTION = 'EDIT_WORKLOG_ACTION'

export  function adminAction(admin) {
  return {
    type: ADMIN_ACTION,
    admin
  }
}

export function userAction(user) {
  return {
    type: USER_ACTION,
    user
  }
}

export function editUserAction(editUser) {
  return {
    type: EDIT_USER_ACTION,
    editUser
  }
}

export function editWorklogAction(editWorklog) {
  return {
    type: EDIT_WORKLOG_ACTION,
    editWorklog
  }
}

export function authenticationAction(isAuthenticated) {
  return {
    type: AUTHENTICATION_ACTION,
    isAuthenticated
  }
}
