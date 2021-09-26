const urlContent = "http://localhost:3000/v1/user-tutorials";
const queryString = window.location.search;
const params = queryString.split("=")[1];

const token = window.localStorage.getItem("token");

showData();
remove();

function remove() {
  if (token) {
    const login = document.getElementById("loginmenu");
    const register = document.getElementById("registermenu");
    register.parentNode.removeChild(register);
    login.parentNode.removeChild(login);
  } else {
    const signout = document.getElementById("signout");
    const tutBTN = document.getElementById("tutBTN");
    signout.parentNode.removeChild(signout);
    tutBTN.parentNode.removeChild(tutBTN);
  }
}

function showData() {
  if (token) {
    fetch(`${urlContent}/${params}`, {
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
    fetch(`${urlContent}/${params}`)
      .then((res) => res.json())
      .then((data) => {
        alert("You are not authorized to see this page");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
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

document.getElementById("signout").addEventListener("click", () => {
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
});
