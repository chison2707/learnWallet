const initialState = {
  isLogin: false,
  user: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        isLogin: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLogin: false,
        user: null,
      };
    default:
      return state;
  }
};


export default loginReducer;