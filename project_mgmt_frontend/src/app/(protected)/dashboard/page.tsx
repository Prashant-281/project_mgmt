"use client";
import { useAuth } from "@/hooks/useAuth";
import {
  createProject,
  deleteProject,
  fetchProjects,
  logoutUser,
  updateProject,
} from "@/lib/api";
import { Project, StoredUser } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu, MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  MdDelete,
  MdEdit,
  MdOutlineLibraryAdd,
  MdVisibility,
} from "react-icons/md";
import { toast } from "react-toastify";
import * as yup from "yup";

type ProjectFormData = {
  title: string;
  description: string;
};

const projectSchema = yup.object({
  title: yup.string().trim()
    .required("Project title is required")
    .max(50, "Title cannot exceed 50 characters"),
  description: yup.string().trim()
    .required("Project description is required")
    .max(100, "Description cannot exceed 100 characters"),
}).required();

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    default:
      return "default";
  }
};

const Dashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  useAuth(true);

    const {
    control,
    handleSubmit,
    reset, 
    formState: { errors }, 
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchProjects();
        setProjects(response?.data);
        toast.success(response?.status)
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleOpenCreate = () => {
    setIsEditing(false);
     reset({ title: "", description: "" });
    setCurrentProject(null);
    setOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setIsEditing(true);
    setCurrentProject(project);
     reset({ title: project.title, description: project.description });;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    reset()
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };
  const handleOpenDelete = (project: Project) => {
    setDeleteOpen(true);
    setCurrentProject(project);
  };
  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setCurrentProject(null);
  };

  const handleNavigate = (projectId: string)=>{
     toast.info("Redirecting...",{autoClose: 1000});
     router.push(`/project/${projectId}`);
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        if (!currentProject) return;
       const res = await updateProject(currentProject._id, data);
        toast.success(res?.status);
      } else {
        const res = await createProject(data);
        toast.success(res?.status)
      }
      const response = await fetchProjects();
      setProjects(response?.data);
      handleClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      if (!currentProject) return;
     const res =  await deleteProject(currentProject._id);
     toast.success(res?.message);
      const response = await fetchProjects();
      setProjects(response?.data);
      handleCloseDelete();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "black",
        py: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mb: 4,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{ fontWeight: 700, color: "aliceblue", mb: isMobile ? 1 : 0 }}
        >
          My Projects
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "space-between" : "flex-start",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<MdOutlineLibraryAdd />}
            onClick={handleOpenCreate}
            sx={{
              textTransform: "none",
              boxShadow: theme.shadows[4],
              "&:hover": { boxShadow: theme.shadows[6] },
              flexGrow: 1,
            }}
          >
            {isMobile ? "New Project" : "Create New Project"}
          </Button>
          
          <Tooltip title="Account Info">
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 38,
                  height: 38,
                  fontSize: 14,
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Hi! {user?.name.toUpperCase() || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || "user@example.com"}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setLogoutOpen(true); 
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6" align="center" sx={{ mt: 5 }}>
            Error: {error}
          </Typography>
        ) : projects.length > 0 ? (
          <Grid  container spacing={isMobile ? 2 : 4}>
            {projects.map((project: Project) => (
              <Grid key={project._id}>
                <Card
                  variant="elevation"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[12],
                    },
                  }}
                >
                  <CardContent>
                    <Chip
                      label={project.status || "Unknown"}
                      color={getStatusColor(project.status || "default")}
                      size="small"
                      sx={{
                        mb: 1,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    />
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ mb: 1.5, fontWeight: 600 }}
                    >
                      {project.title}
                    </Typography>
                   {project?.createdAt && (
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{ display: "block", mt: 1, fontWeight: "bold" }}
                      >
                        Created: {new Date(project?.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                   {project?.updatedAt && (
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{ display: "block", fontWeight: "bold" }}
                      >
                        Updated: {new Date(project?.updatedAt).toLocaleDateString()}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        maxHeight: 60,
                        overflow: "hidden",
                        textOverflow: "inherit",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        mb: 2,
                        mt: 1,
                      }}
                    >
                      {project.description}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "stretch" : "center",
                      gap: isMobile ? 1 : 0,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<MdVisibility />}
                      onClick={() =>handleNavigate(project._id)}
                      sx={{ textTransform: "none", minWidth: 120 }}
                    >
                      View Tasks
                    </Button>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isMobile ? "flex-end" : "flex-start",
                      }}
                    >
                      <Tooltip title="Edit Project" placement="top">
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenEdit(project)}
                        >
                          <MdEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Project" placement="top">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDelete(project)}
                        >
                          <MdDelete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: 2,
              mt: 5,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              👋 It's quiet in here!
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Click 'Create New Project' to get started.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<MdOutlineLibraryAdd />}
              onClick={handleOpenCreate}
            >
              Create Project
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: "bold",
            bgcolor: theme.palette.primary.main,
            color: "white",
          }}
        >
          {isEditing ? "Edit Project" : "Create New Project"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ bgcolor: theme.palette.grey[100], p: 3 }}>
          
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  label="Project Title"
                  variant="outlined"
                  fullWidth
                 
                  error={!!errors.title}
                  helperText={errors.title?.message || ' '}
                  sx={{ mt: 1, mb: 2 }}
                />
              )}
            />

          
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message || ' '}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Save Changes" : "Create Project"}
          </Button>
        </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            color: theme.palette.error.dark,
            bgcolor: theme.palette.error.light + "20",
            fontWeight: "bold",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ bgcolor: theme.palette.grey[100], p: 3 }}>
          <Typography>
            Are you sure you want to delete the project:{" "}
            <Box
              component="span"
              sx={{ fontWeight: "bold", color: theme.palette.error.main }}
            >
              {currentProject?.title}
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteSubmit}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={logoutOpen}
        onClose={handleLogoutClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            color: theme.palette.warning.dark,
            bgcolor: theme.palette.warning.light + "20",
            fontWeight: "bold",
          }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ bgcolor: theme.palette.grey[100], p: 3 }}>
          <Typography>
            Are you sure you want to log out of the system?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleLogoutClose} color="inherit">
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={logoutUser}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
