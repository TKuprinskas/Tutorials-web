const urlContent = "http://localhost:3000/v1/tutorials";
const pagesURL = "http://localhost:3000/v1/content/pages";

const token = window.localStorage.getItem("token");

showData();

if (token) {
  fetch(pagesURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.err) {
        return alert(data.err);
      }

      if (data.length === 0) {
        return alert("No pages found");
      }
      displayButtons(data);
    })
    .catch((err) => alert(err));
}

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
    fetch(urlContent, {
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
    fetch(urlContent)
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

    if (token) {
      const user = document.createElement("h4");
      user.className = "user";
      user.textContent = `Click here to see all ${item.username}'s tutorials`;
      user.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/user.html?user_id=${item.user_id}`;
      });
      section.append(title, content, user);
    } else {
      section.append(title, content);
    }

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

function displayButtons(pages) {
  const content = document.getElementById("content-selection");
  const h2 = document.createElement("h2");
  h2.textContent = "View tutorials by category:";
  content.append(h2);
  pages.forEach((page) => {
    const btn = document.createElement("button");
    content.append(btn);
    btn.textContent = page.title;
    btn.addEventListener("click", () => {
      location.replace(`content.html?title=${page.title}`);
    });
  });
}
