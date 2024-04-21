"use client";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export const dynamic = "force-dynamic";
export const preferredRegion = "gru1";

// import dynamicImport from "next/dynamic";

// const Map = dynamicImport(() => import("@/components/Map"), {
//   ssr: false,
// });

interface QuestionItem {
  question: string;
  choices: Array<string>;
}

const defaultInput = `Qué color es mas oscuro?
Negro
Gris
Verde

Qué edificio es mas alto?
Torre eiffel
Obelisco
Casa rosada
Monumento a la bandera

Las ballenas son mamíferos?
Si
No`;

export default function Home() {
  const [input, setInput] = useLocalStorageState("input", {
    defaultValue: defaultInput,
  });
  const [testsCount, setTestsCount] = useLocalStorageState("testsCount", {
    defaultValue: 20,
  });
  const [questionsCount, setQuestionsCount] = useLocalStorageState(
    "questionsCount",
    { defaultValue: 10 }
  );

  const [questionItems, setQuestionItems] = useState<Array<QuestionItem>>([]);

  useEffect(() => {
    // input is like this:
    // question1
    // choice1 (first one is true rest are false)
    // choice2
    // choice3
    // (empty line)
    // question2
    // choice1
    // choice2
    // choice3
    // choice4
    // (empty line)
    // question3
    // choice1
    // choice2
    //
    // Parse result should be like this:
    // [
    //   {
    //     question: "question1",
    //     choices: ["choice1", "choice2", "choice3"],
    //   },
    //   {
    //     question: "question2",
    //     choices: ["choice1", "choice2", "choice3", "choice4"],
    //   },
    //   {
    //     question: "question3",
    //     choices: ["choice1", "choice2"],
    //   },
    // ];

    const lines = input.split("\n");
    let parsed: Array<QuestionItem> = [];
    let currentQuestion: QuestionItem | null = null;
    for (const line of lines) {
      if (line.trim() === "") {
        if (currentQuestion) {
          parsed.push(currentQuestion);
          currentQuestion = null;
        }
      } else {
        if (!currentQuestion) {
          currentQuestion = {
            question: line,
            choices: [],
          };
        } else {
          currentQuestion.choices.push(line);
        }
      }
    }
    if (currentQuestion) {
      parsed.push(currentQuestion);
    }
    setQuestionItems(parsed);
  }, [input, testsCount, questionsCount]);

  return (
    <div>
      <div className="inputs" style={{ padding: "20px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>Mezclador de Multiple Choice</div>

          <a href="https://github.com/jperelli/multiplechoiceshuffler">
            <svg
              width="100%"
              height="18px"
              viewBox="0 0 96 98"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="#24292f"
              />
            </svg>
          </a>
          <a style={{ paddingLeft: "4px" }} href="https://twitter.com/jperelli">
            <svg
              width="100%"
              height="18px"
              viewBox="0 0 271 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
            </svg>
          </a>
        </div>
        <p
          style={{
            background: "#eef",
            padding: "10px",
            border: "1px solid #dde",
            borderRadius: "4px",
          }}
        >
          Agrega una pregunta en una linea, seguida de una linea por cada opcion
          y termina con una linea en blanco para separar de la siguiente
          pregunta
        </p>
        <div style={{ display: "flex", height: "50vh" }}>
          <div className="data" style={{ flex: 1, padding: "0 10px 0 0" }}>
            <textarea
              style={{ width: "calc(100% - 6px)", height: "100%" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <div
            className="preview"
            style={{ flex: 1, overflow: "auto", border: "1px solid black" }}
          >
            <ol>
              {questionItems.map((question, i) => {
                return (
                  <li key={i}>
                    <h3>{question.question}</h3>
                    <ol type="a">
                      {question.choices.map((choice, j) => {
                        return <li key={j}>{choice}</li>;
                      })}
                    </ol>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <br />
        <label>
          Numero de examenes a generar &nbsp;
          <input
            type="number"
            value={testsCount}
            onChange={(e) => setTestsCount(parseInt(e.target.value))}
          />
        </label>

        <br />
        <label>
          Numero de preguntas por examen &nbsp;
          <input
            type="number"
            value={questionsCount}
            onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
          />
        </label>
        <br />
        <button
          onClick={() => {
            window.print();
          }}
          style={{
            padding: "10px",
            fontSize: "1.3em",
            background: "#7e7",
            borderRadius: "4px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Generar Examenes / Imprimir
        </button>
      </div>
      <div className="outputs" style={{ width: "50vw" }}>
        {Array(testsCount)
          .fill(0)
          .map((_, i) => {
            return (
              <div style={{ breakAfter: "page" }} key={i}>
                <h2>Examen {i + 1}</h2>
                <ol>
                  {questionItems
                    .slice()
                    .sort(() => Math.random() - 0.5)
                    .slice(0, questionsCount)
                    .map((question, j) => {
                      return (
                        <li key={j}>
                          <h3>{question.question}</h3>
                          <ol type="a">
                            {question.choices
                              .slice()
                              .sort(() => Math.random() - 0.5)
                              .map((choice, k) => {
                                return <li key={k}>{choice}</li>;
                              })}
                          </ol>
                        </li>
                      );
                    })}
                </ol>
              </div>
            );
          })}
      </div>
    </div>
  );
}
