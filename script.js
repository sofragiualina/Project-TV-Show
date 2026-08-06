//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  showMatchCount(allEpisodes.length);//get all episodes at once
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
      
      

      <img
        src="${episode.image.medium}"
        alt="${episode.name}"
      >

      <div class="summary">
        ${episode.summary}
      </div>
      <a 
    href="${episode.url}" 
    target="_blank" 
    rel="noopener noreferrer"
    class="link"
  >
    View on TVMaze
  </a>
    `;

    rootElem.appendChild(card);
  }
}

window.onload = setup;
