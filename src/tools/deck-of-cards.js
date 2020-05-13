export default async () => {
    const deckResult = await fetch('https://deckofcardsapi.com/api/deck/new?jokers_enabled=true');
    const deck = await deckResult.json();
    const drawResult = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${deck.remaining}`);
    const draw = await drawResult.json();

    let deckImg = document.createElement("img");
    deckImg.src = "assets/deck.png";
    let result = {deck: deckImg};

    draw.cards.forEach(card => {
        let img = document.createElement("img");
        img.src = card.image;
        result[card.code] = img;
    });

    return result;
}