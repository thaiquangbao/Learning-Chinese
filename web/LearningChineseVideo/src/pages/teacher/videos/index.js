import {
  Box,
  CircularProgress,
  Container,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import GridVideoAdminCard from "src/components/grid-video-admin-card";
import { Layout as TeacherLayout } from "src/layouts/teacher-layout/layout";
import UpdateVideoDialog from "src/sections/update-video-dialog";
import { delVideo, getVideos } from "src/services/api/video-api";

const Page = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchVideo = () => {
    setLoading(true);
    getVideos()
      .then((res) => {
        setVideos(res);
      })
      .catch((err) => console.log())
      .finally(() => setLoading(false));
  };

  const deleteVideo = (id) => {
    delVideo(id)
      .then(() => {
        console.log(`Video ${id} is successfully deleted.`);
        fetchVideo();
        enqueueSnackbar(`Đã xóa thành công video ${id}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(`Xóa video thất bại`, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      });
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <>
      <Head>
        <title>Danh sách video</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} paddingBottom="30px">
            <Typography variant="h4">Danh sách video ({videos.length})</Typography>
            {loading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              _.map(videos, (video) => (
                <GridVideoAdminCard
                  {...video}
                  onDeleteItem={deleteVideo}
                  onClick={() => setEditingVideo(video)}
                />
              ))
            )}
          </Stack>
        </Container>
        <UpdateVideoDialog
          video={editingVideo}
          onUpdated={fetchVideo}
          handleClose={() => {
            setEditingVideo();
          }}
          open={Boolean(editingVideo)}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <TeacherLayout>{page}</TeacherLayout>;

export default Page;
