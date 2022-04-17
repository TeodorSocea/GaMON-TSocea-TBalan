const Token = (...args) =>{
    const [name] = args;
    const template = `
        <form id=${name} target="_blank">
            <input type="text" id="token-field" name="token-filed" placeholder="xxxx-xxxx">
            <input type="submit" onclick="window.location.href = '/dashboard/employee-dashboard.html';" value="Access">
        </form>
    `;
    return template;
}

export default Token