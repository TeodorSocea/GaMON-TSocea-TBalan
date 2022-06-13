import './scss/app_cetatean.scss'
import Header from './components/header'
import Content from './components/content';
import Title from './components/title';
import Footer from './components/footer';
import Form from './components/form';

const fs = require('fs')
var text_input;
try {
    const data = fs.readFileSync('./resources/motd.txt', 'utf8')
    text_input = data;
  } catch (err) {
    console.error(err)
  }

const app_cetatean = (text_input) => {
    document.getElementById('page-header').innerHTML = Title('title-cetatean', 'GaMON - Iasi');
    document.getElementById('motd-container').innerHTML = Title('title-motd', 'MESSAGE OF THE DAY') + Content('content-motd', text_input) 
    document.getElementById('form-container').innerHTML = Title('title-form', 'REPORT A PROBLEM') + Form();
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');
}

app_cetatean(text_input)
