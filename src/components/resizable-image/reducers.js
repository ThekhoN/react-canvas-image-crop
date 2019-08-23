const SET_WIDTH = "SET_WIDTH";
const SET_HEIGHT = "SET_HEIGHT";
const SET_OFFSET_LEFT = "SET_OFFSET_LEFT";
const SET_OFFSET_TOP = "SET_OFFSET_TOP";
const SET_MOUSE_X = "SET_MOUSE_X";
const SET_MOUSE_Y = "SET_MOUSE_Y";

export const ACTIONS = {
  SET_WIDTH,
  SET_HEIGHT,
  SET_OFFSET_LEFT,
  SET_OFFSET_TOP,
  SET_MOUSE_X,
  SET_MOUSE_Y
};

export const initialEventState = {
  width: 0,
  height: 0,
  offsetLeft: 0,
  offsetTop: 0,
  mouseX: 0,
  mouseY: 0
};

export const eventStateReducer = (state, action) => {
  switch (action.type) {
    case SET_WIDTH:
      return {
        ...state,
        width: action.payload
      };
    case SET_HEIGHT:
      return {
        ...state,
        height: action.payload
      };
    case SET_OFFSET_LEFT:
      return {
        ...state,
        offsetLeft: action.payload
      };
    case SET_OFFSET_TOP:
      return {
        ...state,
        offsetTop: action.payload
      };
    case SET_MOUSE_X:
      return {
        ...state,
        mouseX: action.payload
      };
    case SET_MOUSE_Y:
      return {
        ...state,
        mouseY: action.payload
      };
    default:
      return state;
  }
};
