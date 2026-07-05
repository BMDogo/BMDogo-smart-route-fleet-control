// ===== BMDOGO TECH SOURCE CODE ==== //

// ===== DECLERING GLOBAL FLEET DATA VAULT ==== //
let masterfleetRecord = [];
const LOCAL_SAVED_DATA = 'BMDogo_FleetData';


// ==== PREVENTING WINDOW DOCUMENT FROM CRASHING DURING LOADING SCRIPT ==== //
window.addEventListener('DOMContentLoaded', () => {

});


// CREATING A GLOBAL FUNCTION TO FETCH DATA FROM JSON ==== //
async function initializeFleetSystem() {
    try {
        const loadSavedData = localStorage.getItem(LOCAL_SAVED_DATA);
        if (loadSavedData) {
            masterfleetRecord = JSON.parse(loadSavedData);
             console.log("🚚 State loaded successfully from localStorage vault.");
        } else {
            const response = await fetch('fleet.json');
            masterfleetRecord = await response.json();
            console.log("🌐 Vault empty. Fetching raw database file via async pipeline...");

            localStorage.setItem(LOCAL_SAVED_DATA, JSON.stringify(masterfleetRecord));
            console.log('data uploaded to localStorage successful....');
           
            // ==== ENJECTING generalSystemUIUpdater() TO GLOBAL FUNCTION ====//
                generalSystemUIUpdater()
        };
    } catch (error) {
        fleetDisplayer.innerHTML = `<p  class="danger-highlight" style="grid-column: 1; text-align: center; padding: 40px;">
        SOMETHING WENT WRONG CONTACT BMDOGO FOR MORE INFO... ${error}</P>`;
        console.log(' SOMETHING WENT WRONG CONTACT BMDOGO FOR MORE INFO...', error);
        
    };
};
initializeFleetSystem();


// ==== MASTER FUNCTION THAT RUNS ALL THE SYSTEM FUNCTIONS ACTION ==== //
function generalSystemUIUpdater() {
    updateLiveFleetDisplayer()
    updateHubStatuscenter()
    filteredVehiclesSystem()
    updateAnalyticsPanel()
}

