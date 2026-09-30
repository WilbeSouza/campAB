function login() {

    const usuario =
        document.getElementById("usuario").value.trim();

    const senha =
        document.getElementById("senha").value.trim();

    const mensagem =
        document.getElementById("mensagem");

    if (usuario === "" || senha === "") {

        mensagem.innerText =
            "Preencha usuário e senha.";

        return;
    }

    const usuarioSalvo =
        localStorage.getItem("usuario");

    const senhaSalva =
        localStorage.getItem("senha");

    if (!usuarioSalvo) {

        localStorage.setItem("usuario", usuario);
        localStorage.setItem("senha", senha);
        localStorage.setItem("logado", "true");

        window.location.href = "index.html";

        return;
    }

    if (
        usuario === usuarioSalvo &&
        senha === senhaSalva
    ) {

        localStorage.setItem("logado", "true");

        window.location.href = "index.html";

    } else {

        mensagem.innerText =
            "Usuário ou senha incorretos.";
    }
}

if (
    localStorage.getItem("logado") === "true"
) {
    window.location.href = "index.html";
}