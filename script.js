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


// Faixas de classificação da vegetação

const faixasVegetacao = [

    {
        maximo: 2,
        classificacao: "Normal",
        acao: "Monitoramento periódico"
    },

    {
        maximo: 4,
        classificacao: "Atenção",
        acao: "Acompanhar crescimento"
    },

    {
        maximo: 6,
        classificacao: "Risco",
        acao: "Programar intervenção"
    },

    {
        maximo: Infinity,
        classificacao: "Crítico",
        acao: "Realizar intervenção imediata"
    }

];


// Função para classificar a altura da vegetação

function classificarVegetacao(altura) {

    for (let i = 0; i < faixasVegetacao.length; i++) {

        if (altura <= faixasVegetacao[i].maximo) {

            return {
                classificacao: faixasVegetacao[i].classificacao,
                acao: faixasVegetacao[i].acao
            };

        }

    }

}


// Container dos cards

const container = document.getElementById("cards-container");


// Percorre todos os pontos

pontos.forEach(function(ponto) {

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ponto.lat}&longitude=${ponto.lon}&current_weather=true`)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {

            const temperatura = data.current_weather.temperature;

            const vento = data.current_weather.windspeed;

            const resultadoVegetacao =
                classificarVegetacao(ponto.alturaVegetacao);


            // Criação do card

            const card = document.createElement("div");

            card.classList.add("card");


            // Define a classe visual de acordo com a classificação

            let classeRisco = "";

            if (resultadoVegetacao.classificacao === "Normal") {

                classeRisco = "normal";

            } else if (resultadoVegetacao.classificacao === "Atenção") {

                classeRisco = "atencao";

            } else if (resultadoVegetacao.classificacao === "Risco") {

                classeRisco = "risco";

            } else {

                classeRisco = "critico";

            }

            card.classList.add(classeRisco);


            // Conteúdo do card

            card.innerHTML = `

                <h3>${ponto.nome}</h3>

                <p><strong>Latitude:</strong> ${ponto.lat}</p>

                <p><strong>Longitude:</strong> ${ponto.lon}</p>

                <p><strong>Temperatura:</strong> ${temperatura}°C</p>

                <p><strong>Velocidade do vento:</strong> ${vento} km/h</p>

                <p><strong>Altura da vegetação:</strong> ${ponto.alturaVegetacao} m</p>

                <p><strong>Classificação:</strong> ${resultadoVegetacao.classificacao}</p>

                <p><strong>Ação recomendada:</strong> ${resultadoVegetacao.acao}</p>

            `;


            // Adiciona o card ao dashboard

            container.appendChild(card);

        });

});