const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const inputUnit = document.getElementById("inputUnit");
const errorMessage = document.getElementById("errorMessage");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");

function formatTemperature(value) {
    // Avoid displaying negative zero due to rounding.
    const rounded = Math.abs(value) < 0.005
        ? 0
        : Math.round(value * 100) / 100;

    return rounded.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        useGrouping: false
    });
}

function showError(message) {
    errorMessage.textContent = message;

    // Clear old results so invalid input cannot leave misleading values.
    celsiusResult.innerHTML = '— <small>°C</small>';
    fahrenheitResult.innerHTML = '— <small>°F</small>';
    kelvinResult.innerHTML = '— <small>K</small>';
}

function convertTemperature(value, unit) {
    let celsius;

    // Convert the input into Celsius first.
    if (unit === "C") {
        celsius = value;
    } else if (unit === "F") {
        celsius = (value - 32) * 5 / 9;
    } else {
        celsius = value - 273.15;
    }

    // Convert Celsius into the other two units.
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    return {
        celsius,
        fahrenheit,
        kelvin
    };
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    errorMessage.textContent = "";

    const rawValue = temperatureInput.value.trim();
    const value = temperatureInput.valueAsNumber;
    const unit = inputUnit.value;

    // 1. Check for empty or invalid numeric input.
    if (rawValue === "" || !Number.isFinite(value)) {
        showError("Please enter a valid temperature number.");
        temperatureInput.focus();
        return;
    }

    // 2. Validate absolute zero in the selected input unit.
    if (unit === "C" && value < -273.15) {
        showError("Celsius cannot be below −273.15°C (absolute zero).");
        temperatureInput.focus();
        return;
    }

    if (unit === "F" && value < -459.67) {
        showError("Fahrenheit cannot be below −459.67°F (absolute zero).");
        temperatureInput.focus();
        return;
    }

    if (unit === "K" && value < 0) {
        showError("Kelvin cannot be below 0 K (absolute zero).");
        temperatureInput.focus();
        return;
    }

    // 3. Perform the conversion.
    const result = convertTemperature(value, unit);

    // 4. Display all three converted values.
    celsiusResult.innerHTML =
        `${formatTemperature(result.celsius)} <small>°C</small>`;

    fahrenheitResult.innerHTML =
        `${formatTemperature(result.fahrenheit)} <small>°F</small>`;

    kelvinResult.innerHTML =
        `${formatTemperature(result.kelvin)} <small>K</small>`;
});

// Remove the previous error while the user edits the input.
temperatureInput.addEventListener("input", function () {
    errorMessage.textContent = "";
});
