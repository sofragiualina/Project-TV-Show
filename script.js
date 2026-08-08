//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  showMatchCount(allEpisodes.length, allEpisodes.length);//get all episodes at once and display how many match filter, and how many in the dataset
  // populate the drop-down selector options dynamically
  populateSelector(allEpisodes);


  const searchInput = document.getElementById("searchInput");//Render the SearchInput in the dom
  //Attach an input listener to the search box
  // Render the episodeSelector in the DOM
  const episodesSelector = document.getElementById("episodeSelector");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const name = (episode.name || "").toLowerCase();
      const summary = (episode.summary || "").toLowerCase();
      return name.includes(query) || summary.includes(query);
    });

    makePageForEpisodes(filteredEpisodes);
    showMatchCount(filteredEpisodes.length,allEpisodes.length);
  });
}
//Implement the function that  will display episode count
function showMatchCount(matchCount,totalCount){
const matchCountElem = document.getElementById("matchCount");
if (matchCountElem) {
  matchCountElem.textContent =`Displaying ${matchCount}/${totalCount}`
}
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
