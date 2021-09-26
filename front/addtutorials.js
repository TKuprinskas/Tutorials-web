const postURL = "http://localhost:3000/v1/tutorials";
const token = window.localStorage.getItem("token");

const cancelBTN = document.getElementById("cancel-button");
cancelBTN.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "index.html";
});

showData();

function showData() {
  const form = document.getElementById("form-tutorial");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value.trim();
    const content = e.target.elements.content.value.trim();
    const private = e.target.elements.private.value.trim();

    fetch(postURL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        private,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          return alert(data.err);
        }
        alert("You have added new tutorial");
        form.reset();
        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      })
      .catch((err) => {
        alert(err);
      });
  });
}
