import { useState } from "react";
import "./App.css";

export default function App() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState(null);

  async function calcularIMC(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/imc/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: parseFloat(altura),
          weight: parseFloat(peso)
        })
      });
      if (!response.ok) throw new Error("Erro ao calcular IMC");
      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao calcular IMC");
    }
  }

  function renderTabelaIMC(imc) {
    const intervalos = [
      { min: 0, max: 18.4, classificacao: "Abaixo do peso" },
      { min: 18.4, max: 24.9, classificacao: "Peso normal" },
      { min: 24.9, max: 29.9, classificacao: "Sobrepeso" },
      { min: 29.9, max: Infinity, classificacao: "Obesidade" }
    ];
    return (
      <table id="tabela-imc">
        <thead>
          <tr>
            <th>Classificação</th>
            <th>IMC</th>
          </tr>
        </thead>
        <tbody>
          {intervalos.map((x, i) => {
            const isDestaque = imc >= x.min && imc < x.max;
            return (
              <tr key={i} className={isDestaque ? "destaque-imc" : ""}>
                <td>{x.classificacao}</td>
                <td>{x.min} - {x.max === Infinity ? "∞" : x.max}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div className="container">
      <div className="data">
        <form className="form" onSubmit={calcularIMC}>
          <div className="row">
            <label>Altura:</label>
            <input
              type="text"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="Digite sua altura (em metros)"
            />
          </div>
          <div className="row">
            <label>Peso:</label>
            <input
              type="text"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Digite seu peso (em kg)"
            />
          </div>
          <div className="row">
            <button type="submit">Calcular IMC</button>
          </div>
        </form>
      </div>
      <div className="data">
        {resultado && (
          <>
            <p>Seu IMC é {resultado.imc} - {resultado.imcDescription}</p>
            <div id="tabela-imc-container">
              {renderTabelaIMC(parseFloat(resultado.imc))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}