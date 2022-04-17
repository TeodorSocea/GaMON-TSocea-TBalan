import './scss/app_employee.scss'
import Title from './components/title';
import Footer from './components/footer';
import Token from './components/token';

const app_employee = () => {
    document.getElementById('page-header').innerHTML = Title('title-auth', 'Employee Authentication');
    document.getElementById('auth-employee-content').innerHTML = Title('title-token', 'Enter your token') + Token('token-wrapper')
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');
}

app_employee()