const Login = (...args) => {
    const [name] = args 
    const template = `
    <form id=${name}>  
        <input type="text" placeholder="Enter Username" name="username" required>  
        <input type="password" placeholder="Enter Password" name="password" required>  
        <input type="submit" value="Login">     
    </form>     
    `
    return template
} 

export default Login