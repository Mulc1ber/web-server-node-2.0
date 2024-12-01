document.addEventListener("click", ({ target }) => {
  if (target.dataset.type === "remove") {
    const id = target.dataset.id;
    remove(id).then(() => {
      target.closest("li").remove();
    });
  }

  if (target.dataset.type === "edit") {
    const id = target.dataset.id;
    const title = target.dataset.title;
    const task = target.closest("li");
    const initialHTML = task.innerHTML;

    task.innerHTML = `
      <input type="text" value="${title}">
      <div>
        <button class="btn btn-success" data-type="save">Сохранить</button>
        <button class="btn btn-danger" data-type="cancel">Отменить</button>
      </div>
    `;

    const handleTask = ({ target }) => {
      if (target.dataset.type === "cancel") {
        task.innerHTML = initialHTML;
        task.removeEventListener("click", handleTask);
      }
      if (target.dataset.type === "save") {
        const title = task.querySelector("input").value;

        edit(id, title).then(() => {
          task.innerHTML = initialHTML;
          task.querySelector("span").innerText = title;
          task.querySelector("[data-type=edit]").dataset.title = title;
          task.removeEventListener("click", handleTask);
        });
      }
    };

    task.addEventListener("click", handleTask);
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

async function edit(id, title) {
  await fetch(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ title, id }),
  });
}
