
const VEHICLE_DATA = [
    {
        id: 'sedan',
        name: 'Toyota Corolla (Sedan)',
        type: 'Sedan',
        price: 6500, //Rs.
        capacity: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        image: 'images/toyota_corolla_black.jpg',
        description: 'A smooth, comfortable sedan ideal for business trips and city driving.'
    },
    {
        id: 'suv',  
        name: 'SUV - Land Cruiser',
        type: 'SUV',
        price: 15000, // Rs.
        capacity: 6,
        transmission: 'Automatic',
        fuel: 'Diesel',
        image: 'images/toyota_land_cruiser_grey.jpg',
        description: 'Spacious and powerful, great for long trips and family travel.'
    },
    {
        id: 'van',
        name: 'Toyota HiAce (Luxury VIP Van)',
        type: 'Van',
        price: 11000, // Rs.
        capacity: 12,
        transmission: 'Manual',
        fuel: 'Diesel',
        image: 'images/toyota_hiace_black (1).webp',
        description: 'Premium black luxury VIP passenger van featuring chrome grille detailing and executive-grade high-roof comfort.'
    },
    {
        id: 'bike',
        name: 'Honda CB Hornet (Motorbike)',
        type: 'Bike',
        price: 2000, // Rs.
        capacity: 2,
        transmission: 'Manual',
        fuel: 'Petrol',
        image: 'images/honda_cb_2.jpg',
        description: 'Sleek dark-grey street motorcycle loaded with sporty neon racing accents, ideal for fast urban commutes.'
    },
    {
        id: 'luxury',
        name: 'Mercedes E-Class (Luxury)',
        type: 'Luxury',
        price: 25000, // Rs.
        capacity: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        image: 'images/mercedes_e_class_black.jpg',
        description: 'Travel in style and comfort for weddings and special events.'
    },
    {
        id: 'minibus',
        name: 'Toyota Coaster (Mini Bus)',
        type: 'Mini Bus',
        price: 18000, // Rs.
        capacity: 25,
        transmission: 'Manual',
        fuel: 'Diesel',
        image: 'images/toyota_coaster_1.jpg',
        description: 'Luxury champagne-gold passenger coaster minibus, exceptionally spacious and popular for group excursions.'
    },
    {
        id: 'cab',
        name: 'Toyota Hilux (4x4 Double Cab)',
        type: 'Double Cab',
        price: 12500, // Rs.
        capacity: 5,
        transmission: 'Manual',
        fuel: 'Diesel',
        image: 'images/toyota_hilux_1.jpg',
        description: 'Rugged 4x4 double cab pickup suited for tough terrain, executive site visits, or outstation family trips.'
    },
    {
        id: 'electric',
        name: 'Tesla Model 3 (Premium Electric)',
        type: 'Electric',
        price: 19000, // Rs.
        capacity: 5,
        transmission: 'Automatic',
        fuel: 'Electric',
        image: 'images/tesla_model_3_1.jpg',
        description: 'Advanced all-electric premium sedan offering Whisper-quiet drives with maximum luxury and zero-emissions tech.'
    },
    {
        id: 'hatchback',
        name: 'Suzuki Swift (Premium Hatchback)',
        type: 'Hatchback',
        price: 4500, // Rs.
        capacity: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        image: 'images/suzuki_swift_1.jpg',
        description: 'Compact, exceptionally fuel-efficient hatchback ideal for easy city commutes and nimble inner-city driving.'
    },
    {
        id: 'crossover',
        name: 'Honda Vezel (Hybrid Crossover)',
        type: 'Crossover',
        price: 9500, // Rs.
        capacity: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        image: 'images/honda_vezel_2.jpg',
        description: 'Sophisticated hybrid crossover blending high-ground clearance versatility, smooth performance, and modern features.'
    }
];



document.addEventListener('DOMContentLoaded', function ()  {
    renderVehicles();
    setupSearchEngine() ;
    setupBookingForm();
    onVehicleSelectChange();
    setupSidebarToggle();
    setupLiveClock();

    let activePath = window.location.pathname.split('/').pop();
    if (activePath === "") {
        activePath = "index.html";
    }

    let navLinks = document.querySelectorAll('.sidebar-link, .top-nav-link');
    for (let i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute('href') === activePath) {
            navLinks[i].classList.add('active');
        } else {
            navLinks[i].classList.remove('active');
        }
    }
});

