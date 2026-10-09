(() => {
  "use strict";

  const DATA_URL = "./data/semestres.json";
  const nav = document.getElementById("semester-nav");
  const gallery = document.getElementById("gallery");
  const galleryTitle = document.getElementById("gallery-title");
  const semesterKicker = document.getElementById("semester-kicker");
  const imageCount = document.getElementById("image-count");
  const dialog = document.getElementById("image-dialog");
  const dialogImage = document.getElementById("dialog-image");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogDownload = document.getElementById("dialog-download");

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function resolvePath(path) {
    // Paths in the JSON are relative to the repository root.
    return "./" + path.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  }

  function makeDownloadLink(image, className = "button button-primary") {
    const link = makeElement("a", className, "↓ Baixar");
    link.href = resolvePath(image.file);
    link.setAttribute("download", image.downloadName || image.title || "imagem");
    link.setAttribute("aria-label", `Baixar ${image.title}`);
    return link;
  }

  function openPreview(image) {
    dialogImage.src = resolvePath(image.file);
    dialogImage.alt = image.title;
    dialogTitle.textContent = image.title;
    dialogDescription.textContent = image.description || "";
    dialogDownload.href = resolvePath(image.file);
    dialogDownload.setAttribute("download", image.downloadName || image.title || "imagem");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.open(dialogImage.src, "_blank", "noopener");
  }

  function renderNavigation(semesters, selectedId) {
    nav.replaceChildren();
    semesters.forEach((semester) => {
      const link = makeElement("a", "semester-link");
      link.href = `?semestre=${encodeURIComponent(semester.id)}`;
      link.setAttribute("aria-current", semester.id === selectedId ? "page" : "false");
      const dot = makeElement("span", "semester-dot");
      dot.setAttribute("aria-hidden", "true");
      link.append(dot, document.createTextNode(semester.title));
      nav.append(link);
    });
  }

  function renderGallery(semester) {
    gallery.replaceChildren();
    galleryTitle.textContent = semester.title;
    semesterKicker.textContent = semester.year ? `ANO ${semester.year} · SEMESTRE ${semester.number}` : "ACERVO";
    const images = Array.isArray(semester.images) ? semester.images : [];
    imageCount.textContent = `${images.length} ${images.length === 1 ? "imagem" : "imagens"}`;

    if (images.length === 0) {
      gallery.append(makeElement("p", "state-message", "Ainda não há imagens cadastradas neste semestre."));
      return;
    }

    images.forEach((image) => {
      const card = makeElement("article", "image-card");
      const previewButton = makeElement("button", "thumbnail-button");
      previewButton.type = "button";
      previewButton.setAttribute("aria-label", `Visualizar ${image.title}`);

      const thumbnail = makeElement("img", "thumbnail");
      thumbnail.src = resolvePath(image.thumbnail || image.file);
      thumbnail.alt = image.title;
      thumbnail.loading = "lazy";
      thumbnail.onerror = () => {
        thumbnail.removeAttribute("src");
        thumbnail.alt = "Pré-visualização indisponível";
        thumbnail.style.objectFit = "contain";
        thumbnail.style.padding = "24px";
      };
      previewButton.append(thumbnail);
      previewButton.addEventListener("click", () => openPreview(image));

      const body = makeElement("div", "image-card-body");
      body.append(makeElement("h3", "", image.title));
      if (image.description) body.append(makeElement("p", "", image.description));

      const actions = makeElement("div", "card-actions");
      actions.append(makeDownloadLink(image));
      const previewLink = makeElement("button", "button button-secondary", "Visualizar");
      previewLink.type = "button";
      previewLink.addEventListener("click", () => openPreview(image));
      actions.append(previewLink);
      body.append(actions);
      card.append(previewButton, body);
      gallery.append(card);
    });
  }

  async function init() {
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Não foi possível carregar o cadastro (${response.status}).`);
      const data = await response.json();
      const semesters = Array.isArray(data.semesters) ? data.semesters : [];
      if (semesters.length === 0) {
        gallery.replaceChildren(makeElement("p", "state-message", "Nenhum semestre foi cadastrado."));
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const requestedId = params.get("semestre");
      const selected = semesters.find((semester) => semester.id === requestedId) || semesters[0];
      renderNavigation(semesters, selected.id);
      renderGallery(selected);
    } catch (error) {
      console.error(error);
      gallery.replaceChildren(makeElement(
        "p",
        "state-message",
        "Não foi possível carregar a galeria. Verifique se data/semestres.json existe e foi publicado no GitHub Pages."
      ));
    }
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  init();
})();
