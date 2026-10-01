const pages = document.querySelectorAll(".page");
const menuLinks = document.querySelectorAll(".main-menu a");
const menu = document.getElementById("mainMenu");
const menuToggle = document.getElementById("menuToggle");
 
// ---------- Menu: show one section at a time ----------
function showSection(id) {
  const target = document.getElementById(id) ? id : "home";
 
  pages.forEach(function (page) {
    page.classList.toggle("active", page.id === target);
  });
  menuLinks.forEach(function (link) {
    link.classList.toggle("active", link.dataset.section === target);
  });
 
  // Animate the skill bars each time the Skills section opens
  document.querySelectorAll(".bar-fill").forEach(function (bar) {
    bar.style.width = target === "skills" ? bar.dataset.level + "%" : "0";
  });
 
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
 
function currentSection() {
  return window.location.hash.replace("#", "") || "home";
}
 
window.addEventListener("hashchange", function () {
  showSection(currentSection());
});
 
menuToggle.addEventListener("click", function () {
  const isOpen = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
 
// ---------- Build the page from the JSON data ----------
function setText(id, text) {
  document.getElementById(id).textContent = text;
}
 
function buildPage(data) {
  document.title = data.name + " | Internship Portfolio";
 
  const photo = document.getElementById("photo");
  photo.src = data.photo;
  photo.alt = "Photo of " + data.name;
 
  setText("name", data.name);
  setText("role", data.role);
  setText("tagline", data.tagline);
  setText("about", data.about);
 
  // Education
  const eduList = document.getElementById("educationList");
  data.education.forEach(function (item) {
    const div = document.createElement("div");
    div.className = "edu-item";
    div.innerHTML =
      "<h3></h3><p class='school'></p>" + (item.detail ? "<p class='detail'></p>" : "");
    div.querySelector("h3").textContent = item.level;
    div.querySelector(".school").textContent = item.school;
    if (item.detail) div.querySelector(".detail").textContent = item.detail;
    eduList.appendChild(div);
  });
 
  // Skills
  const skillsList = document.getElementById("skillsList");
  data.skills.forEach(function (skill) {
    const div = document.createElement("div");
    div.className = "skill";
    div.innerHTML =
      "<div class='skill-head'><span class='skill-name'></span><span class='skill-level'></span></div>" +
      "<p class='skill-note'></p>" +
      "<div class='bar'><div class='bar-fill'></div></div>";
    div.querySelector(".skill-name").textContent = skill.name;
    div.querySelector(".skill-level").textContent = skill.level + "%";
    div.querySelector(".skill-note").textContent = skill.note;
    div.querySelector(".bar-fill").dataset.level = skill.level;
    skillsList.appendChild(div);
  });
 
  // Projects (each one links to GitHub)
  const projectsList = document.getElementById("projectsList");
  data.projects.forEach(function (project) {
    const card = document.createElement("article");
    card.className = "project";
    card.innerHTML =
      "<h3></h3><p class='desc'></p><div class='tags'></div>" +
      "<a class='btn' target='_blank' rel='noopener'>View on GitHub</a>";
    card.querySelector("h3").textContent = project.title;
    card.querySelector(".desc").textContent = project.description;
    project.tech.forEach(function (t) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t;
      card.querySelector(".tags").appendChild(tag);
    });
    card.querySelector("a").href = project.link;
    projectsList.appendChild(card);
  });
  document.getElementById("githubProfile").href = data.github;
 
  // Contact
  setText("contactName", data.name);
  const email = document.getElementById("contactEmail");
  email.textContent = data.contact.email;
  email.href = "mailto:" + data.contact.email;
  setText("contactMobile", data.contact.mobile);
  setText("contactAddress", data.contact.address);
}
 
// If the photo file is missing, show a plain placeholder instead of a broken icon
document.getElementById("photo").addEventListener("error", function () {
  this.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='260' height='320'>" +
        "<rect width='100%' height='100%' fill='#b0e0e6'/>" +
        "<text x='50%' y='50%' text-anchor='middle' font-family='Arial' font-size='18' fill='#2c4d2b'>Add your photo</text>" +
        "</svg>"
    );
}, { once: true });
 
document.getElementById("year").textContent = new Date().getFullYear();
 
fetch("data.json")
  .then(function (response) {
    if (!response.ok) throw new Error("data.json not found");
    return response.json();
  })
  .then(function (data) {
    buildPage(data);
    showSection(currentSection());
  })
  .catch(function () {
    showSection(currentSection());
    const message = document.createElement("div");
    message.className = "load-error";
    message.textContent =
      "Could not load data.json. Open this page with a local server (for example, the Live Server extension in VS Code) instead of double-clicking the file.";
    document.body.insertBefore(message, document.querySelector("main"));
  });