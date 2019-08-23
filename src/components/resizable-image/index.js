import React from "react";
import styled from "styled-components";
import { eventStateReducer, ACTIONS, initialEventState } from "./reducers";

/* very brittle */

export const imgSrcURL =
  "https://images.unsplash.com/photo-1504884790557-80daa3a9e621?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=360&q=80";

const originalImg = new Image();
originalImg.src = imgSrcURL;
originalImg.crossOrigin = "Anonymous";

const ResizeContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: move;
  margin: 0 auto;

  & > img {
    display: block;
  }

  &:hover img,
  &:active img {
    outline: 2px dashed rgba(222, 60, 80, 0.9);
  }
`;

const ResizeHandleSpan = styled.span`
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background: rgba(222, 60, 80, 0.9);
  z-index: 999;

  &.resize-handle-nw {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }

  &.resize-handle-sw {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }

  &.resize-handle-ne {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }

  &.resize-handle-se {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
`;

const minWidth = 60;
const minHeight = 60;
const maxWidth = 800;
const maxHeight = 900;
const constrain = false;

const ResizableImage = ({ src, alt }) => {
  const [eventState, dispatch] = React.useReducer(
    eventStateReducer,
    initialEventState
  );

  let resizeContainerRef = React.createRef();
  let resizeImgRef = React.createRef();
  const resizeCanvas = document.createElement("canvas");

  const resizeImage = (width, height, resizeContainer) => {
    resizeCanvas.width = width;
    resizeCanvas.height = height;
    resizeCanvas.getContext("2d").drawImage(originalImg, 0, 0, width, height);
    const img = resizeContainer.querySelector("img");
    img.src = resizeCanvas.toDataURL("image/png");
  };

  const resizing = e => {
    const width = e.clientX - eventState.offsetLeft;
    let height = e.clientY - eventState.offsetTop;
    const left = eventState.offsetLeft;
    const top = eventState.offsetTop;
    const resizeContainer = e.target.parentNode;

    if (constrain || e.shiftKey) {
      height = (width / originalImg.width) * originalImg.height;
    }

    if (
      width > minWidth &&
      height > minHeight &&
      width < maxWidth &&
      height < maxHeight
    ) {
      resizeImage(width, height, resizeContainer);

      resizeContainer.style.left = left;
      resizeContainer.style.top = top;
      // $container.offset({'left': left, 'top': top});
    }
  };

  const endResize = e => {
    e.preventDefault();
    window.removeEventListener("mouseup", endResize);
    window.removeEventListener("touchend", endResize);

    window.removeEventListener("mousemove", resizing);
    window.removeEventListener("touchmove", resizing);
  };

  const saveEventState = e => {
    dispatch({
      type: ACTIONS.SET_WIDTH,
      payload: resizeContainerRef.current.offsetWidth
    });

    dispatch({
      type: ACTIONS.SET_HEIGHT,
      payload: resizeContainerRef.current.offsetHeight
    });

    dispatch({
      type: ACTIONS.SET_OFFSET_LEFT,
      payload: resizeContainerRef.current.offsetLeft
    });

    dispatch({
      type: ACTIONS.SET_OFFSET_TOP,
      payload: resizeContainerRef.current.offsetTop
    });

    dispatch({
      type: ACTIONS.SET_MOUSE_X,
      payload: e.clientX
    });

    dispatch({
      type: ACTIONS.SET_MOUSE_Y,
      payload: e.clientY
    });
  };

  const startResize = e => {
    e.preventDefault();
    e.stopPropagation();
    // e.persist();
    saveEventState(e);
    window.addEventListener("mousemove", resizing);
    window.addEventListener("mouseup", endResize);
  };

  return (
    <ResizeContainer
      onMouseDown={startResize}
      ref={resizeContainerRef}
      className="resize-container"
    >
      <ResizeHandleSpan className="resize-handle-nw" />
      <ResizeHandleSpan className="resize-handle-ne" />
      <img src={src} alt={alt} ref={resizeImgRef} id="img" />
      <ResizeHandleSpan className="resize-handle-sw" />
      <ResizeHandleSpan className="resize-handle-se" />
    </ResizeContainer>
  );
};

export default ResizableImage;
