import logo from './logo.svg';
import './App.css';
import { Excalidraw, useDevice, Footer, MainMenu } from "@excalidraw/excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import React, { useState, useEffect } from 'react'
import { exportToCanvas } from "@excalidraw/excalidraw";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Make sure to export storage from your firebase.js file

function App() {
  const [links, setLinks] = useState([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [files, setFiles] = useState([]);
  const [canvasUrl, setCanvasUrl] = useState("");

  const handleLinkPaste = (data, event) => {
    console.log("TODO Create new link");
  };

  const embeddedLinkElements = links.map((linkData, index) => ({
    type: "embeddable",
    x: linkData.position.x,
    // y: linkData.position.y,
    y: 100,
    width: 331,
    height: 271,
    link: linkData.link,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupId: "embeddedLinkGroup",

    id: `embeddedLink-${index}`,
  }));

  

  const updateScene = () => {
    if (!excalidrawAPI) return;
    const sceneData = {
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
      // files: excalidrawAPI.setFiles(),
    };
    excalidrawAPI.updateScene(sceneData);
    saveSceneToFirestore(sceneData); // Save scene to Firestore
  };
  
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  useEffect(() => {
    if (excalidrawAPI) {
      loadSceneFromFirestore();
    }
  }, [excalidrawAPI]);

  const saveSceneToFirestore = async (sceneData) => {
    try {
      const sceneRef = doc(db, "scenes", "currentScene");
      await setDoc(sceneRef, { sceneData: JSON.stringify(sceneData) });
      console.log("Scene saved to Firestore");
    } catch (error) {
      console.error("Error saving scene to Firestore:", error);
    }
  };

  const loadSceneFromFirestore = async () => {
    try {
      const sceneRef = doc(db, "scenes", "currentScene");
      const sceneDoc = await getDoc(sceneRef);
      if (sceneDoc.exists()) {
        const loadedSceneData = JSON.parse(sceneDoc.data().sceneData);
        setSceneData(loadedSceneData);
        if (excalidrawAPI) {
          excalidrawAPI.updateScene(loadedSceneData);
        }
        console.log("Scene loaded from Firestore");
      } else {
        console.log("No scene found in Firestore");
      }
    } catch (error) {
      console.error("Error loading scene from Firestore:", error);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Excalidraw
        initialData={sceneData || {
          appState: {
            viewBackgroundColor: "#edf2ff",
            collaborators: [],
            zenModeEnabled: false,
          },
          scrollToContent: true,
        }}
        onPaste={handleLinkPaste}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        viewBackgroundColor="#edf2ff"
        UIOptions={{
          autoResize: true,
        }}
        zenModeEnabled={false}
        gridModeEnabled={true}
      >
        <Footer>
          <button
            className="custom-footer"
            onClick={() => updateScene()}
          >
            updateScene
          </button>
        </Footer>
      </Excalidraw>
    </div>
  );
}
export default App;
