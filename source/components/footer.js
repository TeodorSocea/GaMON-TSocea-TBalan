const Footer = (...args) =>{
    const [name, text] = args;
    const template = `
    <div id="${name}">
        <p id="footer-text">${text}</p>
    </div>
    `;
    return template;
}

export default Footer