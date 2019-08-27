import React from "react";
import styled from "styled-components";
import $ from "jquery";

// rip jquery

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

class ResizableImage extends React.Component {
  constructor(props) {
    super(props);
    this.resizeCanvasRef = null;
    this.state = {
      width: 0,
      height: 0,
      offsetLeft: 0,
      offsetTop: 0,
      mouseX: 0,
      mouseY: 0
    };
  }
  saveEventState = e => {
    this.setState({
      width: this.resizeContainerRef.offsetWidth,
      height: this.resizeContainerRef.offsetHeight,
      offsetLeft: this.resizeContainerRef.offsetLeft,
      offsetTop: this.resizeContainerRef.offsetTop,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };
  startResize = e => {
    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);
    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("mouseup", this.endResize);
  };
  endResize = e => {
    e.preventDefault();
    window.removeEventListener("mouseup", this.endResize);
    window.removeEventListener("touchend", this.endResize);

    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("touchmove", this.resizing);
  };
  resizeImage = (width, height) => {
    this.resizeCanvasRef.width = width;
    this.resizeCanvasRef.height = height;
    this.resizeCanvasRef
      .getContext("2d")
      .drawImage(originalImg, 0, 0, width, height);
    const img = this.resizeImgRef;
    img.src = this.resizeCanvasRef.toDataURL("image/png");
  };
  // default resize
  // resizing = e => {
  //   const width = e.clientX - this.state.offsetLeft;
  //   let height = e.clientY - this.state.offsetTop;
  //   if (constrain || e.shiftKey) {
  //     height = (width / originalImg.width) * originalImg.height;
  //   }
  //   if (
  //     width > minWidth &&
  //     height > minHeight &&
  //     width < maxWidth &&
  //     height < maxHeight
  //   ) {
  //     this.resizeImage(width, height);
  //   }
  // };
  resizing = e => {
    if (!e || !e.target) {
      return;
    }

    let width = e.clientX - this.state.offsetLeft;
    let height = e.clientY - this.state.offsetTop;
    let left = this.state.offsetLeft;
    let top = this.state.offsetTop;

    if (e.target.classList.contains("resize-handle-se")) {
      width = e.clientX - this.state.offsetLeft;
      height = e.clientY - this.state.offsetTop;
    } else if (e.target.classList.contains("resize-handle-sw")) {
      width = this.state.width - (e.clientX - this.state.offsetLeft);
      height = e.clientY - this.state.offsetTop;
      left = e.clientX;
      top = this.state.offsetTop;
    } else if (e.target.classList.contains("resize-handle-nw")) {
      width = this.state.width - (e.clientX - this.state.offsetLeft);
      height = this.state.height - (e.clientY - this.state.offsetTop);
      left = e.clientX;
      top = e.clientY;
      if (constrain || e.shiftKey) {
        top =
          e.clientY -
          ((width / originalImg.width) * originalImg.height - height);
      }
    } else if (e.target.classList.contains("resize-handle-ne")) {
      width = e.clientX - this.state.offsetLeft;
      height = this.state.height - (e.clientY - this.state.offsetTop);
      left = this.state.offsetLeft;
      top = e.clientY;
      if (constrain || e.shiftKey) {
        top =
          e.clientY -
          ((width / originalImg.width) * originalImg.height - height);
      }
    }

    if (constrain || e.shiftKey) {
      height = (width / originalImg.width) * originalImg.height;
    }
    if (
      width > minWidth &&
      height > minHeight &&
      width < maxWidth &&
      height < maxHeight
    ) {
      this.resizeImage(width, height);
      $(".resize-container").offset({ left: left, top: top });
    }
  };
  startMoving = e => {
    console.log("moving..");
    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);
    window.addEventListener("mousemove", this.moving);
    window.addEventListener("mouseup", this.endMoving);
  };
  endMoving = e => {
    e.preventDefault();
    window.removeEventListener("mouseup", this.endMoving);
    window.removeEventListener("mousemove", this.moving);
  };
  moving = e => {
    e.preventDefault();
    e.stopPropagation();

    const { mouseX, mouseY, offsetLeft, offsetTop } = this.state;

    $(".resize-container").offset({
      left: e.clientX - (mouseX - offsetLeft),
      top: e.clientY - (mouseY - offsetTop)
    });

    // this.resizeContainerRef.style.left =
    //   e.clientX - (this.state.mouseX - this.state.offsetLeft);
    // this.resizeContainerRef.style.left =
    //   e.clientY - (this.state.mouseY - this.state.offsetTop);
  };
  componentDidMount() {
    this.resizeCanvasRef = document.createElement("canvas");
  }
  onMouseDown = e => {
    this.startResize(e);
    this.startMoving(e);
  };
  render() {
    return (
      <ResizeContainer
        onMouseDown={this.onMouseDown}
        ref={resizeContainerRef =>
          (this.resizeContainerRef = resizeContainerRef)
        }
        className="resize-container"
      >
        <ResizeHandleSpan className="resize-handle-nw" />
        <ResizeHandleSpan className="resize-handle-ne" />
        <img
          src={this.props.src}
          alt={this.props.alt}
          ref={resizeImgRef => (this.resizeImgRef = resizeImgRef)}
          id="img"
        />
        <ResizeHandleSpan className="resize-handle-sw" />
        <ResizeHandleSpan className="resize-handle-se" />
      </ResizeContainer>
    );
  }
}

export default ResizableImage;
