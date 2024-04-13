const fs = require("fs");
const http = require("http");

http
  .createServer((req, res) => {
    if (req.url.endsWith("/style.css")) {
      const css = fs.readFileSync("./frontend/style.css", "utf-8");
      res.write(css);
    } else if (req.url.endsWith("/main.js")) {
      const js = fs.readFileSync("./frontend/main.js", "utf-8");
      res.write(js);
    } else if (req.url != "/favicon.ico") {
      console.log(`[${req.method}] ${req.url} :${res.statusCode}`);
      if (req.url.includes("result")) {
        res.writeHead(200, { Location: "/" });
      } else {
        const equation = req.url
          .substring(1, req.url.length)
          .replace("/div/", "/")
          .replace("/add/", "+")
          .replace("/sub/", "-")
          .replace("/mult/", "*")
          .replace("/mod/", "%")
          .replace("/dot/", ".");
        // const result = solveEquation(equation);
        const result = eval(equation);

        if (!result) {
          res.writeHead(200, { Location: "/" });
        }

        // Save the result to the log file
        saveToLog(
          `${new Date().toISOString()} [${
            req.method
          }] Equation: ${equation} Result: ${result}\n`
        );

        res.writeHead(301, { Location: `/result/${result}` });
      }

      const index = fs.readFileSync("./frontend/index.html", "utf-8");
      res.write(index);
    }
    res.end();
  })
  .listen(12345, () => {
    console.log("Server Running on Port: [12345]");
  });

function solveEquation(equation) {
  // Remove all whitespace from the equation
  equation = equation.replace(/\s/g, "");

  // Split the equation into separate parts based on operators
  let parts = equation.match(/[+\-*/%]?[^+\-*/%]+/g);

  // Initialize result variable with the first part of the equation
  let result = parseFloat(parts[0]);

  // Iterate through the remaining parts of the equation
  for (let i = 1; i < parts.length; i++) {
    let operator = parts[i][0]; // Extract the operator
    let operand = parseFloat(parts[i].slice(1)); // Extract the operand

    // Perform the operation based on the operator
    switch (operator) {
      case "+":
        result += operand;
        break;
      case "-":
        result -= operand;
        break;
      case "*":
        result *= operand;
        break;
      case "/":
        result /= operand;
        break;
      case "%":
        result %= operand;
        break;
      default:
        // If an invalid operator is encountered, return NaN
        return NaN;
    }
  }

  return result;
}

function saveToLog(data) {
  fs.appendFile("log.txt", data, (err) => {
    if (err) throw err;
    console.log("Data appended to log file.");
  });
}
