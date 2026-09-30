function adicionarAposta() {

    const apostador =
        document
            .getElementById("apostador")
            .value
            .trim();


    const valor =
        Number(
            document.getElementById("valorAposta").value
        );


    const tipo =
        document.getElementById("tipoAposta").value;


    const escolha =
        document.getElementById("escolhaAposta").value;


    const percentualVencedor =
        Number(
            document
                .getElementById("percentualVencedor")
                .value
        );


    if (!apostador) {

        alert("Informe o nome do apostador.");

        return;
    }


    if (!valor || valor <= 0) {

        alert("Informe um valor válido para a aposta.");

        return;
    }


    if (!escolha) {

        alert("Selecione a aposta.");

        return;
    }


    if (
        percentualVencedor < 0 ||
        percentualVencedor > 95
    ) {

        alert(
            "O percentual do vencedor deve estar entre 0% e 95%."
        );

        return;
    }


    torneio.apostas.push({

        id: Date.now(),

        apostador: apostador,

        valor: valor,

        tipo: tipo,

        escolha: escolha,

        percentualVencedor:
            percentualVencedor,

        percentualPerdedor: 5

    });


    document.getElementById("apostador").value = "";

    document.getElementById("valorAposta").value = "";


    salvarTorneio();

    atualizarTela();
}


function removerAposta(id) {

    torneio.apostas =
        torneio.apostas.filter(
            aposta =>
                aposta.id !== id
        );


    salvarTorneio();

    atualizarTela();
}


function atualizarApostas() {

    atualizarOpcoesAposta();


    const container =
        document.getElementById("apostas");


    if (torneio.apostas.length === 0) {

        container.innerHTML =
            `<p class="vazio">
                Nenhuma aposta cadastrada.
            </p>`;

        return;
    }


    container.innerHTML =
        torneio.apostas.map(
            (aposta, index) => `

                <div class="aposta-card">

                    <div>
                        <strong>
                            ${aposta.apostador}
                        </strong>

                        <small>
                            Aposta #${index + 1}
                        </small>
                    </div>

                    <div>
                        R$ ${formatarMoeda(aposta.valor)}
                    </div>

                    <div>
                        ${aposta.escolha}
                    </div>

                    <div>
                        Vencedor:
                        ${aposta.percentualVencedor}%
                    </div>

                    <div>
                        Perdedor:
                        5%
                    </div>

                    <button
                        class="btn-remover"
                        onclick="removerAposta(${aposta.id})"
                    >
                        Remover
                    </button>

                </div>
            `
        ).join("");
}


function atualizarOpcoesAposta() {

    const tipo =
        document.getElementById("tipoAposta").value;


    const select =
        document.getElementById("escolhaAposta");


    let opcoes = [];


    if (tipo === "grupo") {

        opcoes = [
            {
                valor: "grupoA",
                nome: torneio.grupoA.nome
            },

            {
                valor: "grupoB",
                nome: torneio.grupoB.nome
            }
        ];

    }


    if (tipo === "participante") {

        opcoes = [

            ...torneio.grupoA.participantes.map(
                participante => ({
                    valor:
                        `participante_${participante.id}`,

                    nome:
                        participante.nome
                })
            ),

            ...torneio.grupoB.participantes.map(
                participante => ({
                    valor:
                        `participante_${participante.id}`,

                    nome:
                        participante.nome
                })
            )

        ];

    }


    const campoLutador =
    document.getElementById(
        "campoLutadorAposta"
    );

if (tipo === "luta") {

    campoLutador.style.display =
        "block";

    opcoes =
        torneio.lutas.map(
            (luta, index) => ({

                valor:
                    luta.id,

                nome:
                    `Luta ${index + 1}: ` +
                    `${luta.lutadorA.nome} x ` +
                    `${luta.lutadorB.nome}`

            })
        );

} else {

    campoLutador.style.display =
        "none";

}


    select.innerHTML =
        opcoes.map(
            opcao =>
                `<option value="${opcao.valor}">
                    ${opcao.nome}
                </option>`
        ).join("");
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const tipo =
            document.getElementById(
                "tipoAposta"
            );

        if (tipo) {

            tipo.addEventListener(
                "change",
                atualizarOpcoesAposta
            );
        }
    }
);


function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}
