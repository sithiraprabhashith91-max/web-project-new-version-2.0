/**
 * RideEasy - Cleaner, more professional vanilla JavaScript Controller.
 * Under 260 lines of code, fully browser-compliant with no import/require statements.
 */

// ==================== GLOBAL FLEET DATABASE ====================
const VEHICLE_DATA = [
    {
        id: 'sedan',
        name: 'Toyota Corolla (Sedan)',
        type: 'Sedan',
        price: 6500, // Rs.
        capacity: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        image: 'https://images.unsplash.com/photo-1621007947382-d3c38190d55a?auto=format&fit=crop&w=600&q=80',
        description: 'Smooth, highly fuel-efficient sedan perfectly suited for executive commutes and urban travel.'
    },
    {
        id: 'suv',
        name: 'Toyota Land Cruiser (SUV)',
        type: 'SUV',
        price: 15000, // Rs.
        capacity: 6,
        transmission: 'Automatic',
        fuel: 'Diesel',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        description: 'Commanding power, luxury leather seats, and unmatched rough- terrain capabilities for family groups.'
    },
    {
        id: 'van',
        name: 'Toyota HiAce (Van)',
        type: 'Van',
        price: 11000, // Rs.
        capacity: 12,
        transmission: 'Manual',
        fuel: 'Diesel',
        image: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?auto=format&fit=crop&w=600&q=80',
        description: 'Remarkably spacious cabin ideal for tourism, airport luggage transit, and group gatherings.'
    },
    {
        id: 'luxury',
        name: 'Mercedes-Benz E-Class',
        type: 'Luxury',
        price: 25000, // Rs.
        capacity: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
        description: 'Exceptional flagship styling and state-of-the-art safety setups. Rent for weddings or elite conferences.'
    }
];

// ==================== INITIALIZATION ENGINE ====================
document.addEventListener('DOMContentLoaded', () => {
    renderVehicles();
    setupSearchEngine();
    setupBookingForm();
    onVehicleSelectChange();
    setupSidebarToggle();

    // Navigation highlighting based on active path
    const activePath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link, .top-nav-link').forEach(link => {
        if (link.getAttribute('href') === activePath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ==================== SIDEBAR HAMBURGER INTERACTION ====================
function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar-menu');
    const mainContent = document.getElementById('main-workspace');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 991) {
                sidebar.classList.toggle('show-mobile');
            } else {
                sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('expanded');
            }
        });

        // Close mobile drawer when clicking container outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('show-mobile');
            }
        });
    }
}

