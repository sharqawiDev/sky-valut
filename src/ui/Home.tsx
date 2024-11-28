/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import firebaseApp from "../constants";
import { getAuth } from "firebase/auth";
import { Dropbox } from "dropbox";
import logo from "../assets/logo_resized_50x50.png";
import "./App.scss";

export const Home = () => {
  const auth = getAuth(firebaseApp);
  const { currentUser } = auth;
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAllFile, setSelectedAllFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropbox = new Dropbox({
    accessToken:
      "sl.CBhtFjx6H4ekD_Le1Bo6mqT6mvnvskrOCoc-wL2oGu_UAxe9WiloRuJfzeE8OUHgEKvIMQP5ALsi-7XQJZV_MWPt8SMuEVoml_5hPOW3JhFmbGL0uCfZV8pPsUjV5eeJ-w9jwxuh9qVuptYtNaxzmSc",
  });

  const handleSignOut = () => {
    signOut(auth).then(() => navigate("/", { replace: true }));
  };

  const handleFileUpload = (event: { target: { files: any[] } }) => {
    const file = event.target.files?.[0];
    if (file !== null && file !== undefined) {
      dropbox
        .filesUpload({ path: `/${file.name}`, contents: file })
        .then((response) => {
          console.log("File uploaded", response);
          alert("File uploaded successfully!");
          fetchFiles();
        })
        .catch((error) => {
          console.error("Upload failed", error);
          alert("Error uploading file.");
        });
    }
  };

  const fetchFiles = () => {
    dropbox
      .filesListFolder({ path: "" })
      .then((response) => {
        setFiles(response.result.entries.slice(0, 50));
        setFilteredFiles(response.result.entries.slice(0, 50));
      })
      .catch((error) => {
        console.error("Error fetching files", error);
      });
  };

  const handleFileClick = (file: React.SetStateAction<null>) => {
    setSelectedFile(file);
  };

  const handleDeleteFile = () => {
    const fileToDelete = selectedFile || selectedAllFile;
    if (fileToDelete) {
      dropbox
        .filesDeleteV2({ path: fileToDelete.path_lower })
        .then(() => {
          alert("File deleted successfully!");
          setSelectedFile(null);
          setSelectedAllFile(null);
          fetchFiles();
        })
        .catch((error) => {
          console.error("Error deleting file", error);
          alert("Error deleting file.");
        });
    } else {
      alert("Please select a file to delete.");
    }
  };

  const handleRenameFile = () => {
    setShowRenameInput(true);
  };

  const handleRenameSubmit = () => {
    const fileToRename = selectedFile || selectedAllFile;
    if (fileToRename && newFileName) {
      const fileExtension = fileToRename.name.split(".").pop();
      const newFullFileName = `${newFileName}.${fileExtension}`;

      dropbox
        .filesMoveV2({
          from_path: fileToRename.path_lower,
          to_path: `/${newFullFileName}`,
        })
        .then(() => {
          alert("File renamed successfully!");
          setSelectedFile(null);
          setSelectedAllFile(null);
          setNewFileName("");
          setShowRenameInput(false);
          fetchFiles();
        })
        .catch((error) => {
          console.error("Error renaming file", error);
          alert("Error renaming file.");
        });
    } else {
      alert("Please enter a new name.");
    }
  };

  const handleRenameCancel = () => {
    setShowRenameInput(false);
    setNewFileName("");
  };

  const handleDownloadFile = () => {
    const fileToDownload = selectedFile || selectedAllFile;
    if (fileToDownload) {
      dropbox
        .filesDownload({ path: fileToDownload.path_lower })
        .then((response) => {
          const blob = response.result.fileBlob;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileToDownload.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
          console.error("Error downloading file", error);
          alert("Error downloading file.");
        });
    } else {
      alert("Please select a file to download.");
    }
  };

  const handleSearch = (event: { target: { value: string } }) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFiles(
      files.filter((file) => file.name.toLowerCase().includes(query))
    );
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__header">
        <img src={logo} alt="Logo" className="home-page__logo" />
        <p>Welcome, {currentUser?.displayName }</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="file-upload-section">
        <div className="file-upload-input-wrapper">
          <input
            type="file"
            onChange={handleFileUpload}
            className="file-upload-input"
          />
        </div>
      </div>

      <div className="file-display-section">
        <div className="file-list">
          <h3>Uploaded Files</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search files"
            className="file-search-input"
          />
          <div
            className="uploaded-files-grid scrollable"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`file-item ${
                  selectedFile?.id === file.id ? "selected highlighted" : ""
                }`}
                onClick={() => handleFileClick(file)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  backgroundColor:
                    selectedFile?.id === file.id ? "#27334b" : "#1c1f25",
                  color: "#ffffff",
                }}
              >
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="file-options">
          <button className="button-download" onClick={handleDownloadFile}>
            Download
          </button>
          <button className="button-delete" onClick={handleDeleteFile}>
            Delete
          </button>
          <button className="button-rename" onClick={handleRenameFile}>
            Rename
          </button>
          {showRenameInput && (
            <div className="rename-input-section">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
                className="rename-input"
              />
              <button
                className="button-rename-submit"
                onClick={handleRenameSubmit}
              >
                Submit
              </button>
              <button
                className="button-rename-cancel"
                onClick={handleRenameCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
