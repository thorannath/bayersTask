import { onCloseModals, onShowModals } from "./utils/reducerFunctions";

//ACTION TYPES
const SHOW_MODAL = "SHOW_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";



export const showModal = (data) =>({
    type: SHOW_MODAL,
    payload:data
});

export const closeModal = (data) =>({
    type: CLOSE_MODAL,
    payload:data
})

const reducer = (state = { messageType:'', action:'', data:''}, action) => {
    switch (action.type) {
      case SHOW_MODAL:
        return onCloseModals(state, action.payload);
    case CLOSE_MODAL:
        return onShowModals(state, action.payload);
    default:
        return state;
    }
  };
  
  export default reducer;