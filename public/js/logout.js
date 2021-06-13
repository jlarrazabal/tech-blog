const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
  });
  if(response.ok) {
    console.log("User logged out succesfully");
    location.reload();
  } else {
    console.log(respose.statusText);
  }
};

document.getElementById("logout").addEventListener("click", logout);
