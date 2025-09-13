const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwngT534eYoFr3yH4l_WJRsN2gkqfqtjuvLvXw7MJwMWIHWfTlKwHkwF8IhnhgaCkWHig/exec"; // Replace with your Web App URL

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('customerForm');
  
  // Elements
  const fields = ['name','phone','email','company','eventName','designation','country','state','city','business','vcFront','vcBack'];
  fields.forEach(f=>{
    const el = document.getElementsByName(f)[0] || document.getElementById(f);
    if(!el) return;
    el.addEventListener('input', ()=> {
      const tick = el.parentElement.querySelector('.tick');
      if(tick) tick.style.display = el.value ? "block":"none";
    });
  });

  // Dynamic Other Fields
  function setupOther(selectId, otherId){
    const sel = document.getElementById(selectId);
    const other = document.getElementById(otherId);
    sel.addEventListener('change', ()=>{
      other.style.display = (sel.value==="Other") ? "block":"none";
    });
  }
  setupOther('designation','designationOther');
  setupOther('country','countryOther');
  setupOther('state','stateOther');
  setupOther('city','cityOther');
  setupOther('business','businessOther');

  /const statesAndCities = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati","Other"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Other"],
  "Assam": ["Guwahati","Dibrugarh","Silchar","Jorhat","Other"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Other"],
  "Chhattisgarh": ["Raipur","Bilaspur","Durg","Korba","Other"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Other"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Other"],
  "Haryana": ["Chandigarh","Gurugram","Faridabad","Panipat","Hisar","Other"],
  "Himachal Pradesh": ["Shimla","Dharamshala","Mandi","Solan","Other"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Other"],
  "Karnataka": ["Bengaluru","Mysuru","Hubballi","Mangaluru","Other"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Other"],
  "Madhya Pradesh": ["Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Other"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Other"],
  "Manipur": ["Imphal","Thoubal","Bishnupur","Other"],
  "Meghalaya": ["Shillong","Tura","Nongpoh","Other"],
  "Mizoram": ["Aizawl","Lunglei","Champhai","Other"],
  "Nagaland": ["Kohima","Dimapur","Mokokchung","Other"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Sambalpur","Other"],
  "Punjab": ["Amritsar","Ludhiana","Jalandhar","Patiala","Bathinda","Mohali","Moga","Firozpur","Abohar","Other"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Other"],
  "Sikkim": ["Gangtok","Geyzing","Namchi","Other"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Other"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Other"],
  "Tripura": ["Agartala","Udaipur","Dharmanagar","Other"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Agra","Varanasi","Ghaziabad","Other"],
  "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Other"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Siliguri","Asansol","Other"],
  "Delhi": ["New Delhi","Dwarka","Rohini","Other"],
  "Jammu & Kashmir": ["Srinagar","Jammu","Anantnag","Other"],
  "Ladakh": ["Leh","Kargil","Other"],
  "Puducherry": ["Puducherry","Karaikal","Yanam","Mahe","Other"]
};

  const stateSel = document.getElementById('state');
  const citySel = document.getElementById('city');
  for(let st in statesAndCities){
    const opt = document.createElement('option');
    opt.value = st; opt.textContent = st;
    stateSel.appendChild(opt);
  }
  stateSel.addEventListener('change', ()=>{
    citySel.innerHTML='<option value="">Select City</option>';
    document.getElementById('cityOther').style.display='none';
    if(statesAndCities[stateSel.value]){
      statesAndCities[stateSel.value].forEach(ct=>{
        const o = document.createElement('option'); o.value=o.textContent=ct;
        citySel.appendChild(o);
      });
      const otherOpt = document.createElement('option'); otherOpt.value="Other"; otherOpt.textContent="Other";
      citySel.appendChild(otherOpt);
    }
  });
  citySel.addEventListener('change', ()=>{ 
    document.getElementById('cityOther').style.display = (citySel.value==="Other") ? "block":"none";
  });

  // Form Submit
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    const formData = new FormData(form);

    // Handle file uploads as base64
    for(let f of ['vcFront','vcBack']){
      const fi = document.getElementById(f);
      if(fi.files.length>0){
        const file = fi.files[0];
        const base64 = await new Promise((res,rej)=>{
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload=()=>res(reader.result);
          reader.onerror=err=>rej(err);
        });
        formData.append(f+'Base64', base64.split(',')[1]);
        formData.append(f+'Name', file.name);
      }
    }

    // Send to Google Apps Script
    fetch(SCRIPT_URL, {method:'POST', body:formData})
      .then(res=>res.text())
      .then(msg=>{
        submitBtn.classList.remove('loading');
        const fm = document.getElementById('formMessage');
        fm.textContent = msg.includes("SUCCESS") ? "Form submitted successfully!" : "Submission failed!";
        fm.style.display="block";
        setTimeout(()=>{ fm.style.display="none"; },3000);

        if(msg.includes("SUCCESS")){
          form.reset();
          document.querySelectorAll('.tick').forEach(t=>t.style.display='none');
        }
      }).catch(err=>{
        submitBtn.classList.remove('loading');
        const fm = document.getElementById('formMessage');
        fm.textContent="Submission error!"; fm.style.display="block";
        setTimeout(()=>{ fm.style.display="none"; },3000);
        console.error(err);
      });
  });
});
