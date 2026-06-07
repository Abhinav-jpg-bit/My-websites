const cities = [
    { name: "Local Time", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
    { name: "New Delhi", zone: "Asia/Kolkata" },
    { name: "Tokyo", zone: "Asia/Tokyo" },
    {name: "Moscow", zone: "Europe/Moscow"},
];

const dashboard = document.getElementById("Dashboard");
const timeSlider = document.getElementById("timeSlider");

// 🛠️ FIX 1: Set the baseline directly to the current real-world hour
let baseDate = new Date(); 

// 🛠️ FIX 2: Set the slider handle to the current local hour automatically on load
const currentLocalHour = new Date().getHours();
timeSlider.value = currentLocalHour; 

const resetBtn = document.getElementById("resetBtn");

// 2. Attach a click event listener to it
resetBtn.addEventListener("click", () => {
    // Fetch the absolute newest hour matching the exact present moment
    const freshCurrentHour = new Date().getHours();
    
    // Set the physical slider thumb position back to this hour
    timeSlider.value = freshCurrentHour;
    
    // Run your render function to re-draw the timelines instantly!
    renderTimeline();
});

function renderTimeline() {
    dashboard.innerHTML = "";
    const selectedOffsetHour = parseInt(timeSlider.value);

    cities.forEach(city => {
        const row = document.createElement("div");
        row.className = "time-row";

        const infoDiv = document.createElement("div");
        infoDiv.className = "city-info";
        
        const localTimeString = new Intl.DateTimeFormat("en-US", {
            timeZone: city.zone,
            timeStyle: "short"
        }).format(new Date());

        infoDiv.innerHTML = `<h3>${city.name}</h3><p>${localTimeString}</p>`;
        row.appendChild(infoDiv);

        const strip = document.createElement("div");
        strip.className = "hours-strip";

        for (let i = 0; i < 24; i++) {
            // 🛠️ FIX 3: Calculate hours relative to our active sliding offset position
            // We calculate the millisecond distance relative to the current local hour index
            const hourOffset = i - currentLocalHour;
            const loopDate = new Date(baseDate.getTime() + (hourOffset * 60 * 60 * 1000));
            
            const targetHourString = new Intl.DateTimeFormat("en-US", {
                timeZone: city.zone,
                hour: "numeric",
                hour12: false
            }).format(loopDate);
            
            const displayHourNumeric = parseInt(targetHourString);

            const displayLabel = new Intl.DateTimeFormat("en-US", {
                timeZone: city.zone,
                hour: "numeric",
                hour12: true
            }).format(loopDate);

            const block = document.createElement("div");
            block.className = "hour-block";
            block.textContent = displayLabel.replace(":00", "");

            if (displayHourNumeric >= 9 && displayHourNumeric <= 17) {
                block.classList.add("working-hour");
            }
            if (i === selectedOffsetHour) {
                block.classList.add("selected-hour");
            }

            strip.appendChild(block);
        }

        row.appendChild(strip);
        dashboard.appendChild(row);
    });
}

timeSlider.addEventListener("input", renderTimeline);
renderTimeline();