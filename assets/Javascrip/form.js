function form_js(event) {
  event.preventDefault();
  let form = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  if (
    !form.name &&
    !form.email &&
    !form.phone &&
    !form.subject &&
    !form.message
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="#">Why do I have this issue?</a>',
    });
    return;
  }
  for (let i in form) {
    console.log(`${form[i]}`);
  }
  Swal.fire({
    title: "Good job!",
    text: "You clicked the button!",
    icon: "success",
  });
}
