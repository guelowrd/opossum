import seedrandom from 'seedrandom'
import { utils } from 'ethers'

export function generateSvgUri(prettyInput, uglyInput) {
    let theHash = utils.keccak256(utils.toUtf8Bytes(uglyInput));
    seedrandom(theHash, { global: true });
    //Polygon params & points generation
    let hParam1 = Math.floor(Math.random() * 360).toString();
    let sParam1 = Math.floor(Math.random() * 100).toString();
    let lParam1 = Math.floor(Math.random() * 100).toString();
    let hParam2 = Math.floor(Math.random() * 360).toString();
    let sParam2 = Math.floor(Math.random() * 100).toString();
    let lParam2 = Math.floor(Math.random() * 100).toString();
    let gradientParam = Math.random() < 0.5 ? "linearGradient" : "radialGradient";
    let thetaParam = Math.random() * 2 * Math.PI;
    let points = [
        [-50 + Math.floor(Math.random() * 20), 50 - Math.floor(Math.random() * 20)],
        [-3 + Math.floor(Math.random() * 6), -28 + Math.floor(Math.random() * 6)],
        [-3 + Math.floor(Math.random() * 6), 28 - Math.floor(Math.random() * 6)],
        [50 - Math.floor(Math.random() * 20), -50 + Math.floor(Math.random() * 20)]
    ];
    let rotatedPoints = points.map(p => [p[0] * Math.cos(thetaParam) - p[1] * Math.sin(thetaParam), p[0] * Math.sin(thetaParam) + p[1] * Math.cos(thetaParam)]);
    let translatedPoints = rotatedPoints.map(p => p.map(c => c + 71));
    //Background text params & generation
    let txtAsBackground = '';
    const fontFamilies = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "emoji", "math", "fangsong"];
    const fontSize = 6 + Math.floor(Math.random(32));
    const [textRotationInit, textRotationFinal] = [-Math.floor(Math.random() * 179), Math.floor(Math.random() * 719)];
    const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    for (let k = 0; k < 35; k++) {
        txtAsBackground += '<text x="50%" y="' + (3 * k) + '%" font-family="' + randomFont + '" fill="url(#Gradient)" rotate="'
            + Math.floor(textRotationInit + textRotationFinal * k / 34) + '" font-size="' + fontSize
            + 'px" opacity="0.391" dominant-baseline="central" text-anchor="middle" >'
            + Array.from(Array(60).keys()).map(i => prettyInput.split('')[(60 * k + i) % prettyInput.length]).join('') + '</text>'
    }
    //Writing the SVG 
    let imgCode = '<svg viewBox="0 0 142 142" version="1.1" xmlns="http://www.w3.org/2000/svg">'
        + '<defs><' + gradientParam + ' id="Gradient"><stop offset="0%" stop-color="hsl(' + hParam1 + ', ' + sParam1 + '%, ' + lParam1 + '%)" />'
        + '<stop offset="100%" stop-color="hsl(' + hParam2 + ', ' + sParam2 + '%, ' + lParam2 + '%)" /></' + gradientParam + ' ></defs>'
        + txtAsBackground
        + '<polygon points="' + translatedPoints.map(p => p.join(',')).join(' ') + '" fill="url(#Gradient)" /></svg>';
    imgCode = imgCode.split('"').join("'");
    return "data:image/svg+xml;base64," + Buffer.from(imgCode, 'binary').toString('base64');
}

