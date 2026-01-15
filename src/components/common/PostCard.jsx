import { Avatar, Card, CardContent, CardHeader, Typography, ImageList, ImageListItem } from '@mui/material';

const PostCard = ({ postData }) => {
  const imageCount = postData.files?.length || 0;

  const getImageSrc = (file) => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  };

  return (
    <div className="flex justify-center my-4">
      <Card sx={{ width: 650, borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#0866ff" }}>
              {postData.createdBy.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={postData.createdBy}
          subheader={postData.createdAt}
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {postData.postText}
          </Typography>
        </CardContent>

        {imageCount === 1 && (
          <img src={getImageSrc(postData.files[0])} alt="Post" className="w-full h-auto object-cover" />
        )}

        {imageCount === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {postData.files.map((file, i) => (
              <img key={i} src={getImageSrc(file)} alt={`Post ${i}`} className="w-full h-64 object-cover" />
            ))}
          </div>
        )}

        {imageCount >= 3 && (
          <ImageList sx={{ width: "100%", maxHeight: 500 }} cols={3} rowHeight={164}>
            {postData.files.map((file, i) => (
              <ImageListItem key={i}>
                <img
                  src={getImageSrc(file)}
                  alt={`Post ${i}`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Card>
    </div>
  );
};


export default PostCard;
