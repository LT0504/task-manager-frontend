const URL = 'https://task-manager-api-5r0g.onrender.com';

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    fetch(URL + '/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
        .then(res => res.json()) 
        .then(data => {
            if (data.token) {
                console.log("Login exitoso:", data);
                localStorage.setItem('token', data.token);
                window.location.href = "taskManager.html"; 
            } else if (data.error) {
                document.getElementById('loginMessage').innerText = data.error;
            } else {
                document.getElementById('loginMessage').innerText = "Error desconocido. Intenta de nuevo.";
            }
        })
        .catch(error => {
            console.error("Error en el login:", error);
            document.getElementById('loginMessage').innerText = "Error al intentar iniciar sesión.";
        });
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); 
    const user = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
    }

    console.log(user)

    fetch(URL + '/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                Swal.fire("Creado", "Registro exitoso.", "success").then(() => {
                    window.location.href = "index.html";
                });
            } else if (data.error) {
                document.getElementById('registerMessage').innerHTML = data.error;
            } else {
                document.getElementById('registermessage').innerHTML = "Error desconocido, intenta mas tarde"
            }
        })

        .catch(error => {
            console.error("Error en el login:", error);
            document.getElementById('loginMessage').innerText = "Error al intentar iniciar sesión."; s
        })
})