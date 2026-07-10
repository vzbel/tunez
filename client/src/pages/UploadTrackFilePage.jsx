import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { setTimedAlert } from "../utils/alerts.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../services/tracks.js";
import ProgressBar from "../components/ProgressBar.jsx";
import { getPresignedUploadURL } from "../services/tracks.js";
import CenteredAlert from "../components/CenteredAlert.jsx";

const UploadTrackFilePage = ({ submitCallback }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // integer
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [alert, setAlert] = useState(null);
  const [user] = useContext(AuthContext);

  if (!user) {
    return <CenteredAlert messageText="Log in to upload tracks" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return window.alert("Log in to upload tracks");
    }
    try {
      setIsSubmitting(true);
      setPercentCompleted(0);

      // get file from form
      const trackFormInput = document.getElementById("create-track-audio");
      const trackFile = trackFormInput.files[0];
      const trackObjectPath = `tracks/${uuidv4()}.mp3`;

      // track upload progress
      const uploadConfig = {
        onUploadProgress: (progressEvent) => {
          setPercentCompleted(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        },
        headers: {
          "Content-Type": "audio/mpeg",
        },
      };

      // get a presigned url to upload the track to
      const uploadUrl = await getPresignedUploadURL(trackObjectPath);
      const response = await axios.put(uploadUrl, trackFile, uploadConfig);
      if (response.status !== 200) {
        throw new Error("upload failed");
      }
      submitCallback(trackObjectPath);
    } catch {
      setTimedAlert("danger", "Failed to upload audio file", setAlert);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setPercentCompleted(0);
      }, 3000);
    }
  };

  return (
    <form
      className="card mx-auto my-4 p-3"
      style={{ maxWidth: "500px" }}
      onSubmit={handleSubmit}
    >
      <h2>Upload your audio file.</h2>
      <p>For best quality, use the MP3 file format.</p>

      {/* mp3 file input */}
      <input
        type="file"
        accept=".mp3, audio/mpeg"
        aria-label="Track audio upload field"
        name="audio"
        id="create-track-audio"
        className="form-control mb-3"
        disabled={isSubmitting}
        required
      />

      {isSubmitting && <ProgressBar currentProgress={percentCompleted} />}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Upload Track
      </button>

      {/* error feedback */}
      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default UploadTrackFilePage;
