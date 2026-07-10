import { useState } from "react";
import UploadTrackFilePage from "./UploadTrackFilePage.jsx";
import UploadTrackDataPage from "./UploadTrackDataPage.jsx";
import CenteredAlert from "../components/CenteredAlert.jsx";
import { Link } from "react-router";

const UPLOAD_FORM_STEPS = {
  FILE: "file",
  TRACK_DATA: "trackData",
  DONE: "done",
};

/**
 * serves as a multi-step form for uploading a track
 */
const UploadTrackPage = () => {
  const [currentFormStep, setCurrentFormStep] = useState(
    UPLOAD_FORM_STEPS.FILE,
  );
  const [trackObjectPath, setTrackObjectPath] = useState(null);

  switch (currentFormStep) {
    case UPLOAD_FORM_STEPS.FILE:
      return (
        <UploadTrackFilePage
          submitCallback={(objectPath) => {
            setTrackObjectPath(objectPath);
            setCurrentFormStep(UPLOAD_FORM_STEPS.TRACK_DATA);
          }}
        />
      );
    case UPLOAD_FORM_STEPS.TRACK_DATA:
      return (
        <UploadTrackDataPage
          trackObjectPath={trackObjectPath}
          submitCallback={() => {
            setCurrentFormStep(UPLOAD_FORM_STEPS.DONE);
          }}
        />
      );
    case UPLOAD_FORM_STEPS.DONE:
      return (
        <div
          className="container mx-auto text-center"
          style={{ maxWidth: "400px" }}
        >
          <CenteredAlert messageText="Track successfully uploaded!" />
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      );
  }

  return <p>Something went wrong!</p>;
};

export default UploadTrackPage;
