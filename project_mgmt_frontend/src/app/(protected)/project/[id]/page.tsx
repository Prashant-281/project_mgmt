"use client";
import { useAuth } from "@/hooks/useAuth";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/lib/api";
import { Task } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdDelete,
  MdEdit,
  MdOutlineLibraryAdd,
} from "react-icons/md";
import { toast } from "react-toastify";
import * as yup from "yup";

type TaskFormData = {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
};
 
type TaskStatus = 'todo' | 'in-progress' | 'done';

const taskSchema = yup
  .object({
    title: yup
      .string()
      .trim()
      .required("Task title is required")
      .max(25, "Title cannot exceed 50 characters"),
    description: yup
      .string()
      .trim()
      .required("Task description is required")
      .max(50, "Description cannot exceed 100 characters"),
    dueDate: yup
      .string()
      .required("Due date is required")
      .test("is-future-date", "Due date cannot be in the past", (value) => {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        return selectedDate >= today;
      }),
      status: yup
      .string()
      .oneOf(['todo', 'in-progress', 'done'], "Invalid status selected")
      .required("Task status is required") as yup.Schema<TaskStatus>,
  })
  .required();

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'todo':
            return 'error';
        case 'in-progress':
            return 'warning';
        case 'done':
            return 'success';
        default:
            return 'default';
    }
};

const Tasks = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useAuth(true);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "todo"
    },
  });

  const refetchTasks = useCallback(
    async (currentPage: number) => {
      try {
        setLoading(true);
        const response = await fetchTasks(projectId, currentPage, filterStatus);
        setTasks(response?.data || []);
        toast.success(response?.message);
        setTotalPages(response?.totalPages || 1);
        if (currentPage > (response?.totalPages || 1)) {
          setPage(response?.totalPages || 1);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    },
    [projectId, filterStatus]
  );

  useEffect(() => {
    refetchTasks(page);
  }, [projectId, page, refetchTasks, filterStatus]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentTask(null);
    const today = new Date().toISOString().split("T")[0];
    reset({ title: "", description: "", dueDate: today, status: "todo" }); 
    setOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
    reset();
    const formattedDueDate = task.dueDate ? task.dueDate.split("T")[0] : "";

    setValue("title", task.title, { shouldValidate: true });
    setValue("description", task.description, { shouldValidate: true });
    setValue("dueDate", formattedDueDate, { shouldValidate: true });
    setValue("status", (task.status as TaskFormData['status']) || "todo", { shouldValidate: true }); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleOpenDelete = (task: Task) => {
    setCurrentTask(task);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setCurrentTask(null);
  };
  const handleFilterChange = (event:SelectChangeEvent) => {
      setFilterStatus(event.target.value);
    };

  const onSubmit = async (data: TaskFormData) => {
    try {
      handleClose();
      if (isEditing && currentTask) {
        const res = await updateTask(projectId, currentTask._id, data);
        toast.success(res?.message);
      } else {
        const res = await createTask(projectId, data);
        toast.success(res?.message);
        setPage(1);
      }

      await refetchTasks(isEditing ? page : 1);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      if (currentTask) {
        const res = await deleteTask(projectId, currentTask._id);
        toast.success(res.message);
        const newPage = tasks.length === 1 && page > 1 ? page - 1 : page;

        await refetchTasks(newPage);
        setPage(newPage);
      }
      handleCloseDelete();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "cornsilk",
        py: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
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
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: isMobile ? 1 : 0,
          }}
        >
          Project Tasks
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "space-between" : "flex-start",
          }}
        >
          <FormControl  sx={{ minWidth: 150, borderRadius:2, backgroundColor:'ivory'}}>
                    <Select
                      value={filterStatus}
                      onChange={handleFilterChange}
                      fullWidth
                    >
                      <MenuItem value="all">All Tasks</MenuItem>
                      <MenuItem value="todo">Todo</MenuItem>
                      <MenuItem value="in-progress">In progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
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
            {isMobile ? "New Task" : "Create New Task"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<MdArrowBack />}
            onClick={() => router.push("/dashboard")}
            sx={{
              textTransform: "none",
              flexGrow: 1,
            }}
          >
            {isMobile ? "Back" : "Back to Projects"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6" align="center" sx={{ mt: 5 }}>
            Error: {error}
          </Typography>
        ) : tasks.length > 0 ? (
          <Grid container spacing={isMobile ? 2 : 3}>
            {tasks.map((task: Task) => (
              <Grid key={task._id}>
                <Card
                  variant="elevation"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        maxHeight: 60,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        mb: 1.5,
                      }}
                    >
                      {task.description}
                    </Typography>
                    <Chip
                      label={task?.status}
                      color={getStatusColor(task?.status)||'default'}
                      size="small"
                      sx={{
                        mb: 1,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    />

                    {task?.dueDate && (
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{ display: "block", mt: 1, fontWeight: "bold" }}
                      >
                        Due: {new Date(task?.dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                  <Box
                    sx={{
                      p: 1.5,
                      borderTop: `1px solid ${theme.palette.grey[200]}`,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Tooltip title="Edit Task" placement="top">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleOpenEdit(task)}
                      >
                        <MdEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Task" placement="top">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDelete(task)}
                      >
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
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
              🚀 Time to get things done!
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Click 'Create New Task' to add your first item to this project.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<MdOutlineLibraryAdd />}
              onClick={handleOpenCreate}
            >
              Create Task
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<MdChevronLeft />}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1 || loading}
          sx={{ mx: 1 }}
        >
          {isMobile ? "" : "Previous"}
        </Button>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          endIcon={<MdChevronRight />}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages || loading}
          sx={{ mx: 1 }}
        >
          {isMobile ? "" : "Next"}
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: "bold",
            bgcolor: theme.palette.primary.main,
            color: "white",
          }}
        >
          {isEditing ? "Edit Task" : "Create New Task"}
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
                  label="Task Title"
                  variant="outlined"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message || " "}
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
                  label="Task Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message || " "}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Due Date"
                  variant="outlined"
                  type="date" 
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message || " "}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status} sx={{ mb: 2 }}>
                  <InputLabel id="task-status-label">Status</InputLabel>
                  <Select
                    {...field}
                    labelId="task-status-label"
                    label="Status"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <MenuItem value={'todo'}>To Do</MenuItem>
                    <MenuItem value={'in-progress'}>In Progress</MenuItem>
                    <MenuItem value={'done'}>Done</MenuItem>
                  </Select>
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.status?.message}
                  </Typography>
                </FormControl>
              )}
            />

          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Save Changes" : "Create Task"}
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
            Are you sure you want to delete the task:{" "}
            <Box
              component="span"
              sx={{ fontWeight: "bold", color: theme.palette.error.main }}
            >
              {currentTask?.title}
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
    </Box>
  );
};

export default Tasks;
