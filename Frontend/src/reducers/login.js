const loginReducer = (state = false, action) => {
  switch (action.type) {
    case "checkLog":
      return action.status;

    default:
      return state;
  }
}

export default loginReducer;