const Token = (...args) =>{
    const [name] = args;
    const template = `
        <form id=${name}>
            <input type="text" id="token-field" name="token-filed" required="required" placeholder="xxxx-xxxx">
            <input type="submit" value="Access">
        </form>
    `;
    return template;
}

export default Token