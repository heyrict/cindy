export const ACTION_SET_CURRENT_USER = "ACTION_SET_CURRENT_USER";

export const actionSetCurrentUser = user => ({
  type: ACTION_SET_CURRENT_USER,
  currentUser: user
});