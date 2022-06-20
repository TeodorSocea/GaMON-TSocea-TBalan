async function doRegister() {
  let username = document.getElementById("registerUsername").value;
  let password = document.getElementById("registerPassword").value;

  var res = await register(username, password);

  if (res === true) {
    window.location.assign("/");
  }
}

async function register(usrn, pass) {
  let result = await fetch("http://localhost:8081/register", {
    method: "POST",
    body: JSON.stringify({
      username: usrn,
      password: pass,
    }),
  })
    .then((res) => res)
    .catch((err) => console.log(err));

  return result.status === 200;
}

async function doLogin() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  var res = await login(username, password);

  if (res === true) {
    window.location.assign("/");
  }
}

async function login(usrn, pass) {
  let result = await fetch("http://localhost:8081/login", {
    method: "POST",
    body: JSON.stringify({
      username: usrn,
      password: pass,
    }),
  })
    .then((res) => res)
    .catch((err) => console.log(err));

  return result.status === 200;
}

function showLogin() {
  document.getElementById("registerComponent").classList.add("hidden");
  document.getElementById("loginComponent").classList.remove("hidden");
  document.getElementById("loginButton").classList.add("hidden");
  document.getElementById("registerButton").classList.remove("hidden");
}

function showRegister() {
  document.getElementById("loginComponent").classList.add("hidden");
  document.getElementById("registerComponent").classList.remove("hidden");
  document.getElementById("registerButton").classList.add("hidden");
  document.getElementById("loginButton").classList.remove("hidden");
}

function prepare() {
  showLogin();
}
