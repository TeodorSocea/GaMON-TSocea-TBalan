import './scss/app_employee_dashboard.scss'
import Title from './components/title';
import Footer from './components/footer';
import Map from './components/map'
import Scanner from './components/scanner';
import {Html5QrcodeScanner} from "html5-qrcode"


const app = () => {

    document.getElementById('page-header').innerHTML = Title('title-employee-dashboard', 'GaMON - Iasi');
    document.getElementById('map-container').innerHTML = Title('title-map', 'Your daily route') + Map()
    document.getElementById('scan-container').innerHTML = Title('title-scan', 'Scan the site') + Scanner()
    document.getElementById('page-footer').innerHTML = Footer('footer', 'Copyright Teodor Socea & Tudor Balan 2022');

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            html5QrcodeScanner.clear();
        }
    }
    
    function onScanError(qrCodeError) {
        
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);
}

app()


