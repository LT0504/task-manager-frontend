const URL = 'https://api-rest-taskmanager.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    try {
        const token = validateToken();
        if (!token) return;
        const userId = getUserIdFromToken(token);

        fetch(`${URL}/task/users/${userId}/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.tasks) {
                    showTasks(data.tasks);
                } else {
                    Swal.fire({ title: "No se encontraron tareas", icon: "success", draggable: true });
                    const taskContainer = document.querySelector(".task-container");
                    taskContainer.innerHTML = "";
                }
            })
            .catch(error => console.log("Error de conexión", error));
    } catch (error) {
        Swal.fire("Error", "Algo salió mal. Por favor, inténtalo más tarde.", "error");
    }
});

function loadTasks() {
    try {
        const token = validateToken();
        if (!token) return;
        const userId = getUserIdFromToken(token)

        fetch(`${URL}/task/users/${userId}/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.tasks) {
                    showTasks(data.tasks);
                } else {
                    Swal.fire({ title: "No se encontraron tareas", icon: "success", draggable: true });
                    const taskContainer = document.querySelector(".task-container");
                    taskContainer.innerHTML = "";
                }
            })
            .catch(error => Swal.fire("Error de conexion"))
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al cargar la tarea.", "error");
    }

}

function showTasks(tasks) {
    try {
        const token = validateToken();
        if (!token) return;

        const taskContainer = document.querySelector(".task-container");
        taskContainer.innerHTML = "";

        let row = null;

        tasks.forEach((task, index) => {
            if (index % 2 === 0) {
                // Crear una nueva fila cada 2 tareas
                row = document.createElement("div");
                row.classList.add("row");
                taskContainer.appendChild(row);
            }

            const col = document.createElement("div");
            col.classList.add("col-lg-6", "mb-4");
            let date = new Date(task.dueDate);

            col.innerHTML = `
                <div class="card task-card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${task.title} 
                            <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
                        </h5>
                        <p class="card-text">${task.description}</p>
                        <div class="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-3">
                            <span class="badge ${getStatusClass(task.status)}">${task.status}</span>
                            <small class="text-muted"><i class="bi bi-calendar"></i> Fecha limite: ${date.toISOString().split("T")[0]}</small>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="loadTaskData(${task.id})" data-bs-toggle="modal" data-bs-target="#editTaskModal">
                        Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
                    </div>
                </div>
            `;

            row.appendChild(col);
        });
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al cargar la tarea.", "error");

    }
}

function showTaksByStatus(tasks) {

    try {
        const token = validateToken();
        if (!token) return;

        const pendingContainer = document.querySelector("#pendingTasks .content div");
        const inProgressContainer = document.querySelector("#inProgress .content div");
        const completedContainer = document.querySelector("#completed .content div");

        pendingContainer.innerHTML = "";
        inProgressContainer.innerHTML = "";
        completedContainer.innerHTML = "";

        const containers = {
            pendiente: { container: pendingContainer, row: null },
            "en curso": { container: inProgressContainer, row: null },
            completada: { container: completedContainer, row: null }
        };

        tasks.forEach((task, index) => {
            const statusKey = task.status.toLowerCase();

            if (!containers[statusKey]) return;

            let { container, row } = containers[statusKey];

            if (index % 2 === 0) {
                row = document.createElement("div");
                row.classList.add("row");
                container.appendChild(row);
                containers[statusKey].row = row;
            }

            const col = document.createElement("div");
            col.classList.add("col-lg-6", "mb-4");

            let date = new Date(task.dueDate);

            col.innerHTML = `
            <div class="card task-card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${task.title} 
                            <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
                        </h5>
                        <p class="card-text">${task.description}</p>
                        <div class="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-3">
                            <span class="badge ${getStatusClass(task.status)}">${task.status}</span>
                            <small class="text-muted"><i class="bi bi-calendar"></i> Fecha limite: ${date.toISOString().split("T")[0]}</small>
                        </div>s
                        <button class="btn btn-primary btn-sm" onclick="loadTaskData(${task.id})" data-bs-toggle="modal" data-bs-target="#editTaskModal">
                        Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
                    </div>
                </div>
            `;

            row.appendChild(col);
        });
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al cargar la tarea.", "error");
    }

}

