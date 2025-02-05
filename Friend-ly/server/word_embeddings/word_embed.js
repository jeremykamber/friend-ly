const tf_backend = require('@tensorflow/tfjs-node')/*
const tensorflow = require("@tensorflow-models/universal-sentence-encoder")

function cosineComparison(vector1, vector2) {
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0)
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
}

async function compareSentences(text1, text2) {
    const model = await tensorflow.load()
    const embeddings = await model.embed([text1, text2])
    const vector1 = embeddings.arraySync()[0]
    const vector2 = embeddings.arraySync()[1]
    return Math.round(cosineComparison(vector1, vector2) * 100) + "%"
}

//const sentence1 = "european football"
//const sentence2 = "european football"
const sentence1 = ["football", "parks", "swimming", "motorcycles"]
const sentence2 = ["camping", "soccer", "freestyle", "bikes"]

async function compare() {
    for (let i = 0; i < sentence1.length; i++) {
        for (let j = 0; j < sentence2.length; j++) {
            console.log(await compareSentences(sentence1[i], sentence2[j]))
            //console.log(sentence1[i] + ", " + sentence2[j] + ": ")
        }
    }
}
compare()

//compareSentences(sentence1[0], sentence2[1]).then(console.log)

//compareSentences(sentence1, sentence2).then(console.log)*/
const tensorflow = require("@tensorflow-models/universal-sentence-encoder");

let model;

async function loadModel() {
    if (!model) {
        model = await tensorflow.load();
        console.log("Model loaded!");
    }
}

//loadModel();

function cosineComparison(vector1, vector2) {
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
}

async function compareSentences(text1, text2) {
    //await loadModel();
    const embeddings = await model.embed([text1, text2]);

    try {
        const vectors = embeddings.dataSync(); // Faster than .array()
        return Math.round(cosineComparison(vectors.slice(0, 512), vectors.slice(512, 1024)) * 100) + "%";
    } finally {
        embeddings.dispose(); // Prevent memory leaks
    }
}

const sentence1 = ["", "lakers", "biking", "road tripping"];
const sentence2 = ["cycling", "luka doncic", "freestyle", "travel"];

async function runComparisons() {
    await loadModel(); // Load model once

    const tasks = [];
    for (let i = 0; i < sentence1.length; i++) {
        for (let j = 0; j < sentence2.length; j++) {
            tasks.push(compareSentences(sentence1[i], sentence2[j]).then(result => {
                console.log(`${sentence1[i]}, ${sentence2[j]}: ${result}`);
            }));
        }
    }
    await Promise.all(tasks); // Run comparisons in parallel
}

runComparisons();