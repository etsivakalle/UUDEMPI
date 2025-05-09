import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

const Input = (props) => <input {...props} className="border px-2 py-1 rounded w-full" />;
const Button = ({ children, ...props }) => (
  <button {...props} className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600" >
    {children}
  </button>
);
const Card = ({ children }) => <div className="bg-white rounded shadow">{children}</div>;
const CardContent = ({ children, className }) => <div className={className}>{children}</div>;

export default function BudgetApp() {
  const aloitusarvot = {
    vuokra: 0,
    lainat: 0,
    velat: 0,
    laskut: 0,
    ruoka: 0,
    vaatteet: 0,
    muuPakollinen: 0,

    sahko: 0,
    sahkonsiirto: 0,
    vakuutus: 0,
    vesi: 0,
    puhelin: 0,
    netti: 0,
    muutLaskut: 0,

    harrastukset: 0,
    ruokaUlkona: 0,
    ravintolat: 0,
    suoratoisto: 0,
    hsl: 0,
    nikotiini: 0,
    muuMeno: 0,

    palkka: 0,
    asumistuki: 0,
    tyottomyysturva: 0,
    toimeentulotuki: 0,
    opintoraha: 0,
    opintolaina: 0,
    sairauspvraha: 0,
    muutTulot: 0,
  };

  const [arvot, setArvot] = useState(() => {
    const tallennetut = localStorage.getItem("budjetti-arvot");
    return tallennetut ? JSON.parse(tallennetut) : aloitusarvot;
  });

  useEffect(() => {
    localStorage.setItem("budjetti-arvot", JSON.stringify(arvot));
  }, [arvot]);

  const muuta = (key, value) => {
    setArvot({ ...arvot, [key]: parseFloat(value) || 0 });
  };

  const tyhjenna = () => {
    if (window.confirm("Haluatko varmasti tyhjentää kaikki kentät?")) {
      setArvot(aloitusarvot);
      localStorage.removeItem("budjetti-arvot");
    }
  };

  const lataaKuvana = async () => {
    const element = document.getElementById("budjetti-nakyma");
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement("a");
      link.download = "budjetti.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const ryhmaSumma = (avaimet) => avaimet.reduce((sum, k) => sum + arvot[k], 0);
  const pakolliset = ryhmaSumma(["vuokra", "lainat", "velat", "laskut", "ruoka", "vaatteet", "muuPakollinen"]);
  const laskut = ryhmaSumma(["sahko", "sahkonsiirto", "vakuutus", "vesi", "puhelin", "netti", "muutLaskut"]);
  const muutMenot = ryhmaSumma(["harrastukset", "ruokaUlkona", "ravintolat", "suoratoisto", "hsl", "nikotiini", "muuMeno"]);
  const tulot = ryhmaSumma(["palkka", "asumistuki", "tyottomyysturva", "toimeentulotuki", "opintoraha", "opintolaina", "sairauspvraha", "muutTulot"]);
  const kokonaisMenot = pakolliset + laskut + muutMenot;
  const saldo = tulot - kokonaisMenot;

  const Rivi = ({ label, id }) => (
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm w-2/3" htmlFor={id}>{label}</label>
      <Input
        id={id}
        type="number"
        value={arvot[id]}
        onChange={(e) => muuta(id, e.target.value)}
        className="w-1/3"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-center">Oma Budjetti</h1>
      <p className="text-center text-xs text-gray-600">Stadin etsivät, Helsingin kaupungin etsivä nuorisotyö</p>

      <div id="budjetti-nakyma">
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* sisältö säilyy muuttumattomana */}
          </CardContent>
        </Card>
      </div>

      <Button onClick={lataaKuvana}>Tallenna kuvana</Button>
      <Button onClick={tyhjenna} className="mt-2 bg-red-600 hover:bg-red-700">Tyhjennä kaikki</Button>
      <p className="text-center text-xs text-gray-400 mt-4">Versio 1.0</p>
    </div>
  );
}