// ==================== RENDERING VEHICLE CATALOGS ====================
function renderVehicles(filteredData = VEHICLE_DATA) {
    const featuredGrid = document.getElementById('featured-cars-container');
    if (featuredGrid) {
        featuredGrid.innerHTML = '';
        filteredData.slice(0, 3).forEach(car => {
            featuredGrid.appendChild(createVehicleCard(car, true));
        });
    }

    const fullGrid = document.getElementById('all-vehicles-container');
    if (fullGrid) {
        fullGrid.innerHTML = '';
        if (filteredData.length === 0) {
            fullGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No vehicles match your search filter criteria.</p>
                    <button class="btn btn-brand-primary btn-sm px-4 mt-2" onclick="resetSearchFilters()">Clear Search</button>
                </div>
            `;
            return;
        }
        filteredData.forEach(car => {
            fullGrid.appendChild(createVehicleCard(car, false));
        });
    }
}

function createVehicleCard(car, isFeatured) {
    const colObj = document.createElement('div');
    colObj.className = isFeatured ? 'col-md-4 mb-4' : 'col-md-6 col-lg-4 mb-4';
    colObj.innerHTML = `
        <div class="ride-card card h-100">
            <img src="${car.image}" class="card-img-top" alt="${car.name}">
            <div class="card-body d-flex flex-column justify-content-between p-4">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-dark border px-2 py-1">${car.type}</span>
                        <span class="text-success fw-bold">Rs. ${car.price.toLocaleString()}</span>
                    </div>
                    <h5 class="fw-bold text-dark text-lg mb-1">${car.name}</h5>
                    <p class="text-muted text-xs line-clamp-3 mb-3">${car.description}</p>
                </div>
                <div class="border-top pt-3 d-flex justify-content-between align-items-center text-xs text-muted">
                    <span>👥 ${car.capacity} Seats</span>
                    <span>⚙️ ${car.transmission}</span>
                    <a href="booking.html?id=${car.id}" class="btn btn-brand-primary btn-sm px-3">Book Now</a>
                </div>
            </div>
        </div>
    `;
    return colObj;
}

// ==================== LIVE SEARCH ENGINE ====================
function setupSearchEngine() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    
    searchInputs.forEach(input => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery && window.location.pathname.includes('vehicles.html')) {
            input.value = searchQuery;
            filterGlobalWorkspace(searchQuery);
        }

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (window.location.pathname.includes('vehicles.html') || window.location.pathname.includes('index.html')) {
                filterGlobalWorkspace(query);
            } else {
                input.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        window.location.href = `vehicles.html?q=${encodeURIComponent(query)}`;
                    }
                });
            }
        });
    });
}

function filterGlobalWorkspace(query) {
    if (!query) {
        renderVehicles(VEHICLE_DATA);
        return;
    }
    const filtered = VEHICLE_DATA.filter(car => 
        car.name.toLowerCase().includes(query) || 
        car.type.toLowerCase().includes(query) ||
        car.fuel.toLowerCase().includes(query) ||
        car.description.toLowerCase().includes(query)
    );
    renderVehicles(filtered);
}

function resetSearchFilters() {
    document.querySelectorAll('.global-search-input').forEach(input => input.value = '');
    filterGlobalWorkspace('');
}

// ==================== LIVE BILLING Ledger ====================
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    const selectSelect = document.getElementById('vehicleType');

    if (carId && selectSelect) {
        selectSelect.value = carId;
        onVehicleSelectChange();
    }

    const inputsToTrack = ['vehicleType', 'pickupDate', 'returnDate', 'location', 'driverYes', 'driverNo'];
    inputsToTrack.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', onVehicleSelectChange);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const required = ['fullName', 'email', 'phone', 'vehicleType', 'pickupDate', 'returnDate', 'location'];

        required.forEach(id => {
            const inp = document.getElementById(id);
            if (inp) {
                inp.classList.remove('is-invalid');
                if (!inp.value) {
                    inp.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });

        if (isValid) {
            const confMsg = document.getElementById('confirmationMsg');
            const submitBtn = document.getElementById('submitBtn');
            if (confMsg && submitBtn) {
                confMsg.classList.remove('d-none');
                submitBtn.disabled = true;
                setTimeout(() => {
                    form.reset();
                    confMsg.classList.add('d-none');
                    submitBtn.disabled = false;
                    onVehicleSelectChange();
                }, 3000);
            }
        }
    });
}

function onVehicleSelectChange() {
    const selectObj = document.getElementById('vehicleType');
    const pickupObj = document.getElementById('pickupDate');
    const returnObj = document.getElementById('returnDate');
    const driverYes = document.getElementById('driverYes');
    
    const billingSection = document.getElementById('billingCalculationArea');
    const baseRateEl = document.getElementById('billingBaseRate');
    const durationEl = document.getElementById('billingDuration');
    const driverChargeEl = document.getElementById('billingDriverCharge');
    const totalEl = document.getElementById('billingTotal');

    if (!selectObj || !billingSection) return;

    const selectedId = selectObj.value;
    const car = VEHICLE_DATA.find(c => c.id === selectedId);

    if (!car) {
        billingSection.classList.add('d-none');
        document.getElementById('billingPlaceholderMsg')?.classList.remove('d-none');
        return;
    }

    billingSection.classList.remove('d-none');
    document.getElementById('billingPlaceholderMsg')?.classList.add('d-none');

    let days = 1;
    if (pickupObj.value && returnObj.value) {
        const start = new Date(pickupObj.value);
        const end = new Date(returnObj.value);
        if (end > start) {
            days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        }
    }

    const driverRequired = driverYes && driverYes.checked;
    const driverFee = driverRequired ? 35000 * days : 0;
    const basePrice = car.price * days;

    baseRateEl.textContent = `Rs. ${car.price.toLocaleString()} / day`;
    durationEl.textContent = `${days} Day(s) (Rs. ${basePrice.toLocaleString()})`;
    driverChargeEl.textContent = `Rs. ${driverFee.toLocaleString()}`;
    totalEl.textContent = `Rs. ${(basePrice + driverFee).toLocaleString()}`;
}
