const Login = (...args) => {
    const [name] = args 
    const template = `
    <form id=${name} target="_blank">  
        <input type="text" placeholder="Enter Username" name="username" required>  
        <input type="password" placeholder="Enter Password" name="password" required>  
        <input onclick="window.location.href = '/dashboard/administration-dashboard.html';"type="submit" value="Login">     
    </form>     
    `
    return template
} 

export default Login