function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case "alta":
            return "bg-danger text-light";
        case "media":
            return "bg-warning text-light";
        case "baja":
            return "bg-success text-light";
        default:
            return "bg-secondary text-light";
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case "sin completar":
            return "bg-danger text-dark";
        case "en curso":
            return "bg-warning text-dark";
        case "completada":
            return "bg-success text-dark";
        default:
            return "bg-primary text-light";
    }
}

async function deleteTask(taskId) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás recuperar esta tarea si la eliminas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) {
        return;
    }

    const token = validateToken();
    if (!token) return;

    try {
        const response = await fetch(`${URL}/task/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire("Eliminado", `La tarea fue eliminada con éxito.`, "success");
            loadTasks();
        } else {
            Swal.fire("Error", data.error || "No se pudo eliminar la tarea.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al intentar eliminar la tarea.", "error");
    }
}

async function createTask() {

    const token = validateToken();
    if (!token) return;
    const userId = getUserIdFromToken(token);

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const status = document.getElementById("taskStatus").value;
    const priority = document.getElementById("taskPriority").value;
    const taskDueDate = document.getElementById("taskDueDate").value;

    if (!title || !description || !status || !priority || !taskDueDate) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Todos los campos son obligatorios.",
        });
        return;
    }
    let dueDate = new Date(taskDueDate);
    let today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
        const result = await Swal.fire({
            title: `${dueDate} \n¿Estas seguro de la fecha?`,
            showDenyButton: true,
            confirmButtonText: "Si, continuar",
            denyButtonText: `No, corregir`
        })
        if (result.isDenied) {
            return;
        }
    }

    const task = { title, description, status, priority, userId, dueDate };

    try {
        const response = await fetch(`${URL}/task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire("Creado", "La tarea fue creada con éxito.", "success");
            document.getElementById("taskForm").reset();
            loadTasks();
        } else {
            Swal.fire("Error", data.error || "No se pudo crear la tarea.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al intentar crear la tarea.", "error");
    }
}

async function loadTaskData(taskId) {
    console.log("ID de la tarea a editar:", taskId);

    try {
        const response = await fetch(`${URL}/task/${taskId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const task = await response.json();
        console.log("Datos recibidos de la API:", task);

        if (response.ok) {
            document.getElementById("editTaskId").value = task.task.id;
            document.getElementById("editTaskTitle").value = task.task.title || "";
            document.getElementById("editTaskDescription").value = task.task.description || "";
            document.getElementById("editTaskStatus").value = task.task.status || "pendiente";
            document.getElementById("editTaskPriority").value = task.task.priority || "media";
        } else {
            Swal.fire("Error", "No se pudo cargar la tarea.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al cargar la tarea.", "error");
    }
}

async function updateTask() {
    const token = validateToken();
    if (!token) return;
    const userId = getUserIdFromToken(token);

    const taskId = document.getElementById("editTaskId").value;
    const title = document.getElementById("editTaskTitle").value.trim();
    const description = document.getElementById("editTaskDescription").value.trim();
    const status = document.getElementById("editTaskStatus").value;
    const priority = document.getElementById("editTaskPriority").value;
    const dueDate = document.getElementById("taskDueDate").value;

    if (!title || !description || !status || !priority || dueDate) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Todos los campos son obligatorios.",
        });
        return;
    }

    const task = { title, description, status, priority, userId, dueDate };

    try {
        const response = await fetch(`${URL}/task/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(task)
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire("Creado", "La tarea se modificó con éxito.", "success");
            document.getElementById("taskForm").reset();
            loadTasks();
        } else {
            Swal.fire("Error", data.error || "No se pudo actualizar la tarea.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al intentar crear la tarea.", "error");
    }
}
async function getTaskByStatus(status) {
    try {
        const token = validateToken();
        if (!token) return;
        const userId = getUserIdFromToken(token);

        fetch(`${URL}/task/${status}/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.tasks) {
                    showTaksByStatus(data.tasks)
                } else {
                    Swal.fire({ title: "No se encontraron tareas", icon: "success", draggable: true });
                }
            })
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al intentar cargar la tarea.", "error");
    }
}