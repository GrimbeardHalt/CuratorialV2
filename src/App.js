import logo from './logo.svg';
import './App.css';
import { Excalidraw } from "@excalidraw/excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import React from 'react'

function App() {
  const [links, setLinks] = React.useState([]);

  const handleLinkPaste = (data, event) => {
    const newLink = {
      link: data.text,
      position: { x: 100, y: 100 + links.length * 300 } // Adjust position for each new link
    };
    setLinks([...links, newLink]);
  };

  const embeddedLinkElements = links.map((linkData, index) => ({
    type: "embeddable",
    x: linkData.position.x,
    y: linkData.position.y,
    width: 331,
    height: 271,
    link: linkData.link,
    id: `embeddedLink-${index}`,
  }));

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
    ...embeddedLinkElements
  ]);

  return (
    <div style={{ height: "500px" }}>
      <Excalidraw
        initialData={{
          elements,
          appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
          scrollToContent: true,
        }}
        onPaste={handleLinkPaste}
      />
    </div>
  );
}
export default App;
