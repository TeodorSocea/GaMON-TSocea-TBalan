import './scss/app.scss'
import Header from './components/header'

const app = () => {

    document.getElementById('header').innerHTML = Header();

}

app()
