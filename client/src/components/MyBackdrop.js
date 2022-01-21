import { Typography, CircularProgress, Backdrop } from "@mui/material";

function MyBackdrop({ message, showBackdrop, setShowBackdrop }) {
  const handleClose = () => {
    //it's not always good for it to be closed on click so sometimes closer wont be passed
    setShowBackdrop && setShowBackdrop(false);
  };

  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showBackdrop} onClick={handleClose}>
      <div style={wrapperStyle}>
        {/* maybe sometimes tehre wont be need for any message  */}
        {message && <Typography variant="body1">{message}</Typography>}

        <CircularProgress color="inherit" />
      </div>
    </Backdrop>
  );
}

export default MyBackdrop;

const wrapperStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
