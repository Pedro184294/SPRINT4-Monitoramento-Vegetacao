// ==========================================
// 1. PONTOS DE MONITORAMENTO
// ==========================================

const pontos = [
    {
        nome: "São Paulo",
        lat: -23.55,
        lon: -46.63,
        alturaVegetacao: 1.5
    },
    {
        nome: "Rio de Janeiro",
        lat: -22.90,
        lon: -43.20,
        alturaVegetacao: 3.2
    },
    {
        nome: "Brasília",
        lat: -15.78,
        lon: -47.93,
        alturaVegetacao: 5.1
    },
    {
        nome: "Salvador",
        lat: -12.97,
        lon: -38.50,
        alturaVegetacao: 7.2
    },
    {
        nome: "Recife",
        lat: -8.05,
        lon: -34.88,
        alturaVegetacao: 2.8
    },
    {
        nome: "Manaus",
        lat: -3.10,
        lon: -60.02,
        alturaVegetacao: 4.5
    },
    {
        nome: "Porto Alegre",
        lat: -30.03,
        lon: -51.23,
        alturaVegetacao: 1.8
    },
    {
        nome: "Curitiba",
        lat: -25.42,
        lon: -49.27,
        alturaVegetacao: 3.9
    },
    {
        nome: "Belo Horizonte",
        lat: -19.92,
        lon: -43.94,
        alturaVegetacao: 5.8
    },
    {
        nome: "Belém",
        lat: -1.45,
        lon: -48.49,
        alturaVegetacao: 6.5
    }
];


// ==========================================
// 2. FAIXAS DE CLASSIFICAÇÃO
// ==========================================

// Faixas definidas para este projeto acadêmico.
// Não representam limites oficiais da Motiva.

const faixasVegetacao = [
    {
        maximo: 2,
        classificacao: "Normal",
        acao: "Manter o monitoramento periódico.",
        prioridade: 4
    },
    {
        maximo: 4,
        classificacao: "Atenção",
        acao: "Acompanhar o crescimento da vegetação.",
        prioridade: 3
    },
    {
        maximo: 6,
        classificacao: "Risco",
        acao: "Priorizar avaliação e programar intervenção.",
        prioridade: 2
    },
    {
        maximo: Infinity,
        classificacao: "Crítico",
        acao: "Priorizar avaliação imediata e intervenção conforme necessário.",
        prioridade: 1
    }
];


// ==========================================
// 3. CLASSIFICAÇÃO AUTOMÁTICA
// ==========================================

function classificarVegetacao(altura) {
    for (let i = 0; i < faixasVegetacao.length; i++) {
        if (altura <= faixasVegetacao[i].maximo) {
            return {
                classificacao: faixasVegetacao[i].classificacao,
                acao: faixasVegetacao[i].acao,
                prioridade: faixasVegetacao[i].prioridade
            };
        }
    }
}


// ==========================================
// 4. PREPARAÇÃO DOS PONTOS
// ==========================================

const pontosClassificados = pontos.map(function(ponto) {
    const resultado = classificarVegetacao(ponto.alturaVegetacao);

    return {
        ...ponto,
        classificacao: resultado.classificacao,
        acao: resultado.acao,
        prioridade: resultado.prioridade
    };
});


// ==========================================
// 5. ELEMENTOS DO DASHBOARD
// ==========================================

const container = document.getElementById("cards-container");
const filtro = document.getElementById("filtro-classificacao");
const mensagemCarregamento = document.getElementById("mensagem-carregamento");


// ==========================================
// 6. ATUALIZAÇÃO DOS INDICADORES
// ==========================================

function atualizarIndicadores() {
    document.getElementById("total-pontos").textContent =
        pontosClassificados.length;

    document.getElementById("total-normal").textContent =
        pontosClassificados.filter(p => p.classificacao === "Normal").length;

    document.getElementById("total-atencao").textContent =
        pontosClassificados.filter(p => p.classificacao === "Atenção").length;

    document.getElementById("total-risco").textContent =
        pontosClassificados.filter(p => p.classificacao === "Risco").length;

    document.getElementById("total-critico").textContent =
        pontosClassificados.filter(p => p.classificacao === "Crítico").length;
}


