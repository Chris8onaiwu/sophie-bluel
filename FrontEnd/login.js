const button = document.getElementById ("btn-signin")
const email = document.getElementById ("email");
const password = document.getElementById ("password");
const form = document.getElementById ("form")

button.addEventListener ("click", async (event)  => {
    event.preventDefault();

    const user = {
        email: email.value,
        password: password.value,
    };


    try {
     const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/Json"},
        body: JSON.stringify(user)
        ,})
        
       const data = await response.json()
    


     console.log("loginresponse",data)


        if(!response.ok)
            {

        }

        else{ 
            localStorage.setItem("token", data.token),
            localStorage.setItem("userId", data.userId)
            window.location.href = "index.html"
        }
    }

    catch (error){
    console.log(error)
}

});


