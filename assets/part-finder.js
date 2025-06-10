// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get references to the dropdowns and button
  const typeSelect = document.getElementById('part-finder-type');
  const makeSelect = document.getElementById('part-finder-make');
  const yearSelect = document.getElementById('part-finder-year');
  const modelSelect = document.getElementById('part-finder-model');
  const findPartsButton = document.getElementById('part-finder-submit');

  const apiBaseUrl = '/apps/fitment'; // Replace with actual base URL if different

  // Function to fetch Type options
  async function fetchTypeOptions() {
    console.log('Fetching type options...');
    try {
      const response = await fetch(`${apiBaseUrl}/getTypeOptions`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      populateDropdown(typeSelect, data, 'Select Type');
      typeSelect.disabled = false;
    } catch (error) {
      console.error('Error fetching type options:', error);
      // Optionally, display an error message to the user in the UI
    }
  }

  // Function to fetch Make options
  async function fetchMakeOptions(type) {
    console.log(`Fetching make options for type: ${type}`);
    try {
      const response = await fetch(`${apiBaseUrl}/getMakeOptions?type=${type}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      populateDropdown(makeSelect, data, 'Select Make');
      makeSelect.disabled = false;
    } catch (error) {
      console.error('Error fetching make options:', error);
    }
  }

  // Function to fetch Year options
  async function fetchYearOptions(type, make) {
    console.log(`Fetching year options for type: ${type}, make: ${make}`);
    try {
      const response = await fetch(`${apiBaseUrl}/getYearOptions?type=${type}&make=${make}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      populateDropdown(yearSelect, data, 'Select Year');
      yearSelect.disabled = false;
    } catch (error) {
      console.error('Error fetching year options:', error);
    }
  }

  // Function to fetch Model options
  async function fetchModelOptions(type, make, year) {
    console.log(`Fetching model options for type: ${type}, make: ${make}, year: ${year}`);
    try {
      const response = await fetch(`${apiBaseUrl}/getModelOptions?type=${type}&make=${make}&year=${year}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      populateDropdown(modelSelect, data, 'Select Model');
      modelSelect.disabled = false;
    } catch (error) {
      console.error('Error fetching model options:', error);
    }
  }

  function populateDropdown(selectElement, options, defaultOptionText) {
    selectElement.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultOptionText;
    selectElement.appendChild(defaultOption);

    // Assuming options is an array of strings or an array of objects { value: '...', name: '...' }
    // If API returns { value: "ActualValue", name: "Display Name" }, adjust accordingly.
    // For now, assuming options are strings as per mock data, or simple value/name objects.
    options.forEach(option => {
      const opt = document.createElement('option');
      if (typeof option === 'object' && option !== null && option.hasOwnProperty('value') && option.hasOwnProperty('name')) {
        opt.value = option.value;
        opt.textContent = option.name;
      } else { // Assuming option is a simple string
        opt.value = option;
        opt.textContent = option;
      }
      selectElement.appendChild(opt);
    });
  }

  typeSelect.addEventListener('change', (event) => {
    const selectedType = event.target.value;
    makeSelect.disabled = true;
    yearSelect.disabled = true;
    modelSelect.disabled = true;
    findPartsButton.disabled = true;
    makeSelect.innerHTML = '<option value="">Select Make</option>';
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (selectedType) {
      fetchMakeOptions(selectedType);
    }
  });

  makeSelect.addEventListener('change', (event) => {
    const selectedType = typeSelect.value;
    const selectedMake = event.target.value;
    yearSelect.disabled = true;
    modelSelect.disabled = true;
    findPartsButton.disabled = true;
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (selectedMake) {
      fetchYearOptions(selectedType, selectedMake);
    }
  });

  yearSelect.addEventListener('change', (event) => {
    const selectedType = typeSelect.value;
    const selectedMake = makeSelect.value;
    const selectedYear = event.target.value;
    modelSelect.disabled = true;
    findPartsButton.disabled = true;
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (selectedYear) {
      fetchModelOptions(selectedType, selectedMake, selectedYear);
    }
  });

  modelSelect.addEventListener('change', (event) => {
    findPartsButton.disabled = !event.target.value;
  });

  findPartsButton.addEventListener('click', () => {
    const selectedType = typeSelect.value; // type is kept for potential use, though not in final URL per spec
    const selectedMake = makeSelect.value;
    const selectedYear = yearSelect.value;
    const selectedModel = modelSelect.value;

    if (selectedType && selectedMake && selectedYear && selectedModel) {
      // Redirect to collection page as per requirement
      window.location.href = `${apiBaseUrl}/getFitmentProducts?make=${selectedMake}&year=${selectedYear}&model=${selectedModel}`;
    } else {
      alert('Please select all options.');
    }
  });

  // Initial fetch
  fetchTypeOptions();
});
