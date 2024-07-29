import React, { useState } from "react";
import Label from "./components/Label";
import Button from "./components/Button";
import Input from "./components/Input";
import ResultsTable from "./components/ResultsTable";
import { calculateIMC, IMCResult } from "./lib/IMC";
import ReferenceTable from "./components/ReferenceTable";

interface IMCData {
  weight: number;
  height: number;
  imc: number;
  result: string;
}

function App() {
  const [IMCData, setIMCData] = useState<null | IMCData>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { weight: string; height: string };

    const { weight, height } = data;

    if (!weight || !height) {
      return alert('Você precisa preencher todos os campos!');
    }

    const weightNumber = parseFloat(weight.replace(',', '.'));
    const heightNumber = parseFloat(height.replace(',', '.')) / 100;

    if (isNaN(weightNumber) || isNaN(heightNumber)) {
      return alert('Peso e altura precisam ser números!');
    }

    if (weightNumber < 2 || weightNumber > 500) {
      return alert('Peso deve estar entre 2kg e 500kg');
    }

    if (heightNumber < 0.5 || heightNumber > 2.9) {
      return alert('Altura deve estar entre 0,5m e 2,9m');
    }

    const IMC = calculateIMC(weightNumber, heightNumber);
    const result = IMCResult(IMC);

    setIMCData({ 
      weight: weightNumber,
      height: heightNumber,
      imc: IMC,
      result: result,
    });

    e.currentTarget.reset();
  }

  function handleClickReset(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIMCData(null);
  }

  return (
    <main className="md:bg-white max-w-4xl mx-auto md:py-24 md:px-48 px-5 py-10">
      <section id="form">
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="weight">Peso (Kg)</Label>
            <Input disabled={!!IMCData} name="weight" className="mt-1" type="text" id="weight"></Input>
          </div>
          <div className="mt-4">
            <Label htmlFor="height">Altura (Cm)</Label>
            <Input disabled={!!IMCData} name="height" className="mt-1" type="text" id="height"></Input>
          </div>
          {IMCData ? (
            <Button onClick={handleClickReset} type="button">Refazer</Button>
          ) : (
            <Button type="submit">Calcular</Button>
          )}
        </form>
      </section>
      <section id="result" className="py-10 px-4 h-40">
        {IMCData ? (
          <ResultsTable IMCData={IMCData} />
        ) : (
          <p className="text-center text-neutral-400 text-xl">
            Saiba agora se está no seu peso ideal
          </p>
        )}
      </section>
      <section id="reference-table">
        <ReferenceTable />
      </section>
    </main>
  );
}

export default App;
