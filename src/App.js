import React from "react";
// import ResizableImage from "./components/resizable-image";
import ResizableImage from "./components/resizable-image/resizable-image-class-with-jquery";
import { imgSrcURL } from "./components/resizable-image";

const App = () => (
  <div>
    <h2>Resizable Image - React + Canvas</h2>
    <ResizableImage src={imgSrcURL} alt="lady" />
  </div>
);

export default App;