// ==== SUB-FUNC THAT UPDATE FLEETDISPALYER SCREEN ==== //
function updateLiveFleetDisplayer() {
   let fleetDisplayer = document.getElementById("fleetGrid");
    let activeCount = document.getElementById('activeCount'); 

  const searchValue = document.getElementById('searchDriver').value.toLowerCase();
  const filteredValue = document.getElementById('filterHub').value;
  

const filteredData = masterfleetRecord.filter(truck =>{
       const matchfiltered = (filteredValue === 'All' || truck.hub === filteredValue);
       const matchSearch = truck.driver.toLowerCase().includes(searchValue);
       return matchfiltered && matchSearch;
       });

  activeCount.innerText = filteredData.length;

  if (filteredData.length === 0) {
  fleetDisplayer.innerHTML = `<p class="no-results" style="grid-column: 1; text-align: center; padding: 40px; color: var(--text-muted);">No active vehicles match your parameters.</p>`;
  return;
}

   fleetDisplayer.innerHTML = filteredData.map(truck => {
        const isOverloaded = truck.weightKG > 800;
        return  `
          <div class="vehicle-card ${isOverloaded ? 'overload-danger' : ''}" data-id="${truck.id}">
                <div class="card-header">
                    <h3 class="vehicle-id">${truck.vehicle || `Fleet #${truck.id}`}</h3>
                    <span class="status-indicator ${isOverloaded ? 'status-alert' : 'status-transit'}">
                        ${isOverloaded ? '⚠️ OVERLOAD' : truck.status}
                    </span>
                </div>
                <div class="card-body">
                    <p>Driver: <span class="data-highlight">${truck.driver}</span></p>
                    <p>Weight: <span class="${isOverloaded ? 'danger-highlight' : 'data-highlight'}">${truck.weightKG} KG</span></p>
                    <div class="reassign-block">
                        <label>Hub:</label>
                        <select class="card-select hub-reassigner" data-truck-id="${truck.id}">
                            <option value="Kano" ${truck.hub === 'Kano' ? 'selected' : ''}>Kano</option>
                            <option value="Abuja" ${truck.hub === 'Abuja' ? 'selected' : ''}>Abuja</option>
                            <option value="Lagos" ${truck.hub === 'Lagos' ? 'selected' : ''}>Lagos</option>
                            <option value="Kaduna" ${truck.hub === 'Kaduna' ? 'selected' : ''}>Kaduna</option>
                        </select>
                    </div>
                </div>
            </div>
        `
    }).join("")
   // fleetDisplayer.innerHTML = HTMLFleetContainer;
    console.log("Data loaded to Displayer successful...");
}
// updateLiveFleetDisplayer()

// ==== SUB-FUNC FOR HUB-STATUS CENTER ==== //

function updateHubStatuscenter(){

    const kanoHub = masterfleetRecord.filter(kano => kano.hub === "Kano").length;
    const abujaHub = masterfleetRecord.filter(abuja => abuja.hub === 'Abuja').length;
    const lagosHub = masterfleetRecord.filter(lagos => lagos.hub === "Lagos").length;
    const kadunaHub = masterfleetRecord.filter(kaduna => kaduna.hub === "Kaduna").length;

    
    document.getElementById('countKano').textContent = `[${kanoHub}]`;
    document.getElementById('countAbuja').textContent = `[${abujaHub}]`;
    document.getElementById('countLagos').textContent = `[${lagosHub}]`;
    document.getElementById('countKaduna').textContent = `[${kadunaHub}]`;

   // console.log("Hub status center updated...");
    
}

// ==== BMDOGO TECH SOURCE CODE ====

 // ==== SUB-FUNC THAT FILTER AND SEARCH THE FLEET DATA ==== //
function filteredVehiclesSystem(){
      document.getElementById('fleetGrid').addEventListener('change', (e) => {
        console.log('click');
        
        if (e.target.classList.contains('hub-reassigner')) {
         const targetFleetcard = parseInt(e.target.dataset.truckId)
         const newReassignValue = e.target.value;
        
         const matchedFleetRecord = masterfleetRecord.find(truck => truck.id === targetFleetcard);
         if (matchedFleetRecord) {
            matchedFleetRecord.hub = newReassignValue;
         }
           updateHubStatuscenter()    
           updateLiveFleetDisplayer()
           localStorage.setItem(LOCAL_SAVED_DATA, JSON.stringify(masterfleetRecord))
        }
    });
  document.getElementById('filterHub').addEventListener('change', updateLiveFleetDisplayer);
document.getElementById('searchDriver').addEventListener('input', updateLiveFleetDisplayer)
  
}
//updateLiveFleetDisplayer()


// ==== SUB-FUNC THAT UPDATE HUB-STATUS CENTER ==== //
function  updateAnalyticsPanel() {
  const totalFleet = masterfleetRecord.reduce((start, end) => start + end.weightKG, 0);
  const overloadedFleet = masterfleetRecord.filter(over => over.weightKG > 800).length;
  const idleFleet = masterfleetRecord.filter(idle => idle.status === "Idle").length;

  document.getElementById('totalWeight').textContent = totalFleet.toLocaleString();
  document.getElementById('overloadCount').textContent = overloadedFleet;
  document.getElementById('idleCount').textContent = idleFleet;
}
//updateAnalyticsPanel()

// ==== SUB-FUNC THAT UPDATE ALERT-BANNER  AND OVERVIEW CENTER ==== //
function  updateAlertBanner() {
    const alertBanner =document.getElementById('alertBanner');
    const overload = masterfleetRecord.filter(truck => truck.weightKG > 800);
   
   // console.log(overload.length);
    
    if (overload.length > 0) {
    const alertMessage = overload.map(info => `⚠️ SYSTEM ALERTS: ${info.vehicle} is OVERLOADED (${info.weightKG}KG) in ${info.hub}`).join('||');
     alertBanner.innerHTML = `<p class="alert-text">${alertMessage}</p>`;
     alertBanner.style.backgroundColor = "darkred";
     
        //  console.log(overload.length);
    } else {
        alertBanner.innerHTML = `<p class="alert-text">✅ All regional fleets currently operating inside safety design specifications.</p>`;
        alertBanner.style.backgroundColor = "var(--bg-announcement)";
    }
   
}

// ==== TOGGLING THEME CODE ==== //
let toggleBtn = document.getElementById('toggleTheme');
const currentTheme = localStorage.getItem('theme');
     if (currentTheme === 'dark') {
        document.body.classList.toggle('dark-Mode');
        toggleBtn.textContent = '☀️ Light-Mode';
     } else {
        toggleBtn.textContent = '🌙 Dark-Mode';
    }

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-Mode');
   if (document.body.classList.contains('dark-Mode')) {
       localStorage.setItem('theme', 'dark');
       toggleBtn.textContent = '☀️ Light-Mode';
   } else {
       localStorage.setItem('theme', 'light');
       toggleBtn.textContent = '🌙 Dark-Mode';
   };
});
updateAlertBanner()
generalSystemUIUpdater();