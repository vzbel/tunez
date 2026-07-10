import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

import { createTrack } from "../services/tracks.js";
import { setTimedAlert } from "../utils/alerts.js";
import CenteredAlert from "../components/CenteredAlert.jsx";

const DEFAULT_ALBUM_ART_URL =
  "https://upload.wikimedia.org/wikipedia/commons/3/3c/No-album-art.png";

const UploadTrackDataPage = ({ trackObjectPath, submitCallback }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  // the default form is also needed when clearing the form after submission
  const defaultForm = {
    coverUrl: "",
    title: "",
    artists: "", // comma-separated list of artists (e.g. artist1, artist2)
    genre: "",
    description: "",
    objectPath: trackObjectPath,
  };
  const [form, setForm] = useState({ ...defaultForm });

  // only logged in users can upload songs
  if (!user) {
    return <CenteredAlert messageText="Log in to upload tracks" />;
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return window.alert("Log in to upload tracks");
    }

    setIsSubmitting(true);

    // split the artists string into an array
    // and remove excess whitespace
    const artistsTemp = form.artists.split(",");
    const artists = [];
    for (const artist of artistsTemp) {
      const trimmedArtist = artist.trim();
      if (trimmedArtist.length > 0) {
        artists.push(trimmedArtist);
      }
    }

    // upload track to db
    const track = { ...form, artists };
    try {
      await createTrack(track);
      submitCallback();
    } catch {
      setTimedAlert("danger", "Failed to upload track data", setAlert);
    } finally {
      setIsSubmitting(false);
      setForm({ ...defaultForm });
    }
  };

  return (
    <form
      className="card mx-auto my-4 p-3"
      style={{ maxWidth: "500px" }}
      onSubmit={handleSubmit}
    >
      <h2 className="mb-3">Upload Track</h2>

      {/* cover art url */}
      <div
        style={{ height: "220px", maxWidth: "220px" }}
        className="mx-auto mb-4"
      >
        <img
          src={form.coverUrl || DEFAULT_ALBUM_ART_URL}
          className="h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>
      <label htmlFor="create-track-coverUrl" className="form-label">
        Cover Art URL
      </label>
      <input
        type="url"
        name="coverUrl"
        id="create-track-coverUrl"
        className="form-control mb-3"
        value={form.coverUrl}
        onChange={handleInputChange}
        placeholder="https://example.com/images/my-image"
        disabled={isSubmitting}
      />

      {/* title */}
      <label htmlFor="create-track-title" className="form-label">
        Track Title
      </label>
      <input
        type="text"
        name="title"
        id="create-track-title"
        className="form-control mb-3"
        value={form.title}
        onChange={handleInputChange}
        placeholder="My Track"
        disabled={isSubmitting}
        required
      />

      {/* artists */}
      <label htmlFor="create-track-artists" className="form-label">
        Artist(s)
      </label>
      <input
        type="text"
        name="artists"
        id="create-track-artists"
        className="form-control mb-3"
        value={form.artists}
        onChange={handleInputChange}
        placeholder="MyArtistName"
        disabled={isSubmitting}
        required
      />
      <small className="mb-3 text-secondary">
        Tip: Use a comma-separated list of artists (e.g. artist1, artist2)
      </small>

      {/* genre */}
      <label htmlFor="create-track-genre" className="form-label">
        Genre
      </label>
      <input
        type="text"
        name="genre"
        id="create-track-genre"
        className="form-control mb-3"
        value={form.genre}
        onChange={handleInputChange}
        placeholder="Any Genre"
        disabled={isSubmitting}
        required
      />

      {/* description */}
      <label htmlFor="create-track-description" className="form-label">
        Description
      </label>
      <textarea
        type="text"
        name="description"
        id="create-track-description"
        className="form-control mb-3"
        style={{ resize: "none" }}
        value={form.description}
        onChange={handleInputChange}
        placeholder="One of my newest tracks inspired by..."
        disabled={isSubmitting}
        maxLength={1000}
      ></textarea>

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Upload Track
      </button>

      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default UploadTrackDataPage;
