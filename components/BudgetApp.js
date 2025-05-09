import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

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
            <h2 className="font-bold">1. Pakolliset menot</h2>
            <Rivi label="Vuokra" id="vuokra" />
            <Rivi label="Lainat" id="lainat" />
            <Rivi label="Velat" id="velat" />
            <Rivi label="Laskut" id="laskut" />
            <Rivi label="Ruoka" id="ruoka" />
            <Rivi label="Vaatteet" id="vaatteet" />
            <Rivi label="Muu meno" id="muuPakollinen" />
            <p className="font-semibold">Yhteensä: {pakolliset.toFixed(2)} €</p>

            <h2 className="font-bold mt-4">2. Laskujen erittely</h2>
            <Rivi label="Sähkölasku" id="sahko" />
            <Rivi label="Sähkön siirto" id="sahkonsiirto" />
            <Rivi label="Kotivakuutus" id="vakuutus" />
            <Rivi label="Vesilasku" id="vesi" />
            <Rivi label="Puhelinlasku" id="puhelin" />
            <Rivi label="Nettilasku" id="netti" />
            <Rivi label="Muut laskut" id="muutLaskut" />
            <p className="font-semibold">Yhteensä: {laskut.toFixed(2)} €</p>

            <h2 className="font-bold mt-4">3. Muut menot</h2>
            <Rivi label="Harrastaminen" id="harrastukset" />
            <Rivi label="Wolt / Foodora" id="ruokaUlkona" />
            <Rivi label="Ravintolat" id="ravintolat" />
            <Rivi label="Suoratoistopalvelut" id="suoratoisto" />
            <Rivi label="HSL" id="hsl" />
            <Rivi label="Nikotiinituotteet" id="nikotiini" />
            <Rivi label="Muu meno" id="muuMeno" />
            <p className="font-semibold">Yhteensä: {muutMenot.toFixed(2)} €</p>

            <h2 className="font-bold mt-4">4. Tulot</h2>
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

      <Button onClick={lataaKuvana} className="w-full bg-blue-500 hover:bg-blue-600">Tallenna kuvana</Button>
      <Button onClick={tyhjenna} className="w-full bg-red-500 hover:bg-red-600 mt-2">Tyhjennä kaikki</Button>
      <p className="text-center text-xs text-gray-400 mt-4">Versio 1.0</p>
    </div>
  );
}
