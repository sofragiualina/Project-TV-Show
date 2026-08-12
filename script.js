let allEpisodes = [];
// create a variable allShows to store  all shows  arrays
let allShows = [];
const episodesCache = {}; // create  episodes object, so we never re-fetch a show

const SHOWS_URL = "https://api.tvmaze.com/shows";

async function setup() {
  const statusMessage = document.getElementById("statusMessage");
  const searchInput = document.getElementById("searchInput");
  const episodesSelector = document.getElementById("episodeSelector");

  try {
    // Fetch the episodes from the API only once
    const response = await fetch(API_URL);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to load episodes");
    }

    // Convert the response into JavaScript data
    allEpisodes = await response.json();

    // Hide the loading message
    statusMessage.textContent = "";

    // Display all episodes
    makePageForEpisodes(allEpisodes);

    // Display the number of episodes
    showMatchCount(allEpisodes.length, allEpisodes.length);

    // Populate the dropdown
    populateSelector(allEpisodes);

    // Search functionality
    searchInput.addEventListener("input", () => {
      // Reset dropdown when searching
      episodesSelector.value = "all";

      const query = searchInput.value.toLowerCase();

      const filteredEpisodes = allEpisodes.filter((episode) => {
        const name = (episode.name || "").toLowerCase();
        const summary = (episode.summary || "").toLowerCase();

        return name.includes(query) || summary.includes(query);
      });

      makePageForEpisodes(filteredEpisodes);

      showMatchCount(filteredEpisodes.length, allEpisodes.length);
    });

    // Dropdown functionality
    episodesSelector.addEventListener("change", () => {
      const selectedId = episodesSelector.value;

      // Show all episodes
      if (selectedId === "all") {
        searchInput.value = "";

        makePageForEpisodes(allEpisodes);

        showMatchCount(allEpisodes.length, allEpisodes.length);

        return;
      }

      // Show selected episode
      searchInput.value = "";

      const singleEpisode = allEpisodes.filter(
        (episode) => String(episode.id) === selectedId,
      );

      makePageForEpisodes(singleEpisode);

      showMatchCount(singleEpisode.length, allEpisodes.length);
    });
  } catch (error) {
    // Show an error message to the user
    // instead of only using console.error()
    statusMessage.textContent =
      "Sorry, we could not load the episodes. Please try again later.";

    statusMessage.className = "error";

    showMatchCount(0, 0);
  }
}

// Populate the episode dropdown
function populateSelector(episodeList) {
  const selector = document.getElementById("episodeSelector");

  if (!selector) {
    return;
  }

  for (const episode of episodeList) {
    const option = document.createElement("option");

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");

    const episodeCode = `S${season}E${number}`;

    option.value = episode.id;

    option.textContent = `${episodeCode} - ${episode.name}`;

    selector.appendChild(option);
  }
}

// Display episode count
function showMatchCount(matchCount, totalCount) {
  const matchCountElem = document.getElementById("matchCount");

  if (matchCountElem) {
    matchCountElem.textContent = `Displaying ${matchCount}/${totalCount}`;
  }
}

// Display episodes on the page
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  if (!rootElem) {
    return;
  }

  // Clear the existing episodes
  rootElem.innerHTML = "";

  // Display a message if no episodes match
  if (episodeList.length === 0) {
    rootElem.textContent = "No episodes found.";
    return;
  }

  // Loop through every episode
  for (const episode of episodeList) {
    const card = document.createElement("article");

    card.className = "card";

    // Create episode code
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");

    const episodeCode = `S${season}E${number}`;

    // Create heading
    const heading = document.createElement("h2");

    heading.textContent = `${episode.name} - ${episodeCode}`;

    card.appendChild(heading);

    // Create image
    const image = document.createElement("img");

    image.src = episode.image
      ? episode.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";

    image.alt = episode.name;

    card.appendChild(image);

    // Create summary
    const summary = document.createElement("div");

    summary.className = "summary";

    summary.innerHTML = episode.summary || "No summary available.";

    card.appendChild(summary);

    // Create TVMaze link
    const link = document.createElement("a");

    link.href = episode.url;

    link.target = "_blank";

    link.rel = "noopener noreferrer";

    link.className = "link";

    link.textContent = "View on TVMaze";

    card.appendChild(link);

    // Add card to page
    rootElem.appendChild(card);
  }
}

// Start the application
window.addEventListener("load", setup);
