import { useState } from "react";
import userImage from '../../assets/user.png'
import { useAuthContext } from "../../context/AuthContext";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Box,
  Modal,
} from "@mui/material";
import {
  ImageOutlined,
  GroupOutlined,
  EmojiEmotionsOutlined,
  LocationOnOutlined,
  GifBoxOutlined,
  VideocamOutlined,
  Close,
} from "@mui/icons-material";
import { Image, Smile, Video } from "lucide-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 0,
  maxHeight: "100vh",
  overflow: "hidden",
};
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { usePostContext } from "../../context/PostContext";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState("Friends");
  const [files, setFiles] = useState([])
  const { state } = useAuthContext();
  const { firstName, surName } = state;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { dispatch: postDispatch } = usePostContext();

  const handleClick = () => {
    const data = {
      id: Math.floor(Math.random() * 897264),
      postText,
      files,
      createdAt: new Date().toLocaleString(),
      createdBy: `${firstName} ${surName}`
    };
    postDispatch({ type: "ADD_POST", payload: data })
    setOpen(false)
    setFiles([]);
    setPostText("")

  }

  return (
    <>
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Card className="rounded-2xl shadow-md border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Create post</h2>
              <IconButton onClick={handleClose} size="small">
                <Close />
              </IconButton>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4">
              {/* Profile section */}
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "green" }}>G</Avatar>}
                title="GeeksforGeeks"
                subheader={
                  <TextField
                    select
                    size="small"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        padding: "4px 8px",
                        fontSize: "0.8rem",
                      },
                    }}
                  >
                    <MenuItem value="Friends">Friends</MenuItem>
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Only me">Only me</MenuItem>
                  </TextField>
                }
              />

              {/* Text area (scrollable) */}
              <CardContent className="pt-0">
                <div
                  className="overflow-y-auto border-none outline-none"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc transparent",
                  }}
                >
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full resize-none bg-transparent text-gray-800 text-base focus:outline-none"
                    rows={5}
                  />
                </div>
              </CardContent>
              {true && <ImageList sx={{ width: 500, height: 100 }}>
                {files.map((item) => (
                  <ImageListItem>
                    <img src={URL.createObjectURL(item)} alt="" />
                  </ImageListItem>
                ))}
              </ImageList>}
            </div>


            {/* Add to your post */}
            <div className="px-4 border-t pt-2 pb-1 text-gray-600 text-sm">
              Add to your post
            </div>
            <CardActions className="flex justify-between px-4">
              <div className="flex space-x-2">
                <IconButton color="success"
                  component="label">
                  <ImageOutlined />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {
                      let newFiles = Object.values(event.target.files)
                      newFiles = files.concat(newFiles)
                      setFiles(newFiles)
                    }
                    }
                    multiple
                  />
                </IconButton>
                <IconButton color="primary">
                  <GroupOutlined />
                </IconButton>
                <IconButton color="warning">
                  <EmojiEmotionsOutlined />
                </IconButton>
                <IconButton color="error">
                  <LocationOnOutlined />
                </IconButton>
                <IconButton color="secondary">
                  <GifBoxOutlined />
                </IconButton>
                <IconButton sx={{ color: "#8b5cf6" }}>
                  <VideocamOutlined />
                </IconButton>
              </div>
            </CardActions>

            {/* Post button */}
            <div className="px-4 pb-4">
              <Button
                onClick={handleClick}
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#1877f2",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#166fe5" },
                  borderRadius: "8px",
                  fontWeight: 500,
                }}

              >
                Post
              </Button>
            </div>
          </Card>
        </Box>
      </Modal>
      <div className="bg-white rounded-2xl shadow-md p-3 w-full flex items-center justify-between gap-1 mt-2">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={userImage}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onClick={handleOpen}
            placeholder={`What's on your mind, ${firstName}?`}
            className="flex-1 bg-gray-100 rounded-full px-6 py-2 text-gray-700 text-sm focus:outline-none cursor-pointer"
          />
        </div>
      </div>

    </>
  );
};



export default CreatePost;
