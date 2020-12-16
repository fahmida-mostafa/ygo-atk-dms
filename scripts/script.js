const app = {};
app.totalDeck = [];
app.playerHand = [];
app.opponentHand = [];
app.currentPlayerCard = null;
app.currentOpponentCard = null;

//Populates the total deck from API.
app.getDeck = async () => {
    try {
        const common = {
            url: "https://db.ygoprodeck.com/api/v7/cardinfo.php",
            method: "GET",
            type: "JSON"
        };
        const data = { type: "Normal Monster" };
        const races = ['cyberse', 'dinosaur', 'dragon', 'insect', 'pyro', 'reptile', 'rock', 'sea serpent', 'thunder', 'wyrm'];

        const requests = [];
        for (let i = 0; i < races.length; i += 1) {
            const request = $.ajax({
                ...common,
                data: {
                    ...data,
                    race: races[i]
                }
            });
            requests.push(request);
        }

        const response = await Promise.all(requests);

        const minResponse = [];
        for (let i = 0; i < races.length; i += 1) {
            minResponse.push(...response[i].data);
        }

        app.totalDeck = minResponse.slice();
    } catch (error) {
        console.warn(error);
    }
}

//Sets up the player hand from totalDeck
app.setupPlayerCards = () => {
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
        app.playerHand.push(app.totalDeck[randomIndex]);
        app.totalDeck.splice(randomIndex, 1);
    }
}

//Sets up initial opponent hand from totalDeck
app.setupOpponentCards = () => {
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
        app.opponentHand.push(app.totalDeck[randomIndex]);
        app.totalDeck.splice(randomIndex, 1);
    }
}

//Hides the intro screen when you hit start game.
app.startGame = () => {
    app.$startGameButton.on("click", () => {
        app.$startGameScreen.css("display", "none");
    });
}

//Updates attack power based on current monster selected
app.updatePlayerAtkDisplay = () => {
    app.$playerAtkDisplay.text(app.currentPlayerCard.atk);
}

app.updateOpponentAtkDisplay = () => {
    app.$opponentAtkDisplay.text(app.currentOpponentCard.atk);
}

// Adds players cards to the UI
app.renderPlayerCards = () => {
    app.$playerHandNode.html("");
    app.playerHand.forEach(card => {
        const markup = `
            <li class="player-card card" tabindex="0" data-id=${card.id}>
                <img src="${card.card_images[0].image_url}" class="player-card-img" alt="${card.name}">
                <span class="visuallyhidden">${card.atk} Attack Points</span>
            </li>
        `;
        app.$playerHandNode.append(markup);
    });
}

// Adds opponent cards to the UI
app.renderOpponentCards = () => {
    app.$opponentHandNode.html("");
    app.opponentHand.forEach(card => {
        const markup = `
            <li class="opponent-card card" tabindex="0" data-id=${card.id}>
                <img src="${card.card_images[0].image_url}" class="opponent-card-img" alt="${card.name}">
                <span class="visuallyhidden">${card.atk} Attack Points</div>
            </li>
        `;
        app.$opponentHandNode.append(markup);
    });
}

app.init = async () => {
    app.$playerHandNode = $(".player-hand");
    app.$opponentHandNode = $(".opponent-hand");
    app.$playerAtkDisplay = $(".player-atk-display");
    app.$opponentAtkDisplay = $(".opponent-atk-display");
    app.$gameBoard = $(".gameboard");
    app.$startGameButton = $(".start-game-button");
    app.$startGameScreen = $(".start-game");

    try {
        await app.getDeck();
        app.setupPlayerCards();
        app.setupOpponentCards();
        app.renderOpponentCards();
        app.renderPlayerCards();
        app.startGame();
    } catch (error) {
        throw error;
    }
}

$(function () {
    app.init();
});