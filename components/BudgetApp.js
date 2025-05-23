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
    const pdf = new jsPDF();
    let y = 10;

    const kirjoitaOsio = (otsikko, avaimet) => {
      pdf.setFontSize(14);
      pdf.text(otsikko, 10, y);
      y += 7;
      pdf.setFontSize(12);
      avaimet.forEach((avain) => {
        const arvo = arvot[avain];
        if (arvo > 0) {
          pdf.text(`- ${avain.charAt(0).toUpperCase() + avain.slice(1)}: ${arvo.toFixed(2)} €`, 12, y);
          y += 6;
        }
      });
      y += 5;
    };

    kirjoitaOsio('Pakolliset menot', ["vuokra", "lainat", "velat", "laskut", "ruoka", "vaatteet", "muuPakollinen"]);
    kirjoitaOsio('Laskujen erittely', ["sahko", "sahkonsiirto", "vakuutus", "vesi", "puhelin", "netti", "muutLaskut"]);
    kirjoitaOsio('Muut menot', ["harrastukset", "ruokaUlkona", "ravintolat", "suoratoisto", "hsl", "nikotiini", "muuMeno"]);
    kirjoitaOsio('Tulot', ["palkka", "asumistuki", "tyottomyysturva", "toimeentulotuki", "opintoraha", "opintolaina", "sairauspvraha", "muutTulot"]);

    pdf.setFontSize(14);
    pdf.text('Yhteenveto', 10, y);
    y += 7;
    pdf.setFontSize(12);
    pdf.text(`Kuukauden tulot yhteensä: ${tulot.toFixed(2)} €`, 12, y);
    y += 6;
    pdf.text(`Kuukauden menot yhteensä: ${kokonaisMenot.toFixed(2)} €`, 12, y);
    y += 6;
    pdf.text(`Kuukauden saldo: ${saldo.toFixed(2)} €`, 12, y);

    pdf.save("budjetti_yhteenveto.pdf");
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', backgroundColor: '#f0f4ff' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Oma Budjetti</h1>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginBottom: '16px' }}>
        Stadin etsivät, Helsingin kaupungin etsivä nuorisotyö
      </p>

      <div id="budjetti-nakyma" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Card><div style={{ flex: '1 1 280px' }}><CardContent style={{ backgroundColor: '#fee2e2', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #999' }}><h2 onClick={() => setAuki(prev => ({ ...prev, pakolliset: !prev.pakolliset }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>{auki.pakolliset ? '▼' : '►'} 1. Pakolliset menot <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>(avaa)</span></h2>
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

        <Card><CardContent style={{ backgroundColor: '#fef9c3', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #999' }}><h2 onClick={() => setAuki(prev => ({ ...prev, laskut: !prev.laskut }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>{auki.laskut ? '▼' : '►'} 2. Laskujen erittely <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>(avaa)</span></h2>
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

        <Card><CardContent style={{ backgroundColor: '#d1d5db', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #999' }}><h2 onClick={() => setAuki(prev => ({ ...prev, muut: !prev.muut }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>{auki.muut ? '▼' : '►'} 3. Muut menot <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>(avaa)</span></h2>
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

        <Card><CardContent style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #999' }}><h2 onClick={() => setAuki(prev => ({ ...prev, tulot: !prev.tulot }))} style={{ cursor: 'pointer', marginBottom: '8px' }}>{auki.tulot ? '▼' : '►'} 4. Tulot <span style={{ fontSize: '12px', color: '#666', marginLeft: '6px' }}>(avaa)</span></h2>
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

        <Card><CardContent style={{ backgroundColor: '#93c5fd', padding: '1.5rem', borderRadius: '0.5rem', fontSize: '18px', border: '1px solid #666' }}>
          <h2 style={{ marginBottom: '8px' }}>Yhteenveto</h2>
          <p><strong>Kuukauden tulot yhteensä:</strong> {tulot.toFixed(2)} €</p>
          <p><strong>Kuukauden menot yhteensä:</strong> {kokonaisMenot.toFixed(2)} €</p>
          <p><strong>Kuukauden saldo:</strong> {saldo.toFixed(2)} €</p>
        </CardContent></Card>

      </div>

      <Button onClick={lataaKuvana}>Tallenna kuvana</Button>
      <Button onClick={lataaPdf}>Lataa PDF</Button>
      <Button onClick={tyhjenna}>Tyhjennä kaikki</Button>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#777', marginTop: '24px' }}>Versio 2.0</p>
    </div>
  );
}
