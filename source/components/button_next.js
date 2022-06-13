const Button = (...args) =>{
    const [button_class, button_text ] = args;
    const template = `
        <a id=${button_class} href="${button_text}">NEXT</a>
    `;
    return template;
}

export default Button;