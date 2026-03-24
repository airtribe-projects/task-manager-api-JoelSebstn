const taskData = require("../../task.json");

const PRIORITY_LEVELS = ["low", "medium", "high"];

const normalizePriority = (value) => {
    if (typeof value !== "string") return "medium";
    const normalized = value.toLowerCase().trim();
    return PRIORITY_LEVELS.includes(normalized) ? normalized : "medium";
};

const toBooleanOrUndefined = (value) => {
    if (value === undefined) return undefined;
    if (value === true || value === false) return value;
    if (typeof value === "string") {
        const v = value.toLowerCase().trim();
        if (v === "true") return true;
        if (v === "false") return false;
    }
    return undefined;
};

// hydrate initial tasks with createdAt and default priority
const tasks = taskData.tasks.map((task) => ({
    ...task,
    createdAt: new Date().toISOString(),
    priority: normalizePriority(task.priority || "medium"),
}));

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const isValidTaskPayload = (task) =>
    !!task &&
    isNonEmptyString(task.title) &&
    isNonEmptyString(task.description) &&
    typeof task.completed === "boolean" &&
    (task.priority === undefined ||
        PRIORITY_LEVELS.includes(String(task.priority).toLowerCase().trim()));

const getNumericId = (value) => Number.parseInt(value, 10);

const findTaskById = (id) => tasks.find((task) => task.id === id);

const createTask = (req, res) => {
    const payload = {
        ...req.body,
        priority: normalizePriority(req.body.priority),
    };

    if (!isValidTaskPayload(payload)) {
        return res.status(400).json({ error: "Invalid task data" });
    }

    const nextId =
        tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
    const newTask = {
        id: nextId,
        title: payload.title.trim(),
        description: payload.description.trim(),
        completed: payload.completed,
        priority: payload.priority,
        createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);

    return res.status(201).json(newTask);
};

const getAllTasks = (req, res) => {
    const completedFilter = toBooleanOrUndefined(req.query.completed);
    const sortOrder = String(req.query.order || "asc").toLowerCase().trim(); // 'asc' | 'desc'
    const sorted = [...tasks].sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
    });
    const filtered =
        completedFilter === undefined
            ? sorted
            : sorted.filter((t) => t.completed === completedFilter);
    return res.status(200).json(filtered);
};

const getTaskById = (req, res) => {
    const id = getNumericId(req.params.id);
    const task = findTaskById(id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json(task);
};

const updateTask = (req, res) => {
    const id = getNumericId(req.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const payload = {
        ...req.body,
        priority: normalizePriority(req.body.priority ?? tasks[taskIndex].priority),
    };

    if (!isValidTaskPayload(payload)) {
        return res.status(400).json({ error: "Invalid task data" });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        id,
        title: payload.title.trim(),
        description: payload.description.trim(),
        completed: payload.completed,
        priority: payload.priority,
    };
    return res.status(200).json(tasks[taskIndex]);
};

const deleteTask = (req, res) => {
    const id = getNumericId(req.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    return res.status(200).json(deletedTask);
};

const getTasksByPriority = (req, res) => {
    const level = String(req.params.level || "").toLowerCase().trim();
    if (!PRIORITY_LEVELS.includes(level)) {
        return res.status(400).json({ error: "Invalid priority level" });
    }
    const result = tasks
        .filter((t) => t.priority === level)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res.status(200).json(result);
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByPriority,
};
