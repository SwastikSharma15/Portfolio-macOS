import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { Download, ExternalLink } from "lucide-react/dist/esm/icons";
import React, { useState, lazy, Suspense } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const LazyDocument = lazy(() =>
  import("react-pdf").then(m => ({ default: m.Document }))
);

const LazyPage = lazy(() =>
  import("react-pdf").then(m => ({ default: m.Page }))
);

const Resume = () => {
  const [numPages, setNumPages] = useState(null);

  return (
    // Make the window content fill available height and center the PDF
    <div className="flex flex-col h-full">
      {/* Header */}
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Swastik_Sharma_Frontend_Developer_Resume.pdf</h2>
        
        <a
          href="files/Swastik_Sharma_Frontend_Developer_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Resume in New Tab"
        >
        <ExternalLink className="icon mr-3" />
        </a>

        <a
          href="files/Swastik_Sharma_Frontend_Developer_Resume.pdf"
          download
          title="Download Resume"
        >
          <Download className="icon" />
        </a>
      </div>

      {/* Scrollable content that grows to fill space (works when maximized) */}
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4">
        <div className="flex justify-center py-4">
          <Suspense fallback={<div>Loading PDF...</div>}>
            <Document
              file="files/Swastik_Sharma_Frontend_Developer_Resume.pdf"
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  scale={1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-6 shadow-md"
                />
              ))}
            </Document>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
