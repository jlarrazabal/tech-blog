const logout = async () => {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
    });
    if(response.ok) {
      console.log("User logged out succesfully");
    } else {
      console.log(respose.statusText);
    }
  } catch(err){
    console.log(err);
  }
};

document.getElementById("logout").addEventListener("click", logout);
