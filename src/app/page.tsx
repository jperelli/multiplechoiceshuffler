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
        <h1>Mezclador de Multiple Choice</h1>
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
