import React, { useState } from 'react';
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, Modal } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";
  import "./postStyle.css"

const PostModal = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    open,
    setOpen
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://192.168.226.112:3001//posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
    return (
      <div>
        <Modal
          open={open}
          onClose={()=>{
            setOpen(!open)
          }} 
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            borderRadius :  "10px",
            // border : "2px solid white"
          }}
        >
          <Box
          sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vh', 
            height: '90vh', 
            overflow: 'auto', 
            bgcolor: 'background.paper',
            boxShadow: 24,
            p:2,
            '@media (max-width: 600px)': {
                width: '90%', 
                maxHeight: '70%', 
              },
          }}
        >
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (/\.(mp4|avi|mov)$/i.test(picturePath) ? 
      <div className="image-grid">
      <video autoPlay controls loop
      style={{ borderRadius: "0.75rem", marginTop: "2rem", height:"100%"}}
      >
      <source 
      src={`http://192.168.226.112:3001/assets/${picturePath}`}
      type="video/mp4" 
      maxWidth="50%"
      maxHeight="100%"
      objectFit="cover"
      alt="post"
      />
      Your browser does not support the video tag.
    </video>
      </div>
      : 
      (
        <img
          width="100%"
          height="60%"
          objectFit="cover"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://192.168.226.112:3001/assets/${picturePath}`}
        />
      ) )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
    </Box>
        </Modal>
      </div>
    );
  };

  export default PostModal;


  