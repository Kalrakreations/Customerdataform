document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('customerForm');
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwngT534eYoFr3yH4l_WJRsN2gkqfqtjuvLvXw7MJwMWIHWfTlKwHkwF8IhnhgaCkWHig/exec"; // Replace with your Web App URL

  // Dynamic Indian states and cities
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

  const state = document.getElementById('state');
  const stateOther = document.getElementById('stateOther');
  const city = document.getElementById('city');
  const cityOther = document.getElementById('cityOther');
  const designation = document.getElementById('designation');
  const designationOther = document.getElementById('designationOther');
  const country = document.getElementById('country');
  const countryOther = document.getElementById('countryOther');
  const business = document.getElementById('business');
  const businessOther = document.getElementById('businessOther');

  // Populate states dropdown
  for (let st in statesAndCities) {
    const option = document.createElement('option');
    option.value = st;
    option.textContent = st;
    state.appendChild(option);
  }

  // Handle "Other" inputs
  function handleOther(select, otherInput){
    select.addEventListener('change', ()=>{
      if(select.value==="Other") otherInput.style.display="block";
      else otherInput.style.display="none";
    });
  }
  [state, city, designation, country, business].forEach((sel, i)=>{
    handleOther(sel, [stateOther, cityOther, designationOther, countryOther, businessOther][i]);
  });

  // Populate cities when state changes
  state.addEventListener('change', ()=>{
    city.innerHTML='<option value="">Select City</option>';
    cityOther.style.display='none';
    if(statesAndCities[state.value]){
      statesAndCities[state.value].forEach(ct=>{
        const opt=document.createElement('option');
        opt.value=ct;
        opt.textContent=ct;
        city.appendChild(opt);
      });
      const otherOption=document.createElement('option');
      otherOption.value="Other";
      otherOption.textContent="Other";
      city.appendChild(otherOption);
    }
  });

  city.addEventListener('change', ()=>{
    if(city.value==="Other") cityOther.style.display="block";
    else cityOther.style.display="none";
  });

  // Tick logic
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input=>{
    const tick = input.parentElement.querySelector('.tick');
    input.addEventListener('input', ()=> {
      if(input.type==="file") tick.style.display = input.files.length>0?"inline":"none";
      else tick.style.display = input.value.trim()!==""?"inline":"none";
    });
    input.addEventListener('change', ()=>{ // For select dropdown
      if(input.tagName==="SELECT") tick.style.display = input.value!==""?"inline":"none";
    });
  });

  // File to Base64
  function toBase64(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.readAsDataURL(file);
      reader.onload=()=>resolve(reader.result);
      reader.onerror=err=>reject(err);
    });
  }

  // Form submission
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formData=new FormData(form);

    const files=['vcFront','vcBack'];
    for(let f of files){
      const fi=document.getElementById(f);
      if(fi.files.length>0){
        const file=fi.files[0];
        const base64=await toBase64(file);
        formData.append(f+'Base64',base64.split(',')[1]);
        formData.append(f+'Name',file.name);
        formData.append(f+'Mime',file.type);
      }
    }

    // Send to Google Apps Script
    fetch(SCRIPT_URL,{method:'POST',body:formData})
      .then(res=>res.text())
      .then(msg=>{
        const fm=document.getElementById('formMessage');
        fm.textContent="Form submitted successfully!";
        fm.style.color="#4CAF50";
        setTimeout(()=>{
          form.reset();
          fm.textContent="";
          inputs.forEach(inp=>inp.parentElement.querySelector('.tick').style.display="none");
        },2000);
      })
      .catch(err=>console.error(err));
  });
});