// ==========================================
// 7. CLASSE VISUAL DE CADA CLASSIFICAÇÃO
// ==========================================

function obterClasseRisco(classificacao) {
    if (classificacao === "Normal") {
        return "normal";
    } else if (classificacao === "Atenção") {
        return "atencao";
    } else if (classificacao === "Risco") {
        return "risco";
    }

    return "critico";
}


// ==========================================
// 8. CRIAÇÃO DOS CARDS
// ==========================================

function criarCard(ponto) {
    const card = document.createElement("article");
    const classeRisco = obterClasseRisco(ponto.classificacao);

    card.classList.add("card", classeRisco);

    card.innerHTML = `
        <div class="card-cabecalho">
            <h3>${ponto.nome}</h3>
            <span class="etiqueta ${classeRisco}">
                ${ponto.classificacao}
            </span>
        </div>

        <p><strong>Latitude:</strong> ${ponto.lat}</p>
        <p><strong>Longitude:</strong> ${ponto.lon}</p>
        <p><strong>Altura da vegetação:</strong>
            ${ponto.alturaVegetacao.toFixed(1)} m
        </p>

        <p class="acao-recomendada">
            <strong>Ação recomendada:</strong><br>
            ${ponto.acao}
        </p>

        <div class="dados-climaticos">
            <p class="titulo-clima">Condições climáticas</p>
            <p class="temperatura">Temperatura: carregando...</p>
            <p class="vento">Velocidade do vento: carregando...</p>
        </div>
    `;

    // Consulta dados climáticos da região pela API Open-Meteo.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ponto.lat}&longitude=${ponto.lon}&current=temperature_2m,wind_speed_10m`;

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Não foi possível consultar o clima.");
            }

            return response.json();
        })
        .then(function(data) {
            const temperatura = data.current.temperature_2m;
            const vento = data.current.wind_speed_10m;

            card.querySelector(".temperatura").textContent =
                `Temperatura: ${temperatura} °C`;

            card.querySelector(".vento").textContent =
                `Velocidade do vento: ${vento} km/h`;
        })
        .catch(function() {
            card.querySelector(".temperatura").textContent =
                "Temperatura: indisponível";

            card.querySelector(".vento").textContent =
                "Velocidade do vento: indisponível";
        });

    return card;
}


// ==========================================
// 9. EXIBIÇÃO E PRIORIZAÇÃO DOS PONTOS
// ==========================================

function renderizarPontos() {
    container.innerHTML = "";

    const classificacaoSelecionada = filtro.value;

    // Ordena os pontos por prioridade:
    // Crítico, Risco, Atenção e Normal.
    const pontosOrdenados = [...pontosClassificados].sort(
        function(a, b) {
            return a.prioridade - b.prioridade;
        }
    );

    const pontosFiltrados = pontosOrdenados.filter(function(ponto) {
        return classificacaoSelecionada === "todos" ||
            ponto.classificacao === classificacaoSelecionada;
    });

    if (pontosFiltrados.length === 0) {
        container.innerHTML =
            "<p>Nenhum ponto encontrado para essa classificação.</p>";
        return;
    }

    pontosFiltrados.forEach(function(ponto) {
        const card = criarCard(ponto);
        container.appendChild(card);
    });
}


// ==========================================
// 10. INICIALIZAÇÃO DO DASHBOARD
// ==========================================

atualizarIndicadores();
renderizarPontos();

mensagemCarregamento.textContent =
    "Classificação da vegetação carregada com sucesso.";


// ==========================================
// 11. FILTRO INTERATIVO
// ==========================================

filtro.addEventListener("change", renderizarPontos);