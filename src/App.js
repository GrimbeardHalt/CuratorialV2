import logo from './logo.svg';
import './App.css';
import { Excalidraw } from "@excalidraw/excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import React from 'react'

function App() {
  const [links, setLinks] = React.useState([]);

  const handleLinkPaste = (link) => {
    setLinks([...links, { link, position: { x: 100, y: 100 } }]);
  };
  const elements = convertToExcalidrawElements([
    {
      type: "rectangle",
      x: 40, // 110 + 200
      y: 110,
      width: 280,
      height: 100,
      id: "1",
    },
    {
      type: "rectangle",
      x: 40, // 110 + 200
      y: 220,
      width: 280,
      height: 100,
      id: "2",
    },
    {
      type: "rectangle",
      x: 40, // 110 + 200
      y: 330,
      width: 280,
      height: 100,
      id: "3",
    },
    {
      type: "frame",
      children: ["1", "2", "3"],
      name: "Tutorial A",
      id: "TutorialA",
      x: 240, // 40 + 200
      y: 330,
      boundElements: [
        {
          "id": "ABArrow",
          "type": "arrow"
        }
      ],
    },
    {
      type: "rectangle",
      x: 460, // 260 + 200
      y: 110,
      width: 280,
      height: 100,
      id: "4",
    },
    {
      type: "rectangle",
      x: 460, // 260 + 200
      y: 220,
      width: 280,
      height: 100,
      id: "5",
    },
    {
      type: "rectangle",
      x: 460, // 260 + 200
      y: 330,
      width: 280,
      height: 100,
      id: "6",
    },
    {
      type: "frame",
      children: ["4", "5", "6"],
      name: "Tutorial B",
      id: "TutorialB",
      x: 460, // 260 + 200
      y: 330,
      boundElements: [
        {
          "id": "ABArrow",
          "type": "arrow"
        }
      ],
    },
    {
      type: "arrow",
      id: "ABArrow",
      x: 360, // 160 + 200
      y: 420,
      strokeColor: "#e67700",
      startBinding: "TutorialA",
      endBinding: "TutorialB"
    },
  ]);
  return (
    <div style={{ height: "500px" }}>
      <Excalidraw
        initialData={{
          elements,
          appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
          scrollToContent: true,
        }}
      />
    </div>
  );
}
export default App;
