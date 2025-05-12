import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

const Input = (props) => (
  <input
    {...props}
    className="border px-2 py-1 rounded w-full"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}
  />
);
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

  const [arvot, setArvot] = useState(aloitusarvot);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tallennetut = localStorage.getItem("budjetti-arvot");
      if (tallennetut) {
        setArvot(JSON.parse(tallennetut));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("budjetti-arvot", JSON.stringify(arvot));
    }
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

  const Rivi = ({ label, id }) => {
  const [inputValue, setInputValue] = useState(arvot[id].toString());

  useEffect(() => {
    setInputValue(arvot[id].toString());
  }, [arvot, id]);

  const handleBlur = () => {
    setArvot({ ...arvot, [id]: parseFloat(inputValue) || 0 });
  };

  return (
    <div className="flex justify-between items-center mb-2 text-base">
      <label className="text-sm w-2/3" htmlFor={id}>{label}</label>
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        className="w-1/3"
      />
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center mb-2">Oma Budjetti</h1>
      <p className="text-center text-sm text-gray-700 mb-4">Stadin etsivät, Helsingin kaupungin etsivä nuorisotyö</p>

      <div id="budjetti-nakyma" className="grid gap-4 md:grid-cols-2">
        <Card><CardContent style={{ backgroundColor: '#fee2e2', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 className="font-bold">1. Pakolliset menot</h2>
<Rivi label="Vuokra" id="vuokra" />
<Rivi label="Lainat" id="lainat" />
<Rivi label="Velat" id="velat" />
<Rivi label="Laskut" id="laskut" />
<Rivi label="Ruoka" id="ruoka" />
<Rivi label="Vaatteet" id="vaatteet" />
<Rivi label="Muu meno" id="muuPakollinen" />
<p className="font-semibold">Yhteensä: {pakolliset.toFixed(2)} €</p>

</CardContent></Card><Card><CardContent style={{ backgroundColor: '#fef9c3', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 className="font-bold">2. Laskujen erittely</h2>
<Rivi label="Sähkölasku" id="sahko" />
<Rivi label="Sähkön siirto" id="sahkonsiirto" />
<Rivi label="Kotivakuutus" id="vakuutus" />
<Rivi label="Vesilasku" id="vesi" />
<Rivi label="Puhelinlasku" id="puhelin" />
<Rivi label="Nettilasku" id="netti" />
<Rivi label="Muut laskut" id="muutLaskut" />
<p className="font-semibold">Yhteensä: {laskut.toFixed(2)} €</p>

</CardContent></Card><Card><CardContent style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 className="font-bold">3. Muut menot</h2>
<Rivi label="Harrastaminen" id="harrastukset" />
<Rivi label="Wolt / Foodora" id="ruokaUlkona" />
<Rivi label="Ravintolat" id="ravintolat" />
<Rivi label="Suoratoistopalvelut" id="suoratoisto" />
<Rivi label="HSL" id="hsl" />
<Rivi label="Nikotiinituotteet" id="nikotiini" />
<Rivi label="Muu meno" id="muuMeno" />
<p className="font-semibold">Yhteensä: {muutMenot.toFixed(2)} €</p>

</CardContent></Card><Card><CardContent style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 className="font-bold">4. Tulot</h2>
<Rivi label="Palkka" id="palkka" />
<Rivi label="Asumistuki" id="asumistuki" />
<Rivi label="Työttömyysturva" id="tyottomyysturva" />
<Rivi label="Toimeentulotuki" id="toimeentulotuki" />
<Rivi label="Opintoraha" id="opintoraha" />
<Rivi label="Opintolaina" id="opintolaina" />
<Rivi label="Sairauspäiväraha" id="sairauspvraha" />
<Rivi label="Muu tulo" id="muutTulot" />
<p className="font-semibold">Yhteensä: {tulot.toFixed(2)} €</p>

<hr className="my-2" />
<p><strong>Kuukauden tulot yhteensä:</strong> {tulot.toFixed(2)} €</p>
<p><strong>Kuukauden menot yhteensä:</strong> {kokonaisMenot.toFixed(2)} €</p>
<p><strong>Kuukauden saldo:</strong> {saldo.toFixed(2)} €</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={lataaKuvana}>Tallenna kuvana</Button>
      <Button onClick={tyhjenna} className="mt-2 bg-red-600 hover:bg-red-700">Tyhjennä kaikki</Button>
      <p className="text-center text-sm text-gray-500 mt-6">Versio 1.0</p>
    </div>
  );
}
