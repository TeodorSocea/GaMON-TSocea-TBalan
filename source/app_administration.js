import './scss/app_administration.scss'
import Title from './components/title';
import Footer from './components/footer';
import Login from './components/login';

const app_administration = () => {
    document.getElementById('page-header').innerHTML = Title('title-auth', 'Administration Authentification');
    document.getElementById('auth-administration-content').innerHTML = Title('title-admin', 'Enter your login details') + Login('auth-wrapper')
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');
}

app_administration()
