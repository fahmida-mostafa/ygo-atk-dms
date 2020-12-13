const app = {};

//Hides the intro screen when you hit start game.
app.startGame = () => {
    app.$startGameButton.on("click", () => {
        app.$startGameScreen.css("display", "none");
    });
}

app.init = async () => {
    app.$startGameButton = $(".start-game-button");
    app.$startGameScreen = $(".start-game");

    try {
        app.startGame();
    } catch (error) {
        throw error;
    }
}

$(function () {
    app.init();
});