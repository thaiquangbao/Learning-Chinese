import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import GridTeacherCourseCard from "src/components/teacher/grid-course-teacher-card";
import { Layout as TeacherLayout } from "src/layouts/teacher-layout/layout";
import UpdateCourseDialog from "src/sections/course/update-course-dialog";
import { deleteCourse, getCourses, requestCourse } from "src/services/api/course-api";
const Page = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const fetchCourses = () => {
    setLoading(true);
    getCourses()
      .then((res) => {
        console.log(res);

        setCourses(res);
      })
      .catch((err) => console.log(e))
      .finally(() => setLoading(false));
  };
  const deleteByCourse = (id) => {
    deleteCourse(id)
      .then(() => {
        console.log(`Course ${id} is successfully deleted.`);
        fetchCourses();
        enqueueSnackbar(`Đã xóa thành công khóa học ${id}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(`Xóa khóa học thất bại`, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      });
  };
  const requestByCourse = (id) => {
    requestCourse(id)
      .then(() => {
        fetchCourses();
        enqueueSnackbar(`Đã gửi yêu cầu xét duyệt thành công khóa học ${id}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      })
      .catch((err) => {
        if (err === "Course not found") {
          enqueueSnackbar(`Khóa học không tồn tại`, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        } else {
          enqueueSnackbar(`Gửi yêu cầu xét duyệt thất bại`, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        }
      });
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    if (role === "ALL") {
      fetchCourses();
    } else if (role === "QUEUE") {
      setLoading(true);
      getCourses()
        .then((res) => {
          const filteredCourses = res.filter((course) => course.status === "QUEUE");
          setCourses(filteredCourses);
        })
        .catch((err) => console.log(e))
        .finally(() => setLoading(false));
    } else if (role === "ACCEPTED") {
      setLoading(true);
      getCourses()
        .then((res) => {
          const filteredCourses = res.filter((course) => course.status === "ACCEPTED");
          setCourses(filteredCourses);
        })
        .catch((err) => console.log(e))
        .finally(() => setLoading(false));
    } else if (role === "REJECTED") {
      setLoading(true);
      getCourses()
        .then((res) => {
          const filteredCourses = res.filter((course) => course.status === "REJECTED");
          setCourses(filteredCourses);
        })
        .catch((err) => console.log(e))
        .finally(() => setLoading(false));
    }
  };
  return (
    <>
      <Head>
        <title>Danh sách khóa học</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} paddingBottom="30px">
            <Typography variant="h4">Danh sách khóa học ({courses.length})</Typography>
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">Chọn trạng thái khóa học</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="role"
                fullWidth
                value={selectedRole}
                onChange={handleRoleChange}
                isSearchable
                label="Khóa học"
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="QUEUE">Chờ duyệt</MenuItem>
                <MenuItem value="ACCEPTED">Đã duyệt</MenuItem>
                <MenuItem value="REJECTED">Đã từ chối</MenuItem>
              </Select>
            </FormControl>
            {loading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              courses.map((course, index) => (
                <GridTeacherCourseCard
                  key={index}
                  {...course}
                  onDeleteItem={deleteByCourse}
                  onClick={() => setEditingCourse(course)}
                  onRequest={requestByCourse}
                />
              ))
            )}
          </Stack>
        </Container>
        <UpdateCourseDialog
          course={editingCourse}
          onUpdated={fetchCourses}
          handleClose={() => {
            setEditingCourse();
          }}
          open={Boolean(editingCourse)}
        />
      </Box>
    </>
  );
};
Page.getLayout = (page) => <TeacherLayout>{page}</TeacherLayout>;

export default Page;
