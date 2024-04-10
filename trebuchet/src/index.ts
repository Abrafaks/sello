import fs from "fs";

const replaceStrings = (input: string): string => {
    input = input.replace(/one/g, "1");
    input = input.replace(/two/g, "2");
    input = input.replace(/three/g, "3");
    input = input.replace(/four/g, "4");
    input = input.replace(/five/g, "5");
    input = input.replace(/six/g, "6");
    input = input.replace(/seven/g, "7");
    input = input.replace(/eight/g, "8");
    input = input.replace(/nine/g, "9");
    return input;
};

fs.readFile("input.txt", "utf-8", (err, data) => {
    if (err) {
        return console.error("Error while reading the file: " + err);
    }

    const dataArray = data.split("\n");
    let sum = 0;

    dataArray.forEach((line) => {
        const replacedLine = replaceStrings(line);
        const regex = /\d/g;
        let numbers = replacedLine.match(regex);

        if (numbers) {
            let value = numbers[0] + numbers[numbers.length - 1];
            sum += Number(value);
        }
    });

    console.log("The result is: " + sum); // part I - 56506, part II - 55584
});
