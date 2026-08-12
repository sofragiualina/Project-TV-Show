let allEpisodes = [];
// create a variable allShows to store  all shows  arrays
let allShows = [];
const episodesCache = {}; // create  episodes object, so we never re-fetch a show

const SHOWS_URL = "https://api.tvmaze.com/shows";
const episodesUrl = (showId) =>
  `https://api.tvmaze.com/shows/${showId}/episodes`;

async function setup() {
  const statusMessage = document.getElementById("statusMessage");
  const searchInput = document.getElementById("searchInput");
  const episodesSelector = document.getElementById("episodeSelector");
  const showSelector = document.getElementById("showSelector");

  try {
    // 1. Fetch the list of shows ONCE, ever
    const showsResponse = await fetch(SHOWS_URL);
    if (!showsResponse.ok) throw new Error("Failed to load shows");
    allShows = await showsResponse.json();

    // Alphabetical, case-insensitive
    allShows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    populateShowSelector(allShows);

    // 2. Load episodes for the first show in the sorted list
    await loadShow(showSelector.value);

    statusMessage.textContent = "";

    // 3. Search functionality (unchanged — operates on current allEpisodes)
    searchInput.addEventListener("input", () => {
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

    // 5. Show dropdown functionality 
    showSelector.addEventListener("change", async () => {
      statusMessage.textContent = "Loading episodes, please wait...";
      statusMessage.className = "";

      try {
        await loadShow(showSelector.value);
        statusMessage.textContent = "";
      } catch (error) {
        statusMessage.textContent =
          "Sorry, we could not load the episodes. Please try again later.";
        statusMessage.className = "error";
      }
    });
  } catch (error) {
    statusMessage.textContent =
      "Sorry, we could not load the shows. Please try again later.";
    statusMessage.className = "error";
    showMatchCount(0, 0);
  }
}
// Fetch (or reuse cached) episodes for a show, then render them
async function loadShow(showId) {
  const searchInput = document.getElementById("searchInput");
  const episodeSelector = document.getElementById("episodeSelector");

  searchInput.value = "";
  episodeSelector.value = "all";

  if (!episodesCache[showId]) {
    const response = await fetch(episodesUrl(showId));
    if (!response.ok) throw new Error("Failed to load episodes");
    episodesCache[showId] = await response.json();
  }

  allEpisodes = episodesCache[showId];

  makePageForEpisodes(allEpisodes);
  showMatchCount(allEpisodes.length, allEpisodes.length);
  populateEpisodeSelector(allEpisodes);
}

// Populate the show dropdown
function populateShowSelector(showList) {
  const selector = document.getElementById("showSelector");
  if (!selector) return;

  selector.innerHTML = "";

  for (const show of showList) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selector.appendChild(option);
  }
}
function populateEpisodeSelector(episodes) {
  const selector = document.getElementById("episodeSelector");
  if (!selector) return;

  // Clear old options
  selector.innerHTML = "";

  // Add the "All episodes" option first
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Episodes";
  selector.appendChild(allOption);

  // Add each episode
  episodes.forEach(({ id, name, season, number }) => {
    const option = document.createElement("option");

    const seasonCode = String(season).padStart(2, "0");
    const numberCode = String(number).padStart(2, "0");
    const episodeCode = `S${seasonCode}E${numberCode}`;

    option.value = id;
    option.textContent = `${episodeCode} - ${name}`;

    selector.appendChild(option);
  });
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