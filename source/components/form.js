const Form = (... args) =>{
    const template=`
    <form id="content-form">
        <input type="text" id="fname" name="fname" placeholder="First Name" required="required"><br>
        <input type="text" id="lname" name="lname" placeholder="Last Name" required="required"><br>
        <select id="cartier" placeholder="Location">
            <option value ="tatarasi-nord">Tatarasi Nord</option>
            <option value ="tatarasi-sud">Tatarasi Sud</option>
            <option value ="copou">Copou</option>
            <option value ="nicolina">Nicolina</option>
            <option value ="pacurari">Pacurari</option>
        </select><br><br>
        <textarea rows= "4" cols="40" type="text" name="input" placeholder="Describe the problem" required="required"></textarea><br>
        <input type="submit" value="Submit">
    </form>
    `;
    return template;
}

export default Form;