function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar-menu');
    const mainContent = document.getElementById('main-workspace');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (window.innerWidth <= 991) {
                sidebar.classList.toggle('show-mobile');
            } else {
                sidebar.classList.toggle('collapsed');
                if (mainContent) {
                    mainContent.classList.toggle('expanded');
                }
            }
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 991 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('show-mobile');
            }
        });
    }
}

       
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
            <img src="${car.image}" class="card-img-top" alt="${car.name}" referrerPolicy="no-referrer">
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
                    <span> ${car.capacity} Seats</span>
                    <span> ${car.transmission}</span>
                    <a href="booking.html?id=${car.id}" class="btn btn-brand-primary btn-sm px-3">Book Now</a>
                </div>
            </div>
        </div>
    `;
    return colObj;
}


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
    const filterSelect = document.getElementById('vehicle-type-filter');
    if (filterSelect) filterSelect.value = '';
    filterGlobalWorkspace('');
}


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
    
    for (let j = 0; j < inputsToTrack.length; j++) {
        let el = document.getElementById(inputsToTrack[j]);
        if (el) {
            el.addEventListener('change', onVehicleSelectChange);
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        let isValid = true;
        
        const required = ['fullName'  , 'email', 'phone','vehicleType', 'pickupDate', 'returnDate', 'location'];

        for (let k = 0; k < required.length; k++) {
            let fieldId = required[k];
            let inp = document.getElementById(fieldId);
            if (inp) {
                inp.classList.remove('is-invalid');
                if (inp.value.trim() === "") {
                    inp.classList.add('is-invalid');
                    isValid = false;
                }
            }
        }

        let emailField = document.getElementById('email');
        if (emailField && emailField.value !== "") {
            if (emailField.value.indexOf('@') === -1) {
                emailField.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (isValid === true) {
            const confMsg = document.getElementById('confirmationMsg');
            const submitBtn = document.getElementById('submitBtn');
            if (confMsg && submitBtn) {
                confMsg.classList.remove('d-none');
                submitBtn.disabled = true;
                
                setTimeout(function () {
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
    let car = null;
    for (let i = 0; i < VEHICLE_DATA.length; i++) {
        if (VEHICLE_DATA[i].id === selectedId) {
            car = VEHICLE_DATA[i];
            break;
        }
    }

    if (!car) {
        billingSection.classList.add('d-none');
        document.getElementById('billingPlaceholderMsg')?.classList.remove('d-none');
        return;
    }

    billingSection.classList.remove('d-none');
    document.getElementById('billingPlaceholderMsg')?.classList.add('d-none');

    let days = 1;
if (pickupObj.value !== "" && returnObj.value !== "") {
    let start = new Date(pickupObj.value);
    let end = new Date(returnObj.value);
    if (end > start) {
        let diffInMs = end.getTime() - start.getTime(); // Lecture 04 Date Object න්‍යාය
        let msInDay = 1000 * 60 * 60 * 24;
        days = Math.ceil(diffInMs / msInDay);
    }
}

let driverRequired = false;
if (driverYes && driverYes.checked) {
    driverRequired = true;
}

let driverFee = 0;
if (driverRequired === true) {
    driverFee = 3500 * days;
}

let basePrice = car.price * days;
let totalPrice = basePrice + driverFee;

    baseRateEl.textContent = "Rs. "+ car.price.toLocaleString() + " / day";
    durationEl.textContent = days +" Day(s) (Rs. " + basePrice.toLocaleString() + ")";
    driverChargeEl.textContent = "Rs. "+driverFee.toLocaleString();
    totalEl.textContent = "Rs. " +   totalPrice.toLocaleString();
}


function setupLiveClock() {
    const clockEl = document.getElementById('nav-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date(); 
        clockEl.textContent = now.toDateString() + " - " + now.toLocaleTimeString();
    }

    updateClock();
    setInterval(updateClock, 1000);
}
