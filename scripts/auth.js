function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function validateToken() {
    const token = localStorage.getItem("token")
    if (!token) {
        Swal.fire("NO AUTORIZADO");
        window.location.href = "index.html";
        return false;
    }
    return token;
}

function getUserIdFromToken(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = JSON.parse(atob(base64));
        return jsonPayload.id;
    } catch (error) {
        Swal.fire("Error", "Hubo un problema.", "error");
        return null;
    }
}