function criarLuta() {

    const selectA =
        document.getElementById("lutadorA");


    const selectB =
        document.getElementById("lutadorB");


    const idA =
        Number(selectA.value);


    const idB =
        Number(selectB.value);


    if (!idA || !idB) {

        alert(
            "Adicione participantes aos dois grupos."
        );

        return;
    }


    let participanteA = null;
    let participanteB = null;

    let grupoA = null;
    let grupoB = null;


    /*
        Procura os dois participantes
        em todos os grupos cadastrados.
    */

    const quantidade =
        Number(
            torneio.quantidadeGrupos || 0
        );


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


        const encontradoA =
            grupo.participantes.find(
                participante =>
                    participante.id === idA
            );


        const encontradoB =
            grupo.participantes.find(
                participante =>
                    participante.id === idB
            );


        if (encontradoA) {

            participanteA =
                encontradoA;

            grupoA =
                grupo.nome;

        }


        if (encontradoB) {

            participanteB =
                encontradoB;

            grupoB =
                grupo.nome;

        }

    }


    if (
        !participanteA ||
        !participanteB
    ) {

        return;

    }


    torneio.lutas.push({

        id: Date.now(),

        lutadorA: {

            id:
                participanteA.id,

            nome:
                participanteA.nome,

            grupo:
                grupoA

        },

        lutadorB: {

            id:
                participanteB.id,

            nome:
                participanteB.nome,

            grupo:
                grupoB

        },

        vencedor: null,

        perdedor: null,

        status: "aguardando"

    });


    salvarTorneio();

    atualizarTela();
}


/* =========================
   REGISTRAR VENCEDOR
========================= */

function registrarVencedor(
    idLuta,
    idVencedor
) {

    const luta =
        torneio.lutas.find(
            luta =>
                luta.id === idLuta
        );


    if (!luta) {
        return;
    }


    const vencedor =
        Number(idVencedor);


    if (
        vencedor ===
        Number(luta.lutadorA.id)
    ) {

        luta.vencedor =
            luta.lutadorA.id;

        luta.perdedor =
            luta.lutadorB.id;

    }
    else if (
        vencedor ===
        Number(luta.lutadorB.id)
    ) {

        luta.vencedor =
            luta.lutadorB.id;

        luta.perdedor =
            luta.lutadorA.id;

    }
    else {

        return;

    }


    luta.status =
        "finalizada";


    salvarTorneio();


    atualizarLutas();
}


/* =========================
   REMOVER LUTA
========================= */

function removerLuta(id) {

    torneio.lutas =
        torneio.lutas.filter(
            luta =>
                luta.id !== id
        );


    salvarTorneio();

    atualizarTela();
}


/* =========================
   ATUALIZAR LUTAS
========================= */

function atualizarLutas() {

    const container =
        document.getElementById("lutas");

    if (!container) {
        return;
    }

    if (
        torneio.lutas.length === 0
    ) {

        container.innerHTML =
            `<p class="vazio">
                Nenhuma luta cadastrada.
            </p>`;

        return;
    }

    const modoGerenciar =
        container.dataset.gerenciar === "true";

    container.innerHTML =
        torneio.lutas.map(
            (luta, index) => {

                const vencedor =
                    Number(
                        luta.vencedor
                    );

                const perdedor =
                    Number(
                        luta.perdedor
                    );

                const venceuA =
                    vencedor ===
                    Number(
                        luta.lutadorA.id
                    );

                const perdeuA =
                    perdedor ===
                    Number(
                        luta.lutadorA.id
                    );

                const venceuB =
                    vencedor ===
                    Number(
                        luta.lutadorB.id
                    );

                const perdeuB =
                    perdedor ===
                    Number(
                        luta.lutadorB.id
                    );

                return `

                    <div class="luta-card">

                        <div class="numero-luta">
                            Luta ${index + 1}
                        </div>

                        <div class="lutadores">

                            <div>

                                <strong
                                    class="${
                                        venceuA
                                            ? "vencedor"
                                            : perdeuA
                                                ? "perdedor"
                                                : ""
                                    }"
                                >
                                    ${luta.lutadorA.nome}
                                    —
                                    ${luta.lutadorA.grupo}
                                </strong>


                                ${
                                    modoGerenciar
                                    ?
                                    `
                                        <button
                                            class="${
                                                venceuA
                                                    ? "btn-vencedor"
                                                    : perdeuA
                                                        ? "btn-perdedor"
                                                        : "btn-vencedor"
                                            }"
                                            onclick="
                                                registrarVencedor(
                                                    ${luta.id},
                                                    ${luta.lutadorA.id}
                                                )
                                            "
                                        >
                                            ${
                                                venceuA
                                                    ? "VENCEDOR"
                                                    : perdeuA
                                                        ? "PERDEDOR"
                                                        : "VENCEDOR"
                                            }
                                        </button>
                                    `
                                    :
                                    ""
                                }

                            </div>

                            <span>
                                VS
                            </span>

                            <div>

                                <strong
                                    class="${
                                        venceuB
                                            ? "vencedor"
                                            : perdeuB
                                                ? "perdedor"
                                                : ""
                                    }"
                                >
                                    ${luta.lutadorB.nome}
                                    —
                                    ${luta.lutadorB.grupo}
                                </strong>


                                ${
                                    modoGerenciar
                                    ?
                                    `
                                        <button
                                            class="${
                                                venceuB
                                                    ? "btn-vencedor"
                                                    : perdeuB
                                                        ? "btn-perdedor"
                                                        : "btn-vencedor"
                                            }"
                                            onclick="
                                                registrarVencedor(
                                                    ${luta.id},
                                                    ${luta.lutadorB.id}
                                                )
                                            "
                                        >
                                            ${
                                                venceuB
                                                    ? "VENCEDOR"
                                                    : perdeuB
                                                        ? "PERDEDOR"
                                                        : "VENCEDOR"
                                            }
                                        </button>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                        <span class="status-luta">
                            ${luta.status}
                        </span>

                        <button
                            class="btn-remover"
                            onclick="
                                removerLuta(
                                    ${luta.id}
                                )
                            "
                        >
                            Remover
                        </button>

                    </div>

                `;

            }
        ).join("");
}