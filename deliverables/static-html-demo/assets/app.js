window.demoData = {
  notifications: [],
};

function markActiveLinks() {
  const page = document.body.dataset.page;
  if (!page) return;

  document.querySelectorAll("[data-page-link]").forEach((node) => {
    if (node.getAttribute("data-page-link") === page) {
      node.classList.add("is-active");
    }
  });
}

function showToast(message) {
  const notice = document.querySelector("[data-toast]");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.add("is-visible");
  window.clearTimeout(window.demoData.toastTimer);
  window.demoData.toastTimer = window.setTimeout(() => {
    notice.classList.remove("is-visible");
  }, 2000);
}

function wireMockActions() {
  document.querySelectorAll("[data-mock-save]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("演示环境已模拟保存，正式版请通过后台或 API 写入。");
    });
  });
}

function wireFilters() {
  document.querySelectorAll("[data-chip-toggle]").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveLinks();
  wireMockActions();
  wireFilters();
});
