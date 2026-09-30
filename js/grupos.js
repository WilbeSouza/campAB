/* =========================
   CONFIGURAÇÃO DOS GRUPOS
========================= */

const letrasGrupos = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
];


/* =========================
   ALTERAR QUANTIDADE
========================= */

function alterarQuantidadeGrupos() {

    const select =
        document.getElementById(
            "quantidadeGrupos"
        );


    if (!select) {
        return;
    }


    const quantidade =
        Number(select.value);


    if (!quantidade) {
        return;
    }


    torneio.quantidadeGrupos =
        quantidade;


    /*
        Cria os grupos necessários
        sem apagar os participantes
        dos grupos que continuam existindo.
    */

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const letra =
            letrasGrupos[i];


        const chave =
            `grupo${letra}`;


        if (!torneio[chave]) {

            torneio[chave] = {

                nome:
                    `Grupo ${letra}`,

                participantes: []

            };

        }

    }


    salvarTorneio();

    atualizarGrupos();

    atualizarSelecionadores();

}


/* =========================
   DESENHAR JANELAS
========================= */

function atualizarGrupos() {

    const container =
        document.getElementById(
            "gruposContainer"
        );


    if (!container) {
        return;
    }


    const quantidade =
        Number(
            torneio.quantidadeGrupos || 0
        );


    container.innerHTML = "";


    /*
        Se ainda não escolheu
        a quantidade, não mostra
        nenhuma janela.
    */

    if (!quantidade) {
        return;
    }


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const letra =
            letrasGrupos[i];


        const chave =
            `grupo${letra}`;


        const grupo =
            torneio[chave];


        /*
            ESTA É A MESMA JANELA
            QUE VOCÊ JÁ TINHA.
        */

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "grupo-card";


        card.innerHTML = `

            <div class="grupo-titulo">

                <input
                    id="nomeGrupo${letra}"
                    type="text"
                    value="${grupo.nome}"
                    placeholder="Nome do Grupo"
                    oninput="salvarNomeGrupo('${letra}')"
                >

            </div>


            <div class="adicionar-participante">

                <input
                    id="nome${letra}"
                    type="text"
                    placeholder="Nome do participante"
                >

                <button
                    onclick="adicionarParticipante('${letra}')"
                >
                    Adicionar
                </button>

            </div>


            <div class="lista-container">

                <h3>
                    Participantes
                </h3>

                <ul id="grupo${letra}">
                </ul>

            </div>

        `;


        container.appendChild(card);


        atualizarListaParticipantes(
            letra
        );

    }
}


/* =========================
   ADICIONAR PARTICIPANTE
========================= */

function adicionarParticipante(
    letra
) {

    const input =
        document.getElementById(
            `nome${letra}`
        );


    if (!input) {
        return;
    }


    const nome =
        input.value.trim();


    if (!nome) {
        return;
    }


    const chave =
        `grupo${letra}`;


    if (!torneio[chave]) {

        torneio[chave] = {

            nome:
                `Grupo ${letra}`,

            participantes: []

        };

    }


    torneio[chave]
        .participantes
        .push({

            id:
                Date.now(),

            nome:
                nome

        });


    input.value = "";


    salvarTorneio();

    atualizarGrupos();

    atualizarSelecionadores();

}


/* =========================
   REMOVER PARTICIPANTE
========================= */

function removerParticipante(
    letra,
    id
) {

    const chave =
        `grupo${letra}`;


    if (!torneio[chave]) {
        return;
    }


    torneio[chave]
        .participantes =
        torneio[chave]
            .participantes
            .filter(
                participante =>
                    participante.id !== id
            );


    salvarTorneio();

    atualizarGrupos();

    atualizarSelecionadores();

}


/* =========================
   SALVAR NOME DO GRUPO
========================= */

function salvarNomeGrupo(
    letra
) {

    const input =
        document.getElementById(
            `nomeGrupo${letra}`
        );


    if (!input) {
        return;
    }


    const chave =
        `grupo${letra}`;


    if (!torneio[chave]) {

        torneio[chave] = {

            nome:
                `Grupo ${letra}`,

            participantes: []

        };

    }


    torneio[chave].nome =
        input.value.trim() ||
        `Grupo ${letra}`;


    localStorage.setItem(
        "torneio",
        JSON.stringify(torneio)
    );


    atualizarSelecionadores();

}


/* =========================
   LISTA DE PARTICIPANTES
========================= */

function atualizarListaParticipantes(
    letra
) {

    const lista =
        document.getElementById(
            `grupo${letra}`
        );


    if (!lista) {
        return;
    }


    const grupo =
        torneio[
        `grupo${letra}`
        ];


    if (
        !grupo ||
        grupo.participantes.length === 0
    ) {

        lista.innerHTML = `

            <li class="vazio">
                Nenhum participante.
            </li>

        `;

        return;
    }


    lista.innerHTML =
        grupo.participantes
            .map(
                participante => `

                    <li>

                        <span>
                            ${participante.nome}
                        </span>


                        <button
                            class="btn-remover"
                            onclick="removerParticipante(
                                '${letra}',
                                ${participante.id}
                            )"
                        >
                            Remover
                        </button>

                    </li>

                `
            )
            .join("");
}


/* =========================
   SELECIONADORES
========================= */

function atualizarSelecionadores() {

    const lutadorA =
        document.getElementById(
            "lutadorA"
        );


    const lutadorB =
        document.getElementById(
            "lutadorB"
        );


    if (
        !lutadorA ||
        !lutadorB
    ) {

        return;

    }


    /*
        Limpa os dois campos
        antes de preencher novamente.
    */

    lutadorA.innerHTML = "";
    lutadorB.innerHTML = "";


    const quantidade =
        Number(
            torneio.quantidadeGrupos || 0
        );


    /*
        Percorre somente os grupos
        que foram escolhidos no torneio.
    */

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const letra =
            letrasGrupos[i];


        const grupo =
            torneio[
            `grupo${letra}`
            ];


        if (
            !grupo ||
            !Array.isArray(
                grupo.participantes
            )
        ) {

            continue;

        }

        /*
            Adiciona cada participante
            nos dois campos de luta.
        */
        grupo.participantes.forEach(
            participante => {

                const optionA =
                    document.createElement(
                        "option"
                    );


                optionA.value =
                    participante.id;


                optionA.textContent =
                    `${participante.nome} — ${grupo.nome}`;


                lutadorA.appendChild(
                    optionA
                );


                const optionB =
                    document.createElement(
                        "option"
                    );


                optionB.value =
                    participante.id;


                optionB.textContent =
                    `${participante.nome} — ${grupo.nome}`;


                lutadorB.appendChild(
                    optionB
                );

            }
        );
    }
}
