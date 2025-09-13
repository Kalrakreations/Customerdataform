// form-script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customerForm');

    // Inputs for dynamic "Other" fields
    const designation = document.getElementById('designation');
    const designationOther = document.getElementById('designationOther');

    const country = document.getElementById('country');
    const countryOther = document.getElementById('countryOther');

    const state = document.getElementById('state');
    const stateOther = document.getElementById('stateOther');

    const city = document.getElementById('city');
    const cityOther = document.getElementById('cityOther');

    const business = document.getElementById('business');
    const businessOther = document.getElementById('businessOther');

    // Replace with your deployed Google Apps Script Web App URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwngT534eYoFr3yH4l_WJRsN2gkqfqtjuvLvXw7MJwMWIHWfTlKwHkwF8IhnhgaCkWHig/exec";

    // Indian states and cities
    const statesAndCities = {
        "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati"],
        "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat"],
        "Assam": ["Guwahati","Dibrugarh","Silchar","Jorhat"],
        "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur"],
        "Chhattisgarh": ["Raipur","Bilaspur","Durg","Korba"],
        "Goa": ["Panaji","Margao","Vasco da Gama"],
        "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar"],
        "Haryana": ["Chandigarh","Gurugram","Faridabad","Panipat","Hisar"],
        "Himachal Pradesh": ["Shimla","Dharamshala","Mandi","Solan"],
        "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro"],
        "Karnataka": ["Bengaluru","Mysuru","Hubballi","Mangaluru"],
        "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur"],
        "Madhya Pradesh": ["Bhopal","Indore","Gwalior","Jabalpur","Ujjain"],
        "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad"],
        "Manipur": ["Imphal","Thoubal","Bishnupur"],
        "Meghalaya": ["Shillong","Tura","Nongpoh"],
        "Mizoram": ["Aizawl","Lunglei","Champhai"],
        "Nagaland": ["Kohima","Dimapur","Mokokchung"],
        "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Sambalpur"],
        "Punjab": ["Amritsar","Ludhiana","Jalandhar","Patiala","Bathinda","Mohali","Moga","Firozpur","Abohar"],
        "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer"],
        "Sikkim": ["Gangtok","Geyzing","Namchi"],
        "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli"],
        "Telangana": ["Hyderabad","Warangal","Nizamabad"],
        "Tripura": ["Agartala","Udaipur","Dharmanagar"],
        "Uttar Pradesh": ["Lucknow","Kanpur","Agra","Varanasi","Ghaziabad"],
        "Uttarakhand": ["Dehradun","Haridwar","Roorkee"],
        "West Bengal": ["Kolkata","Howrah","Durgapur","Siliguri","Asansol"]
    };

    // Populate state dropdown
    for (let st in statesAndCities) {
        const option = document.createElement('option');
        option.value = st;
        option.textContent = st;
        state.appendChild(option);
    }

    // Handle "Other" fields
    function handleOther(select, otherInput) {
        select.addEventListener('change', () => {
            if (select.value === "Other") {
                otherInput.style.display = "block";
            } else {
                otherInput.style.display = "none";
            }
        });
    }

    [designation, country, state, city, business].forEach((sel, i) => {
        handleOther(sel, [designationOther, countryOther, stateOther, cityOther, businessOther][i]);
    });

    // Populate city dropdown when state changes
    state.addEventListener('change', () => {
        city.innerHTML = '<option value="">Select City</option>';
        cityOther.style.display = "none";

        if(statesAndCities[state.value]){
            statesAndCities[state.value].forEach(ct => {
                const option = document.createElement('option');
                option.value = ct;
                option.textContent = ct;
                city.appendChild(option);
            });
            const otherOption = document.createElement('option');
            otherOption.value = "Other";
            otherOption.textContent = "Other";
            city.appendChild(otherOption);
        }
    });

    city.addEventListener('change', () => {
        if(city.value === "Other") cityOther.style.display = "block";
        else cityOther.style.display = "none";
    });

    // Convert file to Base64
    function toBase64(file){
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = ()=> resolve(reader.result);
            reader.onerror = err => reject(err);
        });
    }

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Handle visiting card files
        const files = ['vcFront','vcBack'];
        for (let f of files){
            const input = document.getElementById(f);
            if(input.files.length > 0){
                const file = input.files[0];
                const base64 = await toBase64(file);
                formData.append(f+'Base64', base64.split(',')[1]);
                formData.append(f+'Name', file.name);
                formData.append(f+'Mime', file.type);
            }
        }

        // Send to Google Apps Script Web App
        fetch(SCRIPT_URL, { method:'POST', body: formData })
            .then(res=>res.text())
            .then(msg=>{
                const fm = document.getElementById('formMessage');
                fm.textContent = "Form submitted successfully!";
                fm.style.color="#4CAF50";
                form.reset();
                setTimeout(()=>{ fm.textContent=""; }, 2000);
            })
            .catch(err=>console.error(err));
    });
});
