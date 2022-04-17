import './scss/app_administration_dashboard.scss'
import Title from './components/title';
import Footer from './components/footer';


const app = () => {

    document.getElementById('page-header').innerHTML = Title('title-administration-dashboard', 'GaMON - Iasi');
    document.getElementById('administration-menu').innerHTML = Title('title-administration-menu', 'Admin Options') + document.getElementById('administration-menu').innerHTML
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');

}

app()


