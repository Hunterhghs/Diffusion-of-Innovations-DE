/**
 * DEVELOPMENT ECONOMICS INNOVATION DIFFUSION SIMULATOR
 * Math model based on the Bass Diffusion Model & Economic Constraints
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Simulator Parameters & Chart
    initSimulator();

    // 2. Setup Case Studies Tab Switching
    initCaseStudies();
});

// Global chart reference
let diffusionChart = null;

function initSimulator() {
    // Select slider elements
    const socialSlider = document.getElementById("slider-social");
    const creditSlider = document.getElementById("slider-credit");
    const riskSlider = document.getElementById("slider-risk");
    const infraSlider = document.getElementById("slider-infra");

    // Select text value displays
    const socialVal = document.getElementById("val-social");
    const creditVal = document.getElementById("val-credit");
    const riskVal = document.getElementById("val-risk");
    const infraVal = document.getElementById("val-infra");

    // Live update slider value tags on drag
    const updateLabel = (slider, display) => {
        display.textContent = `${slider.value}%`;
    };

    const runSimulationAndUpdate = () => {
        updateLabel(socialSlider, socialVal);
        updateLabel(creditSlider, creditVal);
        updateLabel(riskSlider, riskVal);
        updateLabel(infraSlider, infraVal);

        const simData = calculateDiffusion(
            parseFloat(socialSlider.value),
            parseFloat(creditSlider.value),
            parseFloat(riskSlider.value),
            parseFloat(infraSlider.value)
        );

        updateChart(simData);
        updateStats(simData);
    };

    // Attach event listeners
    [socialSlider, creditSlider, riskSlider, infraSlider].forEach(slider => {
        slider.addEventListener("input", runSimulationAndUpdate);
    });

    // Run initial simulation
    runSimulationAndUpdate();
}

/**
 * Bass Diffusion Model adjusted for Development Economics constraints.
 * 
 * Equations:
 * Coefficient of Innovation (p) represents external factors: Credit Subsidies, Infrastructure.
 * Coefficient of Imitation (q) represents internal network factors: Social Density, Risk Sharing.
 * Adoption Ceiling (M) represents the maximum potential market size, capped by infrastructure/risk constraints.
 */
function calculateDiffusion(social, credit, risk, infra) {
    const years = 25;
    const labels = [];
    const cumulativeAdoption = [];
    const adoptionVelocity = [];

    // Scale inputs to model parameters (from 0 to 1)
    const socialPct = social / 100;
    const creditPct = credit / 100;
    const riskPct = risk / 100;
    const infraPct = infra / 100;

    // Parameter modeling
    // p = coefficient of innovation (external adoption drivers)
    const p = 0.003 + (creditPct * 0.035) + (infraPct * 0.012);
    
    // q = coefficient of imitation (social learning/imitation rate)
    // In dev economics, crop insurance or safety nets reduce peer risk aversion, allowing higher q.
    const q = 0.04 + (socialPct * 0.16) + (riskPct * 0.08);

    // M = ceiling (long-run target market size)
    // Infrastructure and structural risk limit the absolute percentage of reachable population.
    const M = 0.45 + (infraPct * 0.38) + (riskPct * 0.12);

    let F = 0; // Initial cumulative adoption (at t = 0)
    
    for (let t = 0; t <= years; t++) {
        labels.push(`Year ${t}`);
        
        if (t === 0) {
            cumulativeAdoption.push(0);
            adoptionVelocity.push(0);
            continue;
        }

        // Bass rate of change: dF/dt = (p + q * (F / M)) * (M - F)
        // Discretized approximation:
        const rate = (p + q * (F / M)) * (M - F);
        
        // Update cumulative adoption
        F = Math.min(M, F + rate);

        cumulativeAdoption.push(parseFloat((F * 100).toFixed(1)));
        adoptionVelocity.push(parseFloat((rate * 100).toFixed(1)));
    }

    return {
        labels,
        cumulative: cumulativeAdoption,
        velocity: adoptionVelocity,
        ceiling: Math.round(M * 100),
        p,
        q
    };
}

