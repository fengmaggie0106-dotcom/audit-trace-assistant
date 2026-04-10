window.demoData = {
  updatedAt: "2026-04-06",
};

function markActiveLinks() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) {
      link.classList.add("is-active");
    }
  });
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(window.demoData.toastTimer);
  window.demoData.toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function wireMockButtons() {
  document.querySelectorAll("[data-mock-save]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("HTML 导出版仅演示结构，未连接真实后端。");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveLinks();
  wireMockButtons();
});
