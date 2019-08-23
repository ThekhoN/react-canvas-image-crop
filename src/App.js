import React from "react";
import ResizableImage from "./components/resizable-image";
import { imgSrcURL } from "./components/resizable-image";

const App = () => (
  <div>
    <h2>Resizable Image - React + Canvas</h2>
    <ResizableImage src={imgSrcURL} alt="lady" />
  </div>
);

export default App;
