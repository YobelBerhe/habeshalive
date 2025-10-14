import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer and process available globally for TensorFlow.js dependencies
window.Buffer = Buffer;
window.process = process;

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
