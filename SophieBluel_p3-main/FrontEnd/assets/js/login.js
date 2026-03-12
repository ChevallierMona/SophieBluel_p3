const form = document.querySelector("#formLogin");
 if (form) { 
  form.addEventListener("submit", submitForm); 
}
 async function submitForm(event) { 
  event.preventDefault(); 
  const email = document.getElementById("email").value; 
  const password = document.getElementById("password").value; 
  try { 
    const response = await fetch("http://localhost:5678/api/users/login", { 
      method: "POST", 
      headers: { "Content-Type": "application/json", }, 
      body: JSON.stringify(
        { email: email, password: password }), 
      }); 
      if (!response.ok) { 
        alert("Erreur dans l’identifiant ou le mot de passe"); 
        return; 
      }
       const data = await response.json(); 
       localStorage.setItem("token", data.token); 
       window.location.href = "index.html"; 
      } catch (error) {
         console.error("Erreur réseau :", error); 
        } 
}