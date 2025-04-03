async function changeUser() {
    try {
        const token = validateToken();
        if (!token) return;
        const userId = getUserIdFromToken(token);
        const name = document.getElementById("editNameUser").value.trim();
        const email = document.getElementById("editEmailUser").value.trim();
        const password = document.getElementById("editPasswordUser").value.trim();
        const password1 = document.getElementById("editPasswordUser1").value.trim();
        const user = {};
        if (name) user.name = name;
        if (email) user.email = email;
        if (password || password1) {
            if (password === password1) user.password = password;
            else {
                Swal.fire("Error", "Las contraseñas no coinciden", "error");
                return;
            }
        }
        console.log("Datos a enviar:", user);

        if (Object.keys(user).length === 0) {
            Swal.fire("Vacio", "Complete los campos", "question");
            return;
        }
        const response = await fetch(`${URL}/user/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (response.ok) {
            Swal.fire("Actualizado", "El usuario se actualizó con éxito.", "success");
            loadUser()
        } else {
            Swal.fire("Error", data.error || "No se pudo actualizar el usuario.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Algo salió mal. Por favor, inténtalo más tarde.", "error");
    }
}


async function loadUser() {
    try {
        const token = validateToken();
        if (!token) return;
        const userId = await getUserIdFromToken(token);
        const response = await fetch(`${URL}/user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            Swal.fire("Error al obtener los datos del usuario");
            return;
        }
        const data = await response.json();
        const div = document.getElementById("dataUser");
        div.innerHTML = `
            <div class="mb-3 d-flex align-items-center justify-content-between">
                <label for="userName" class="form-label fw-bold text-secondary">Nombre</label>
                <div class="input-group" style="max-width: 400px;">
                  <input type="text" class="form-control" id="userName" value="${data.user.name}" disabled>
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editNameModal">Editar</button>
                </div>
            </div>

            <div class="mb-3 d-flex align-items-center justify-content-between">
                <label for="userEmail" class="form-label fw-bold text-secondary">Correo</label>
                <div class="input-group" style="max-width: 400px;">
                  <input type="text" class="form-control" id="userEmail" value="${data.user.email}" disabled>
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editEmailModal">Editar</button>
                </div>
            </div>
            <div class="mb-3 d-flex align-items-center justify-content-between">
                <label class="form-label fw-bold text-secondary">Contraseña</label>
                <div>
                  <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#editPasswordModal">Cambiar</button>
                </div>
              </div>`;
    } catch (error) {
        Swal.fire("Error", "Algo salió mal. Por favor, inténtalo más tarde.", "error");
    }
}