import React from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import debugBase64 from "./utils/debug-base64";
import sanitize from "./utils/sanitize";

const imgSrcURL =
  "https://images.unsplash.com/photo-1566877633506-9336087c6a20?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=640&q=80";

// const imgSrcURL =
// "https://images.unsplash.com/photo-1504884790557-80daa3a9e621?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80";

const ImageContainer = styled.div`
  background: #f2f2f2;
  transition: all 0.3s linear;
  width: 100%;
  height: 100%;

  & img {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

const OverlayDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
  z-index: 999;
  width: 204px;
  height: 204px;
  border: solid 2px red;
  box-sizing: content-box;
  pointer-events: none;

  &:after,
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 204px;
    height: 40px;
    border-left: dashed 2px red;
    border-right: dashed 2px red;
  }

  &:before {
    top: 0;
    margin-left: -2px;
    margin-top: -40px;
  }

  &:after {
    bottom: 0;
    margin-left: -2px;
    margin-bottom: -40px;
  }
`;

const OverlayInnerDiv = styled.div`
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    display: block;
    width: 40px;
    height: 204px;
    border-top: dashed 2px red;
    border-bottom: dashed 2px red;
  }

  &:before {
    left: 0;
    margin-left: -40px;
    margin-top: -2px;
  }

  &:after {
    right: 0;
    margin-right: -40px;
    margin-top: -2px;
  }
`;

const CropBtn = styled.button`
  position: absolute;
  vertical-align: bottom;
  right: 5px;
  bottom: 5px;
  padding: 6px 10px;
  z-index: 999;
  background-color: rgb(222, 60, 80);
  border: none;
  border-radius: 5px;
  color: #fff;
`;

const CanvasRefImg = styled.img`
  //   visibility: hidden;
  position: absolute;
  right: 0;
  top: 0;
`;

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
  //   transition: "all 0.1s linear"
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      actualAspectRatio: 1,
      width: `200px`,
      height: `200px`,
      originalImgWidth: `0px`,
      originalImgHeight: `0px`,
      x: 10,
      y: 10
    };
    this.resizeCanvasRef = null;
    this.imageRef = null;
  }
  componentDidMount() {
    this.resizeCanvasRef = document.createElement("canvas");
  }
  paintCanvas = () => {
    const sanitizedWidth = sanitize(this.state.width);
    const sanitizedHeight = sanitize(this.state.height);

    this.resizeCanvasRef.width = sanitizedWidth;
    this.resizeCanvasRef.height = sanitizedHeight;
    this.resizeCanvasRef
      .getContext("2d")
      .drawImage(this.imageRef, 0, 0, sanitizedWidth, sanitizedHeight);

    this.canvasRefImg.setAttribute(
      "src",
      this.resizeCanvasRef.toDataURL("image/png", 1)
    );
  };
  cropImg = () => {
    /*********************************************************************/
    /* issue - poor image quality of resized b64 img - downsampling :( */
    /*********************************************************************/
    const cropCanvas = document.createElement("canvas");
    const left =
      this.cropOverlayRef.getBoundingClientRect().left -
      this.imgContainerRef.getBoundingClientRect().left;
    const top =
      this.cropOverlayRef.getBoundingClientRect().top -
      this.imgContainerRef.getBoundingClientRect().top;

    const width = this.cropOverlayRef.offsetWidth;
    const height = this.cropOverlayRef.offsetHeight;

    cropCanvas.width = this.cropOverlayRef.offsetWidth;
    cropCanvas.height = this.cropOverlayRef.offsetHeight;

    cropCanvas
      .getContext("2d")
      .drawImage(
        this.canvasRefImg,
        left,
        top,
        width,
        height,
        0,
        0,
        width,
        height
      );

    // png
    const imageData = cropCanvas.toDataURL("image/png", 1);
    debugBase64(imageData);
  };
  onImageLoad = e => {
    const newImg = new Image();
    newImg.src = e.target.src;
    newImg.onload = () => {
      this.setState({
        width: newImg.width,
        height: newImg.height,
        originalImgWidth: newImg.width,
        originalImgHeight: newImg.height,
        actualAspectRatio: newImg.width / newImg.height
      });
    };
  };
  render() {
    return (
      <div>
        <Rnd
          lockAspectRatio={this.state.actualAspectRatio}
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState(
              {
                width: ref.style.width,
                height: ref.style.height,
                ...position
              },
              () => {
                this.paintCanvas();
              }
            );
          }}
        >
          <ImageContainer
            ref={imgContainerRef => (this.imgContainerRef = imgContainerRef)}
          >
            <img
              onLoad={this.onImageLoad}
              src={imgSrcURL}
              alt="test99"
              ref={imageRef => (this.imageRef = imageRef)}
              crossOrigin="anonymous"
            />
          </ImageContainer>
        </Rnd>
        <OverlayDiv
          ref={cropOverlayRef => (this.cropOverlayRef = cropOverlayRef)}
        >
          <OverlayInnerDiv />
        </OverlayDiv>
        <CropBtn onClick={this.cropImg}>Crop</CropBtn>
        <button
          onClick={() => {
            this.setState(
              {
                width: this.state.originalImgWidth,
                height: this.state.originalImgHeight
              },
              () => {
                this.imageRef.style.height = "100%";
                this.imageRef.style.width = "100%";
              }
            );
          }}
        >
          reset
        </button>
        <CanvasRefImg
          ref={canvasRefImg => (this.canvasRefImg = canvasRefImg)}
          className="canvas-ref-img"
          src={imgSrcURL}
          alt="canvas-ref-img"
          crossOrigin="anonymous"
        />
      </div>
    );
  }
}

export default App;
