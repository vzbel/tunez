import axios from "axios";

const BASE_URL = "/api/tracks";

// objectPath represents the storage path
// (uuid with an .mp3 extension)
// of the file in the object storage bucket
export const getPresignedUploadURL = async (objectPath) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload-url`, {
      objectPath,
    });
    return response.data.url;
  } catch (error) {
    console.error(error);
    throw Error;
  }
};

// track must match database schema and have a list of artists
// returns the inserted track, which includes its artist list
export const createTrack = async (track) => {
  try {
    const response = await axios.post(`${BASE_URL}`, track);
    return response.data;
  } catch (error) {
    console.error(error);
    throw Error;
  }
};
