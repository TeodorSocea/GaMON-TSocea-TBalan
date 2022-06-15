async function doRegister() {
    let username = document.getElementById('registerUsername').value;
    let password = document.getElementById('registerPassword').value;

    return await register(username, password);
}

async function register(usrn, pass) {
    let result = await fetch('http://localhost:8081/register', {
        method: 'POST',
        body: JSON.stringify({
            username: usrn,
            password: pass
        })
    }).then(res => res).catch(err => console.log(err));

    return result.status === 200;
}