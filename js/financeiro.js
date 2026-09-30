function atualizarResumo() {

    let totalInscricoes = 0;


    /*
        Soma as inscrições de todos
        os grupos ativos.
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


        totalInscricoes +=
            grupo.participantes.length *
            Number(torneio.inscricao || 0);

    }


    /*
        Soma todas as apostas.
    */

    const totalApostas =
        torneio.apostas.reduce(
            (total, aposta) =>
                total +
                Number(aposta.valor || 0),
            0
        );


    /*
        Soma tudo que foi vendido
        nos produtos.
    */

    let totalProdutos = 0;


    if (
        Array.isArray(
            torneio.produtos
        )
    ) {

        torneio.produtos.forEach(
            produto => {

                totalProdutos +=
                    Number(
                        produto.quantidadeVendida || 0
                    ) *
                    Number(
                        produto.valorUnitario || 0
                    );

            }
        );

    }


    /*
        Total geral do torneio.
    */

    const totalGeral =
        totalInscricoes +
        totalApostas +
        totalProdutos;


    const campoInscricoes =
        document.getElementById(
            "totalInscricoes"
        );


    const campoApostas =
        document.getElementById(
            "totalApostas"
        );


    const campoGeral =
        document.getElementById(
            "totalGeral"
        );


    if (campoInscricoes) {

        campoInscricoes.innerText =
            `${formatarMoeda(totalInscricoes)} Septims`;

    }


    if (campoApostas) {

        campoApostas.innerText =
            `${formatarMoeda(totalApostas)} Septims`;

    }


    if (campoGeral) {

        campoGeral.innerText =
            `${formatarMoeda(totalGeral)} Septims`;

    }


    atualizarProdutos();

}


/* =========================
   PRODUTOS
========================= */

function adicionarProduto() {

    const nome =
        document.getElementById(
            "nomeProduto"
        );


    const quantidade =
        document.getElementById(
            "quantidadeProduto"
        );


    const valor =
        document.getElementById(
            "valorProduto"
        );


    if (
        !nome ||
        !quantidade ||
        !valor
    ) {

        return;

    }


    const nomeProduto =
        nome.value.trim();


    const quantidadeProduto =
        Number(
            quantidade.value
        );


    const valorProduto =
        Number(
            valor.value
        );


    if (
        !nomeProduto ||
        quantidadeProduto <= 0 ||
        valorProduto < 0
    ) {

        alert(
            "Preencha corretamente os dados do produto."
        );

        return;

    }


    if (
        !Array.isArray(
            torneio.produtos
        )
    ) {

        torneio.produtos = [];

    }


    torneio.produtos.push({

        id:
            Date.now(),

        nome:
            nomeProduto,

        quantidade:
            quantidadeProduto,

        valorUnitario:
            valorProduto,

        quantidadeVendida:
            0

    });


    salvarTorneio();


    nome.value = "";
    quantidade.value = "";
    valor.value = "";


    atualizarProdutos();
    atualizarResumo();

}


/* =========================
   ATUALIZAR PRODUTOS
========================= */

function atualizarProdutos() {

    const container =
        document.getElementById(
            "produtos"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(
            torneio.produtos
        ) ||
        torneio.produtos.length === 0
    ) {

        container.innerHTML = `
            <p class="vazio">
                Nenhum produto cadastrado.
            </p>
        `;

        return;

    }


    container.innerHTML =
        torneio.produtos
            .map(
                produto => {

                    const vendidas =
                        Number(
                            produto.quantidadeVendida || 0
                        );


                    const quantidade =
                        Number(
                            produto.quantidade || 0
                        );


                    const valorUnitario =
                        Number(
                            produto.valorUnitario || 0
                        );


                    const estoque =
                        quantidade -
                        vendidas;


                    const totalVendido =
                        vendidas *
                        valorUnitario;


                    return `

                        <div class="aposta-card">

                            <div>

                                <strong>
                                    ${produto.nome}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Estoque inicial
                                </span>

                                <strong>
                                    ${quantidade}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Valor unitário
                                </span>

                                <strong>
                                    ${formatarMoeda(
                                        valorUnitario
                                    )} Septims
                                </strong>

                            </div>


                            <div class="campo">

                                <label>
                                    Vendidas
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="${quantidade}"
                                    value="${vendidas}"
                                    onchange="alterarQuantidadeVendida(
                                        ${produto.id},
                                        this.value
                                    )"
                                >

                            </div>


                            <div>

                                <span>
                                    Estoque restante
                                </span>

                                <strong>
                                    ${estoque}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Total vendido
                                </span>

                                <strong>
                                    ${formatarMoeda(
                                        totalVendido
                                    )} Septims
                                </strong>

                            </div>


                            <button
                                class="btn-remover"
                                onclick="removerProduto(
                                    ${produto.id}
                                )"
                            >
                                Remover
                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================
   ALTERAR VENDAS
========================= */

function alterarQuantidadeVendida(
    id,
    valor
) {

    const produto =
        torneio.produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) {
        return;
    }


    let quantidadeVendida =
        Number(valor);


    if (
        quantidadeVendida < 0
    ) {

        quantidadeVendida = 0;

    }


    if (
        quantidadeVendida >
        produto.quantidade
    ) {

        quantidadeVendida =
            produto.quantidade;

    }


    produto.quantidadeVendida =
        quantidadeVendida;


    salvarTorneio();


    atualizarProdutos();
    atualizarResumo();

}


/* =========================
   REMOVER PRODUTO
========================= */

function removerProduto(id) {

    torneio.produtos =
        torneio.produtos.filter(
            produto =>
                produto.id !== id
        );


    salvarTorneio();


    atualizarProdutos();
    atualizarResumo();

}