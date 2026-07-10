const ALERT_IMAGE_URL =
  "https://static.vecteezy.com/system/resources/thumbnails/079/214/195/small/chibi-black-cat-wearing-large-headphones-listening-to-music-vector.jpg";

const CenteredAlert = ({ messageText = "alert" }) => {
  return (
    <div className="container text-center mt-4" style={{maxWidth: "320px"}}>
      <img src={ALERT_IMAGE_URL} className="w-100"/>
      <h2 className="mt-3 fs-5">{messageText}</h2>
      <p>tunez</p>
    </div>
  );
};

export default CenteredAlert;
