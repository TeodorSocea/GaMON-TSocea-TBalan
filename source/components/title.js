const Title = (...args) =>{
    const [name, text] = args;
    const template = `
    <div id="${name}" class="title">
        <h1>${text}</h1>
    </div>
    `;
    return template;
}

export default Title