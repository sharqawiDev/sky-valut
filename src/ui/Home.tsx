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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAllFile, setSelectedAllFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [allFilesWindow, setAllFilesWindow] = useState(null);

  const dropbox = new Dropbox({
    accessToken:
      "sl.CBgsNGR5YDBBrq2WUdZUwnInqZ-E8LsuYs5ndXkG_hqdLZOWK36P2GHOQ6JATameLQ-Fr4_mcIV-JYtIXAYnOIF6TsOP15NJwK7HZO_OonGiUem-aXTOglXR5Q5ntYfiwrBXD_zYN3GcM38ehHMUhjc",
  });

  const handleSignOut = () => {
    signOut(auth).then(() => navigate("/", { replace: true }));
  };

  const handleFileUpload = (event) => {
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
        setFiles(response.result.entries.slice(0, 5));
      })
      .catch((error) => {
        console.error("Error fetching files", error);
      });
  };

  const handleFileClick = (file) => {
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
          if (allFilesWindow) {
            showAllFilesInWindow();
          }
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
    const fileToRename = selectedFile || selectedAllFile;
    if (fileToRename && newFileName) {
      // Extract the file extension from the current file
      const fileExtension = fileToRename.name.split('.').pop();
      
      // Construct the new file name, maintaining the original extension
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
          fetchFiles();
          if (allFilesWindow) {
            showAllFilesInWindow();
          }
        })
        .catch((error) => {
          console.error("Error renaming file", error);
          alert("Error renaming file.");
        });
    } else {
      alert("Please select a file and enter a new name.");
    }
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

  const handleShowAllFiles = () => {
    const newWindow = window.open("", "_blank", "width=600,height=400");
    setAllFilesWindow(newWindow);

    dropbox
      .filesListFolder({ path: "" })
      .then((response) => {
        const files = response.result.entries;
        setSelectedAllFile(null);
        if (newWindow) {
          newWindow.document.write("<h3>All Uploaded Files</h3>");
          files.forEach((file, index) => {
            newWindow.document.write(
              `<div id="file-${index}" style="cursor: pointer; padding: 10px;">${file.name}</div>`
            );
            newWindow.document.getElementById(`file-${index}`).onclick = () => {
              setSelectedAllFile(file);
            };
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching all files", error);
      });
  };

  const showAllFilesInWindow = () => {
    if (allFilesWindow) {
      allFilesWindow.document.body.innerHTML = "<h3>All Uploaded Files</h3>";
      dropbox
        .filesListFolder({ path: "" })
        .then((response) => {
          const files = response.result.entries;
          files.forEach((file, index) => {
            allFilesWindow.document.write(
              `<div id="file-${index}" style="cursor: pointer; padding: 10px;">${file.name}</div>`
            );
            allFilesWindow.document.getElementById(`file-${index}`).onclick = () => {
              setSelectedAllFile(file);
            };
          });
        })
        .catch((error) => {
          console.error("Error fetching all files", error);
        });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__header">
        <img src={logo} alt="Logo" className="home-page__logo" />
        <p>Welcome, {currentUser?.displayName || currentUser?.email}</p>
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
          <div className="uploaded-files-list">
            {files.map((file) => (
              <div
                key={file.id}
                className={`file-item ${
                  selectedFile?.id === file.id ? "selected highlighted" : ""
                }`}
                onClick={() => handleFileClick(file)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedFile?.id === file.id ? "#222222" : "transparent",
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
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter new file name"
            className="rename-input"
          />
          <button className="button-rename" onClick={handleRenameFile}>
            Rename
          </button>
          <button className="button-show-all-files" onClick={handleShowAllFiles}>
            Show All Files
          </button>
        </div>
      </div>
    </div>
  );
};
