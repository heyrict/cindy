import { ACTION_SET_CURRENT_USER } from "./actions";
import { setCurrentUser } from "./actions";

const initialState = {
  currentUser: {
    userId: window.django.user_id,
    nickname: window.django.user_nickname
  }
};

function cindyApp(state = initialState, action) {
  console.log(state);
  switch (action.type) {
    case ACTION_SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser
      };

    default:
      return state;
  }
}

export default cindyApp;
