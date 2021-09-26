const url = "http://localhost:3000/v1/auth/register";

const form = document.getElementById("register");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = e.target.elements.username.value.trim();
  const email = e.target.elements.email.value.trim();
  const password = e.target.elements.password.value.trim();

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.err) {
        return alert(data.err);
      }
      alert(`You have successfully registered!`);
      form.reset();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    })
    .catch((err) => {
      alert("Something went wrong, please try again");
    });
});
