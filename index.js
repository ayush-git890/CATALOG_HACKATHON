const fs = require('fs');

function find(value, base) {
    return BigInt(parseInt(value, base));
}

function covert_the_value(input) {
    const roots = [];
    const keys = Object.keys(input);
    keys.forEach((key) => {
        if (key !== 'keys') {
            const x = BigInt(parseInt(key));
            const base = parseInt(input[key].base);
            const y = find(input[key].value, base);
            roots.push({ x, y });
        }
    });
    return roots;
}

function verify_coefficient(coefficient) {
    const MAX_256_BIT = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    return coefficient >= BigInt(0) && coefficient <= MAX_256_BIT;
}

function lI(roots, k) {
    let constantTerm = BigInt(0);

    for (let i = 0; i < k; i++) {
        let xi = roots[i].x;
        let yi = roots[i].y;
        let term = yi;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = roots[j].x;
                term *= BigInt(0) - xj;
                term /= xi - xj;
            }
        }
        constantTerm += term;
    }

    if (!verify_coefficient(constantTerm)) {
        throw new Error('The constant term exceeds 256-bit range or is negative.');
    }

    return constantTerm;
}

function Solution(Input_Test) {
    Input_Test.forEach((testCase, index) => {
        const n = testCase.keys.n;
        const k = testCase.keys.k;

        if (n < k) {
            throw new Error(`Test case ${index + 1} has insufficient roots. n (${n}) should be >= k (${k}).`);
        }

        const roots = covert_the_value(testCase);

        const secret = lI(roots, k);

        if (secret < 0) {
            throw new Error(`Test case ${index + 1} has a negative constant term.`);
        }

        console.log(`value of 'c' for test case ${index + 1} is -> ${secret}`);
    });
}

function loadTestCases(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

const filePath = 'test_cases.json';

const Input_Test = loadTestCases(filePath).test_cases;
Solution(Input_Test);