const newCardFront = document.getElementById("new-card-front");
const newCardForm = document.getElementById("new-card-form");
const newCardInner = document.getElementById("new-card-inner");

newCardFront.addEventListener("click", () => {
  newCardInner.classList.add("flip");
});

newCardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const inputObject = {
    projectName: form.projectName.value,
    repoLink: form.repoLink.value,
    status: form.status.value,
    previousIssue: form.previousIssue.value,
    currentIssue: form.currentIssue.value,
    nextIssue: form.nextIssue.value,
    dateStarted: form.dateStarted.value,
    lastWorkedOn: form.lastWorkedOn.value,
  };

  localStorage.setItem(
    `project_${inputObject.projectName}`,
    JSON.stringify(inputObject),
  );

  renderProjectCards();

  newCardInner.classList.remove("flip");
});

function getAllProjects() {
  const projects = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("project_")) {
      const project = JSON.parse(localStorage.getItem(key));
      projects.push(project);
    }
  }

  return projects;
}

function updateStatCard(numberOfProjects, status) {
  document.querySelector(".stat-card").replaceChildren();

  const numberOfActiveProjects = status.filter((s) => s === "active").length;
  const numberOfStableReleases = status.filter((s) => s === "stable").length;
  const numberOfHiatuses = status.filter((s) => s === "hiatus").length;
  const numberOfAbandoned = status.filter((s) => s === "abandoned").length;

  const statistics = document.createElement("h3");
  statistics.textContent = "Statistics:";

  const projectsNum = document.createElement("p");
  projectsNum.textContent = `Total projects: ${numberOfProjects}`;
  const currentStatus = document.createElement("h4");
  currentStatus.textContent = "Current status:";

  const activeProjects = document.createElement("p");
  activeProjects.textContent = `Active development: ${numberOfActiveProjects}`;

  const stableReleases = document.createElement("p");
  stableReleases.textContent = `Stable releases: ${numberOfStableReleases}`;

  const hiatusProjects = document.createElement("p");
  hiatusProjects.textContent = `Hiatus: ${numberOfHiatuses}`;

  const abandonedProjects = document.createElement("p");
  abandonedProjects.textContent = `Abandoned: ${numberOfAbandoned}`;

  const statBar = document.createElement("div");
  statBar.id = "status-diagram";
  const active = (numberOfActiveProjects / numberOfProjects) * 100;
  const stable = (numberOfStableReleases / numberOfProjects) * 100;
  const hiatus = (numberOfHiatuses / numberOfProjects) * 100;
  statBar.style.background = `linear-gradient(90deg, #00d73d 0% ${active}%, #2f8ffd ${active}% ${active + stable}%, #e0c34f ${active + stable}% ${active + stable + hiatus}%, #dc143c ${active + stable + hiatus}% 100%)`;

  document
    .querySelector(".stat-card")
    .append(
      statistics,
      projectsNum,
      currentStatus,
      activeProjects,
      stableReleases,
      hiatusProjects,
      abandonedProjects,
      statBar,
    );
}

function renderProjectCards() {
  const projects = getAllProjects();
  const status = [];

  document.querySelector(".cards-container").replaceChildren();

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("card", "projectCard");
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = `Project: ${project.projectName}`;
    const repoLink = document.createElement("p");
    repoLink.textContent = `Repo link:${project.repoLink}`;
    const statusText = document.createElement("p");
    statusText.textContent = `Status: ${project.status}`;
    const previousIssue = document.createElement("p");
    previousIssue.textContent = `Previous issue: ${project.previousIssue}`;
    const currentIssue = document.createElement("p");
    currentIssue.textContent = `Current issue: ${project.currentIssue}`;
    const nextIssue = document.createElement("p");
    nextIssue.textContent = `Next issue: ${project.nextIssue}`;
    const dateStarted = document.createElement("p");
    dateStarted.textContent = `Date started: ${project.dateStarted}`;
    const lastWorkedOn = document.createElement("p");
    lastWorkedOn.textContent = `Last worked on: ${project.lastWorkedOn}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      localStorage.removeItem(`project_${project.projectName}`);
      renderProjectCards();
    });

    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.classList.add("delete-btn");
    deleteAllBtn.textContent = "Delete All";
    deleteAllBtn.addEventListener("click", (e) => {
      projects.forEach((p) => {
        localStorage.removeItem(`project_${p.projectName}`);
      });
      renderProjectCards();
    });

    projectCard.append(
      cardTitle,
      repoLink,
      statusText,
      previousIssue,
      currentIssue,
      nextIssue,
      dateStarted,
      lastWorkedOn,
      deleteBtn,
      deleteAllBtn,
    );

    status.push(project.status);
    document.querySelector(".cards-container").append(projectCard);
  });

  updateStatCard(projects.length, status);
}

renderProjectCards();