function updateChart(simData) {
    const ctx = document.getElementById("chartDiffusion").getContext("2d");

    const chartConfig = {
        type: "line",
        data: {
            labels: simData.labels,
            datasets: [
                {
                    label: "Cumulative Adoption (% of population)",
                    data: simData.cumulative,
                    borderColor: "#0F4C5C", // Spruce Teal
                    backgroundColor: "rgba(15, 76, 92, 0.05)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    yAxisID: "y-cumulative"
                },
                {
                    label: "Adoption Velocity (% new adopters/yr)",
                    data: simData.velocity,
                    borderColor: "#E5A93C", // Amber Gold
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3,
                    yAxisID: "y-velocity"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: {
                            family: "'Source Sans 3', sans-serif",
                            size: 11,
                            weight: 600
                        },
                        boxWidth: 15,
                        color: "#252B2D"
                    }
                },
                tooltip: {
                    titleFont: { family: "'Source Sans 3', sans-serif" },
                    bodyFont: { family: "'Source Sans 3', sans-serif" }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Source Sans 3', sans-serif", size: 10 },
                        color: "#627278"
                    }
                },
                "y-cumulative": {
                    type: "linear",
                    position: "left",
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Cumulative Adoption (%)",
                        font: { family: "'Source Sans 3', sans-serif", size: 11, weight: 600 },
                        color: "#0F4C5C"
                    },
                    ticks: {
                        font: { family: "'Source Sans 3', sans-serif", size: 10 },
                        color: "#627278"
                    }
                },
                "y-velocity": {
                    type: "linear",
                    position: "right",
                    min: 0,
                    max: 15,
                    title: {
                        display: true,
                        text: "Annual Growth Rate (%)",
                        font: { family: "'Source Sans 3', sans-serif", size: 11, weight: 600 },
                        color: "#E5A93C"
                    },
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Source Sans 3', sans-serif", size: 10 },
                        color: "#627278"
                    }
                }
            }
        }
    };

    if (diffusionChart) {
        diffusionChart.data.labels = simData.labels;
        diffusionChart.data.datasets[0].data = simData.cumulative;
        diffusionChart.data.datasets[1].data = simData.velocity;
        diffusionChart.update();
    } else {
        diffusionChart = new Chart(ctx, chartConfig);
    }
}

function updateStats(simData) {
    // 1. Calculate long-term cap
    const capEl = document.getElementById("stat-cap");
    capEl.textContent = `${simData.ceiling}%`;

    // 2. Calculate peak adoption year
    let maxVelocity = -1;
    let peakYear = 0;
    for (let i = 0; i < simData.velocity.length; i++) {
        if (simData.velocity[i] > maxVelocity) {
            maxVelocity = simData.velocity[i];
            peakYear = i;
        }
    }
    const peakEl = document.getElementById("stat-peak-year");
    peakEl.textContent = `Year ${peakYear}`;

    // 3. Calculate time to 50% of the long-term cap
    const targetAdoption = simData.ceiling / 2;
    let halfTimeYear = -1;
    for (let i = 0; i < simData.cumulative.length; i++) {
        if (simData.cumulative[i] >= targetAdoption) {
            halfTimeYear = i;
            break;
        }
    }
    const halftimeEl = document.getElementById("stat-halftime");
    halftimeEl.textContent = halfTimeYear >= 0 ? `Year ${halfTimeYear}` : "N/A";
}

function initCaseStudies() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const casePanels = document.querySelectorAll(".case-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Deactivate active states
            tabButtons.forEach(b => b.classList.remove("active"));
            casePanels.forEach(p => p.classList.remove("active"));

            // Activate target
            btn.classList.add("active");
            document.getElementById(`case-${targetTab}`).classList.add("active");
        });
    });
}
