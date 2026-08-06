//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  // Loop through every episode
  for (const episode of episodeList) {
    const card = document.createElement("article");
    card.className = "card";

    // Create episode code
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    // Add the content
    card.innerHTML = `
      <h2>${episode.name}-${episodeCode}</h2>
      //Implemented the episodename and episodeCode on the same h2 element
      

      <img
        src="${episode.image.medium}"
        alt="${episode.name}"
      >

      <div class="summary">
        ${episode.summary}
      </div>
    `;

    rootElem.appendChild(card);
  }
}

window.onload = setup;
