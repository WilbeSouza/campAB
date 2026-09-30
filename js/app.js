let torneio = {
    status: "configurando",

    nome: "",

    inscricao: 0,

    grupoA: {
        nome: "Grupo A",
        participantes: []
    },

    grupoB: {
        nome: "Grupo B",
        participantes: []
    },

    lutas: [],

    apostas: [],

    financeiro: {
        bebidas: 0,
        comidas: 0
    }
};


/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener("DOMContentLoaded", function () {

    carregarTorneio();

    preencherCampos();

    atualizarGrupos();

    atualizarSelecionadores();

    atualizarLutas();

    atualizarApostas();

    atualizarResumo();

});


/* =========================
   CARREGAR
========================= */

function carregarTorneio() {

    const dados =
        localStorage.getItem("torneio");

    if (!dados) {
        return;
    }

    try {

        const salvo =
            JSON.parse(dados);

        if (salvo) {

            torneio = {
                ...torneio,
                ...salvo
            };

            torneio.grupoA =
                salvo.grupoA || {
                    nome: "Grupo A",
                    participantes: []
                };

            torneio.grupoB =
                salvo.grupoB || {
                    nome: "Grupo B",
                    participantes: []
                };

            torneio.lutas =
                Array.isArray(salvo.lutas)
                    ? salvo.lutas
                    : [];

            torneio.apostas =
                Array.isArray(salvo.apostas)
                    ? salvo.apostas
                    : [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar torneio:",
            erro
        );

    }
}


/* =========================
   SALVAR
========================= */

function salvarTorneio() {

    const nome =
        document.getElementById("nomeTorneio");

    const inscricao =
        document.getElementById("inscricao");

    const grupoA =
        document.getElementById("nomeGrupoA");

    const grupoB =
        document.getElementById("nomeGrupoB");


    if (nome) {
        torneio.nome =
            nome.value.trim();
    }


    if (inscricao) {
        torneio.inscricao =
            Number(inscricao.value) || 0;
    }


    if (grupoA) {
        torneio.grupoA.nome =
            grupoA.value.trim() ||
            "Grupo A";
    }


    if (grupoB) {
        torneio.grupoB.nome =
            grupoB.value.trim() ||
            "Grupo B";
    }


    localStorage.setItem(
        "torneio",
        JSON.stringify(torneio)
    );


    atualizarResumo();
}


/* =========================
   PREENCHER CAMPOS
========================= */

function preencherCampos() {

    const nome =
        document.getElementById("nomeTorneio");

    const inscricao =
        document.getElementById("inscricao");

    const grupoA =
        document.getElementById("nomeGrupoA");

    const grupoB =
        document.getElementById("nomeGrupoB");


    if (nome) {
        nome.value =
            torneio.nome || "";
    }


    if (inscricao) {
        inscricao.value =
            torneio.inscricao || "";
    }


    if (grupoA) {
        grupoA.value =
            torneio.grupoA.nome ||
            "Grupo A";
    }


    if (grupoB) {
        grupoB.value =
            torneio.grupoB.nome ||
            "Grupo B";
    }
}


/* =========================
   ATUALIZAR TUDO
========================= */

function atualizarTela() {

    preencherCampos();

    atualizarGrupos();

    atualizarSelecionadores();

    atualizarLutas();

    atualizarApostas();

    atualizarResumo();
}


/* =========================
   CONCLUIR
========================= */

function concluirTorneio() {

    salvarTorneio();


    if (!torneio.nome) {

        alert(
            "Digite o nome do torneio."
        );

        return;
    }


    if (
        torneio.grupoA.participantes.length === 0
    ) {

        alert(
            "Adicione pelo menos um participante no Grupo A."
        );

        return;
    }


    if (
        torneio.grupoB.participantes.length === 0
    ) {

        alert(
            "Adicione pelo menos um participante no Grupo B."
        );

        return;
    }


    const confirmar =
        confirm(
            "Concluir a configuração deste torneio?"
        );


    if (!confirmar) {
        return;
    }


    torneio.status = "ativo";


    localStorage.setItem(
        "torneio",
        JSON.stringify(torneio)
    );


    window.location.href =
        "gerenciar.html";
}


/* =========================
   SAIR
========================= */

function sair() {

    localStorage.removeItem("logado");

    window.location.href =
        "login.html";
}
