import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Input = (props) => (
  <input
    {...props}
    style={{ padding: '8px', margin: '4px 0', fontSize: '16px', width: '100%' }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}
  />
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      backgroundColor: '#2563eb',
      color: '#fff',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      marginTop: '12px',
      width: '100%',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div style={{ marginBottom: '20px' }}>{children}</div>
);

const CardContent = ({ children, style }) => (
  <div style={{ ...style, fontSize: '16px', lineHeight: '1.6' }}>{children}</div>
);

export default function BudgetApp() {
  const [auki, setAuki] = useState({
    'pakolliset': false,
    'laskut': false,
    'muut': false,
    'tulot': false
  });
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

  const lataaPdf = async () => {
    const element = document.getElementById("budjetti-nakyma");
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const margin = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", 0, margin > 0 ? margin : 0, imgWidth, imgHeight);
      pdf.save("budjetti.pdf");
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
      <div style={{ marginBottom: '12px' }}>
        <label htmlFor={id} style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Oma Budjetti</h1>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginBottom: '16px' }}>
        Stadin etsivät, Helsingin kaupungin etsivä nuorisotyö
      </p>

      <div id="budjetti-nakyma" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Card><div style={{ flex: '1 1 280px' }}><CardContent style={{ backgroundColor: '#fee2e2', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 onClick={() => setAuki(prev => ({ ...prev, pakolliset: !prev.pakolliset }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>{auki.pakolliset ? '▼' : '►'} 1. Pakolliset menot <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>avaa</span></h2>
          {auki.pakolliset && (<div>
          <Rivi label="Vuokra" id="vuokra" />
          <Rivi label="Lainat" id="lainat" />
          <Rivi label="Velat" id="velat" />
          <Rivi label="Laskut" id="laskut" />
          <Rivi label="Ruoka" id="ruoka" />
          <Rivi label="Vaatteet" id="vaatteet" />
          <Rivi label="Muu meno" id="muuPakollinen" />
          <p><strong>Yhteensä:</strong> {pakolliset.toFixed(2)} €</p></div>)}
        </CardContent></div></Card>

        <Card><CardContent style={{ backgroundColor: '#fef9c3', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 onClick={() => setAuki(prev => ({ ...prev, laskut: !prev.laskut }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>$1 2. Laskujen erittely <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>(avaa)</span></h2>
          {auki.laskut && (<div>
          <Rivi label="Sähkölasku" id="sahko" />
          <Rivi label="Sähkön siirto" id="sahkonsiirto" />
          <Rivi label="Kotivakuutus" id="vakuutus" />
          <Rivi label="Vesilasku" id="vesi" />
          <Rivi label="Puhelinlasku" id="puhelin" />
          <Rivi label="Nettilasku" id="netti" />
          <Rivi label="Muut laskut" id="muutLaskut" />
          <p><strong>Yhteensä:</strong> {laskut.toFixed(2)} €</p></div>)}
        </CardContent></Card>

        <Card><CardContent style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 onClick={() => setAuki(prev => ({ ...prev, muut: !prev.muut }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>$1 3. Muut menot <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>(avaa)</span></h2>
          {auki.muut && (<div>
          <Rivi label="Harrastaminen" id="harrastukset" />
          <Rivi label="Wolt / Foodora" id="ruokaUlkona" />
          <Rivi label="Ravintolat" id="ravintolat" />
          <Rivi label="Suoratoistopalvelut" id="suoratoisto" />
          <Rivi label="HSL" id="hsl" />
          <Rivi label="Nikotiinituotteet" id="nikotiini" />
          <Rivi label="Muu meno" id="muuMeno" />
          <p><strong>Yhteensä:</strong> {muutMenot.toFixed(2)} €</p></div>)}
        </CardContent></Card>

        <Card><CardContent style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '0.5rem' }}><h2 onClick={() => setAuki(prev => ({ ...prev, tulot: !prev.tulot }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>$1 4. Tulot <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>(avaa)</span></h2>
          {auki.tulot && (<div>
          <Rivi label="Palkka" id="palkka" />
          <Rivi label="Asumistuki" id="asumistuki" />
          <Rivi label="Työttömyysturva" id="tyottomyysturva" />
          <Rivi label="Toimeentulotuki" id="toimeentulotuki" />
          <Rivi label="Opintoraha" id="opintoraha" />
          <Rivi label="Opintolaina" id="opintolaina" />
          <Rivi label="Sairauspäiväraha" id="sairauspvraha" />
          <Rivi label="Muu tulo" id="muutTulot" />
          <p><strong>Yhteensä:</strong> {tulot.toFixed(2)} €</p></div>)}
          
        </CardContent></Card>

        <Card><CardContent style={{ backgroundColor: '#e0e7ff', padding: '1.5rem', borderRadius: '0.5rem', fontSize: '18px' }}>
          <h2 style={{ marginBottom: '8px' }}>Yhteenveto</h2>
          <p><strong>Kuukauden tulot yhteensä:</strong> {tulot.toFixed(2)} €</p>
          <p><strong>Kuukauden menot yhteensä:</strong> {kokonaisMenot.toFixed(2)} €</p>
          <p><strong>Kuukauden saldo:</strong> {saldo.toFixed(2)} €</p>
        </CardContent></Card>

      </div>

      <Button onClick={lataaKuvana}>Tallenna kuvana</Button>
      <Button onClick={lataaPdf}>Lataa PDF</Button>
      <Button onClick={tyhjenna}>Tyhjennä kaikki</Button>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#777', marginTop: '24px' }}>Versio 1.0</p>
    </div>
  );
}
