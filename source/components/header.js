const Header = (...args) =>{
    const [name, title] = args;
    const template = `
    <div id="${name}">
        ${title}
    </div>
    `;
    return template;
}

export default Header