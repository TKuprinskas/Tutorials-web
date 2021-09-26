const url = "http://localhost:3000/v1/auth/login";

const form = document.getElementById("login");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.elements.email.value;
  const password = e.target.elements.password.value;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.err) {
        return alert(data.err);
      }
      localStorage.setItem("token", `${data.token}`);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })

    .catch((err) => console.log(err));
});
