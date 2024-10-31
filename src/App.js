import logo from './logo.svg';
import './App.css';
import { Excalidraw, useDevice, Footer, MainMenu } from "@excalidraw/excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import React, { useState, useEffect } from 'react'
import { exportToCanvas } from "@excalidraw/excalidraw";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, listAll } from "firebase/storage";
import { db, storage } from "./firebase"; // Make sure to export storage from your firebase.js file
import { debounce } from 'lodash';


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

  

  const debouncedUpdateScene = debounce(() => {
    if (!excalidrawAPI) return;
    const sceneData = {
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
    };
    const files = {
      files: excalidrawAPI.getFiles(),
    }
    excalidrawAPI.updateScene(sceneData);
    saveSceneToFirestore(sceneData);
    // saveFileToFirestore(files);
  }, 1000); // Adjust the delay as needed
  
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  useEffect(() => {
    console.log("Loaded from backend")
    if (excalidrawAPI) {
      loadSceneFromFirestore();
    }
  }, [excalidrawAPI]);
  const saveSceneToFirestore = async () => {
    if (!excalidrawAPI) return;

    try {
      const sceneData = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const fullSceneData = {
        elements: sceneData,
        appState,
      };

      const sceneRef = doc(db, "scenes", "currentScene");
      await setDoc(sceneRef, { sceneData: JSON.stringify(fullSceneData) });
      console.log("Scene saved to Firestore");
      // Backup files after saving scene
      await backupFiles(files);
    } catch (error) {
      console.error("Error saving scene to Firestore:", error);
    }
  };

  const backupFiles = async (files) => {
    console.log("inside backup files")
    if (!sceneData || !files) return;

    for (const [fileId, fileData] of Object.entries(files)) {
      if (fileData.dataURL) {
        try {
          const storageRef = ref(storage, `backups/${fileId}`);
          await uploadString(storageRef, fileData.dataURL, 'data_url');
          console.log(`Backed up file: ${fileId}`);
        } catch (error) {
          console.error(`Error backing up file ${fileId}:`, error);
        }
      }
    }
  };

  const loadSceneFromFirestore = async () => {
    console.log("Loading Scene")
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
    try {
      // Load backed up files from storage
      let loadedFiles = [];
      const storageRef = ref(storage);
      const backupsRef = ref(storageRef, 'backups');
      const backupsList = await listAll(backupsRef);
      
      for (const fileRef of backupsList.items) {
        try {
          const url = await getDownloadURL(fileRef);
          const response = await fetch(url);
          const blob = await response.blob();
          const reader = new FileReader();
          
          await new Promise((resolve, reject) => {
            reader.onload = () => {
              // Create a single file object
              loadedFiles.push({
                id: fileRef.name,
                mimeType: blob.type,
                dataURL: reader.result,
                created: Date.now()
              }
            );
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          console.log(`Loaded file: ${fileRef.name}`);
          console.log("files: ", loadedFiles)
        } catch (error) {
          console.error(`Error loading file ${fileRef.name}:`, error);
        }
      }

      excalidrawAPI.addFiles(loadedFiles); // FIXME
      console.log("Files added to scene");
    }
    catch (error){
      console.error("Error loading files: ", error);
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
            onClick={() => debouncedUpdateScene()}
          >
            updateScene
          </button>
        </Footer>
      </Excalidraw>
    </div>
  );
}
export default App;
