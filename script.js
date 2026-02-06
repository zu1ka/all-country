const fetchCountryData = async () => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags");
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    } catch (error) {
        console.error("Error fetching countries:", error);
        return null;
    }
};

const countryUnordered = document.querySelector(".country-container");
const searchInput = document.querySelector("#country-search");
const searchBtn = document.querySelector("#search-btn");
const regionFilter = document.querySelector("#region-filter");
const darkModeBtn = document.querySelector("#dark-mode-btn");

let countriesData = [];

const showCountry = (inputText = "", regionText = "") => {
    countryUnordered.innerHTML = "";

    if (countriesData.length === 0) {
        countryUnordered.innerHTML = "<li>No countries available</li>";
        return;
    }

    const filteredData = countriesData.filter((item) => {
        const matchesSearch = item.name.common.toLowerCase().includes(inputText.toLowerCase());
        const matchesRegion = !regionText || item.region === regionText;
        return matchesSearch && matchesRegion;
    });

    if (filteredData.length === 0) {
        countryUnordered.innerHTML = "<li>No countries found</li>";
        return;
    }

    filteredData.forEach((item) => {
        const countryLi = document.createElement("li");
        const countryImg = document.createElement("img");
        const countryName = document.createElement("h2");
        const countryPopulation = document.createElement("p");
        const countryRegion = document.createElement("p");
        const countryCapital = document.createElement("p");

        countryLi.append(countryImg, countryName, countryPopulation, countryRegion, countryCapital);
        countryUnordered.append(countryLi);

        countryImg.src = item.flags.png;
        countryImg.alt = `${item.name.common} flag`;
        countryName.textContent = item.name.common;
        countryPopulation.textContent = `Population: ${item.population.toLocaleString()}`;
        countryRegion.textContent = `Region: ${item.region}`;
        countryCapital.textContent = `Capital: ${item.capital ? item.capital[0] : "N/A"}`;

        countryLi.addEventListener("click", () => {
            document.querySelectorAll(".country-container li").forEach((list) => {
                list.classList.remove("selected-list");
            });
            countryLi.classList.add("selected-list");
        });
    });
};

// Load countries on page load
const load = async () => {
    countryUnordered.innerHTML = "<li>Loading countries...</li>";
    countriesData = await fetchCountryData();
    if (countriesData) {
        showCountry();
    } else {
        countryUnordered.innerHTML = "<li>Error loading countries</li>";
    }
};

// Search button
searchBtn.addEventListener("click", () => {
    const inputText = searchInput.value.trim();
    const regionText = regionFilter.value;
    showCountry(inputText, regionText);
});

// Search on Enter key
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const inputText = searchInput.value.trim();
        const regionText = regionFilter.value;
        showCountry(inputText, regionText);
    }
});

// Region filter
regionFilter.addEventListener("change", () => {
    const inputText = searchInput.value.trim();
    const regionText = regionFilter.value;
    showCountry(inputText, regionText);
});

// Dark mode toggle
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent = "Light Mode";
}


load();


