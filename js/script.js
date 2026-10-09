// Change this to your GitHub username
const GITHUB_USERNAME = "Dela-Cruz-Mhelvin";

// ---------- Menu (mobile) ----------
const menu = document.getElementById("mainMenu");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", function () {
  const isOpen = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Highlight the menu link of the section being viewed ----------
const sections = document.querySelectorAll("main section[id]");
const menuLinks = menu.querySelectorAll("a");

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        menuLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach(function (section) { observer.observe(section); });

// ---------- Projects from data/projects.json ----------
function makeProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project";

  const img = document.createElement("img");
  img.src = "images/" + project.screenshot;
  img.alt = "Screenshot of " + project.title;
  img.loading = "lazy";
  img.addEventListener("error", function () { img.remove(); });
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h3");
  title.textContent = project.title;
  body.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = project.description;
  body.appendChild(desc);

  const tags = document.createElement("ul");
  tags.className = "tag-list";
  project.technologies.forEach(function (tech) {
    const li = document.createElement("li");
    li.textContent = tech;
    tags.appendChild(li);
  });
  body.appendChild(tags);

  const role = document.createElement("p");
  role.className = "role";
  role.textContent = "My role: " + project.role;
  body.appendChild(role);

  const link = document.createElement("a");
  link.className = "btn";
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View on GitHub";
  body.appendChild(link);

  card.appendChild(body);
  return card;
}

async function loadProjects() {
  const list = document.getElementById("projectsList");
  const message = document.getElementById("projectsMessage");
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const projects = await response.json();
    projects.forEach(function (project) {
      list.appendChild(makeProjectCard(project));
    });
  } catch (error) {
    console.warn("Projects failed to load:", error);
    message.hidden = false;
    message.textContent = "Sorry, the projects could not be loaded right now. Please try again later.";
  }
}

// ---------- Latest GitHub repositories (GitHub REST API) ----------
async function loadRepos() {
  const list = document.getElementById("reposList");
  const message = document.getElementById("reposMessage");
  const url = "https://api.github.com/users/" + GITHUB_USERNAME + "/repos?sort=updated&per_page=5";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const repos = await response.json();

    if (repos.length === 0) {
      message.textContent = "No public repositories to show yet.";
      return;
    }

    repos.forEach(function (repo) {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = repo.name;

      const lang = document.createElement("span");
      lang.className = "lang";
      lang.textContent = repo.language || "No language listed";

      li.appendChild(link);
      li.appendChild(lang);
      list.appendChild(li);
    });
    message.hidden = true;
  } catch (error) {
    console.warn("GitHub data failed to load:", error);
    message.textContent = "GitHub data is unavailable right now. Please try again later.";
  }
}

// ---------- Contact form ----------
const form = document.getElementById("contactForm");
const thanks = document.getElementById("formThanks");

function setError(fieldId, errorId, text) {
  document.getElementById(errorId).textContent = text;
  document.getElementById(fieldId).classList.toggle("invalid", text !== "");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  thanks.hidden = true;

  const name = document.getElementById("formName").value.trim();
  const email = document.getElementById("formEmail").value.trim();
  const message = document.getElementById("formMessage").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (name === "") {
    setError("formName", "nameError", "Please enter your name.");
    valid = false;
  } else {
    setError("formName", "nameError", "");
  }

  if (email === "") {
    setError("formEmail", "emailError", "Please enter your email.");
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError("formEmail", "emailError", "Please enter a valid email address.");
    valid = false;
  } else {
    setError("formEmail", "emailError", "");
  }

  if (message === "") {
    setError("formMessage", "messageError", "Please write a message.");
    valid = false;
  } else {
    setError("formMessage", "messageError", "");
  }

  if (valid) {
    form.reset();          // clear the form
    thanks.hidden = false; // show the thank-you message
  }
});

// ---------- My own feature: back-to-top button ----------
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  backToTop.classList.toggle("show", window.scrollY > 300);
});

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Start ----------
document.getElementById("year").textContent = new Date().getFullYear();
loadProjects();
loadRepos();