import './scss/app_selector.scss'
import Title from './components/title';
import Footer from './components/footer';

const app_selector = () => {
    document.getElementById('page-header').innerHTML = Title('title', 'Page Selector');
    document.getElementById('title-selector').innerHTML = Title('title-selector', 'Select a page to view')
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');
}

app_selector()
