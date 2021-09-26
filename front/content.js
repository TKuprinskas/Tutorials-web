const contentURL = "http://localhost:3000/v1/content/sport";
const queryString = window.location.search;
const params = queryString.split("=")[1];

const token = window.localStorage.getItem("token");

showData();

function showData() {
  if (token) {
    fetch(`${contentURL}/${params}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        showInfo(data);
      })
      .catch((err) => console.log(err));
  } else {
    fetch(`${contentURL}/${params}`)
      .then((res) => res.json())
      .then((data) => {
        showInfo(data);
      });
  }
}

function showInfo(data) {
  data.forEach((item) => {
    const output = document.getElementById("output");
    const section = document.createElement("section");
    section.classList = "blocks";
    const title = document.createElement("h1");
    title.textContent = `${item.title}`;

    const content = document.createElement("p");
    content.textContent = `${item.content}`;

    section.append(title, content);
    output.append(section);
  });
}

if (token) {
  document.getElementById("signout").addEventListener("click", () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}
