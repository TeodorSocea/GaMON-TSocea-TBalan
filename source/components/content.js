const Content = (... args) =>{
    const [name, component] = args;
    const template=`
        <div id=${name}>
            <p>${component}</p>
        </div>
    `;
    return template;
}

export default Content;