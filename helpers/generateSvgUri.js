import seedrandom from 'seedrandom'
import { utils } from 'ethers'

export function generateSvgUri(uglyInput) {
    const inputs = [
        "&#128220;",
        "&#128214;",
        "&#128209;",
        "&#128203;",
        "&#128196;",
        "&#128195;",
        "&#128221;",
        "&#128187;",
        "&#128240;",
        "&#128278;",
        "&#127820;",
        "&#127825;",
        "&#127826;",
        "&#127817;",
        "&#127815;",
        "scroll",
        "SCROLL",
        "5cr011",
        "scrollzor",
        "ScroLOL"
    ];
    let prettyInputOverride = [
        inputs[0], 
        Math.random() < 0.75 ? inputs[0] : inputs[Math.floor(Math.random()*inputs.length)],
        Math.random() < 0.75 ? inputs[0] : inputs[Math.floor(Math.random()*inputs.length)],
        Math.random() < 0.75 ? inputs[0] : inputs[Math.floor(Math.random()*inputs.length)],
        inputs[0]
    ].join('');//"&#128220;&#128220;&#128220;&#128220;&#128220;";
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
    let thetaParam = Math.PI - 0.1 + Math.random()*0.2;
    let points = [];
    function heartFunction1(t) {
        return {
            x: 3.5*(16*Math.pow(Math.sin(t), 3)),
            y: 3.5*(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) 
        };
    };
    function heartFunction2(t) {
        return {
            x: 40*(-Math.sqrt(2)*Math.pow(Math.sin(t), 3)),
            y: 40*(2*Math.cos(t) - Math.pow(Math.cos(t), 2) - Math.pow(Math.cos(t), 3) + 0.55)
        };
    };
    const heartFunction = Math.random() < 0.5 ? heartFunction1 : heartFunction2;
    const nbPoints = 25;
    for (let a = 0; a < nbPoints; a++) {
        let point = heartFunction(-Math.PI + 2*Math.PI*a/(nbPoints - 1));
        points.push([point.x, point.y]);
    };
    function normPoints(points, scale) {
        return points.map(p => [scale*p[0]*Math.cos(thetaParam) - scale*p[1]*Math.sin(thetaParam), scale*p[0]*Math.sin(thetaParam) + scale*p[1]*Math.cos(thetaParam)])
                    .map(p => [p[0] + 77, p[1] + 60]);
    };
    function curveFromPoints(originalPoints, scale) {
        let points = normPoints(originalPoints, scale);
        let controlPoints = normPoints(originalPoints, scale*1.1);
        const last = points.length - 1;
        let result = "M " + points[0].join(' ');
        for (let p = 1; p < 5; p += 2) {
            result += " Q " + [points[p].join(' '), points[p + 1].join(' ')].join(' ');
        }
        for (let p = 5; p < last - 5; p += 2) {
            result += " Q " + [controlPoints[p].join(' '), points[p + 1].join(' ')].join(' ');
        }
        for (let p = last - 5; p < last; p += 2) {
            result += " Q " + [points[p].join(' '), points[p + 1].join(' ')].join(' ');
        }
        return result + 'z';
    }
    //Background text params & generation
    let txtAsBackground = '';
    const fontSize = 30 + Math.floor(Math.random(12));
    const [textRotationInit, textRotationFinal] = [-Math.floor(Math.random() * 179), Math.floor(Math.random() * 719)];
    const nbRows = 7
    for (let k = 0; k < nbRows; k++) {
        txtAsBackground += '<text x="60%" y="' + (0 + 100*k/(nbRows-1)) + '%" fill="url(#Gradient)" rotate="'
            + Math.floor(textRotationInit + textRotationFinal * k / nbRows) + '" font-size="' + fontSize
            + 'px" opacity="0.25" dominant-baseline="central" text-anchor="middle" >'
            + prettyInputOverride
            + '</text>'
    }
    //Writing the SVG 
    let imgCode = '<svg viewBox="0 0 142 142" version="1.1" xmlns="http://www.w3.org/2000/svg">'
        + '<defs><' + gradientParam + ' id="Gradient"><stop offset="0%" stop-color="hsl(' + hParam1 + ', ' + sParam1 + '%, ' + lParam1 + '%)" />'
        + '<stop offset="100%" stop-color="hsl(' + hParam2 + ', ' + sParam2 + '%, ' + lParam2 + '%)" /></' + gradientParam + ' ></defs>'
        + txtAsBackground
        + '<text x="50%" y="51%" font-size="120px" opacity="0.88" dominant-baseline="central" text-anchor="middle" >&#128220;</text>'
        + '<path d="' + curveFromPoints(points, 0.67) + '" fill="url(#Gradient)" opacity="0.6" />' //stroke-width="1" stroke="url(#Gradient)
        + '<path d="' + curveFromPoints(points, 0.66) + '" fill="url(#Gradient)" opacity="0.65" />' 
        + '<path d="' + curveFromPoints(points, 0.64) + '" fill="url(#Gradient)" opacity="0.7" />' 
        + '<path d="' + curveFromPoints(points, 0.61) + '" fill="url(#Gradient)" opacity="0.75" /></svg>';
    imgCode = imgCode.split('"').join("'");
    let encodedCode = Buffer.from(imgCode, 'binary').toString('base64');
    return "data:image/svg+xml;base64," + encodedCode;
}

export function generateInitialSvgUri() {
    let imgCode = '<svg viewBox="0 0 142 142" version="1.1" xmlns="http://www.w3.org/2000/svg">'
        + '<text x="50%" y="51%" font-size="120px" opacity="0.88" dominant-baseline="central" text-anchor="middle" >&#128220;</text>'
        + '</svg>';
    imgCode = imgCode.split('"').join("'");
    let encodedCode = Buffer.from(imgCode, 'binary').toString('base64');
    return "data:image/svg+xml;base64," + encodedCode;
}
