import { useEffect, useState } from "react";
import "./styles.css";

const Simulation = () => {
  const protectionMap = {
    0: "Free-trade",
    1: "Tariff",
    2: "Quota",
    3: "Subsidy",
  };

  const getMultiplier = (totalSubsidy) => {
    totalSubsidy /= 10_000;
    const multiplier =
      (-10 / Math.sqrt(2 * Math.PI)) *
        Math.pow(Math.E, (totalSubsidy * totalSubsidy) / -72) +
      5;

    return multiplier;
  };

  const PRICE = 10;
  const QUANTITY = 10_000;

  const DEMAND_M = 1;
  const SUPPLY_M = -1;

  const [userTurn, setUserTurn] = useState(true);

  const [budget, setBudget] = useState(100_000);
  const [domesticMultiplier, setDomesticMultiplier] = useState(1);
  const [domesticSubsidy, setDomesticSubsidy] = useState(0);
  const [domesticPrice, setDomesticPrice] = useState(PRICE);
  const [domesticQuantity, setDomesticQuantity] = useState(QUANTITY);

  const [foreignMultiplier, setForeignMultiplier] = useState(1);
  const [foreignSubsidy, setForeignSubsidy] = useState(0);
  const [foreignPrice, setForeignPrice] = useState(PRICE);
  const [foreignQuantity, setForeignQuantity] = useState(QUANTITY);

  const [importQuantity, setImportQuantity] = useState(5_000);
  const [exportQuantity, setExportQuantity] = useState(5_000);

  const [domesticProtection, setDomesticProtection] = useState(0);
  const [domesticProtectionValue, setDomesticProtectionValue] = useState(0);

  const [foreignProtection, setForeignProtection] = useState(0);
  const [foreignProtectionValue, setForeignProtectionValue] = useState(0);

  const [foreignAggressionIndex, setForeignAggressionIndex] = useState(5);

  //const [allData, setAllData] = useState([budget]);

  const [domesticProtectionBuffer, setDomesticProtectionBuffer] = useState(0);
  const [domesticProtectionValueBuffer, setDomesticProtectionValueBuffer] =
    useState(0);
  const [subsidizeDomesticValueBuffer, setSubsidizeDomesticValueBuffer] =
    useState(0);

  const handleFreeTrade = () => {
    console.log("ft");
    return true;
  };
  const handleTariff = () => {
    return true;
  };
  const handleQuota = () => {
    console.log("q");
    return true;
  };
  const handleSubsidy = () => {
    console.log("s");
    return true;
  };

  const handleProtectionMap = {
    0: handleFreeTrade,
    1: handleTariff,
    2: handleQuota,
    3: handleSubsidy,
  };

  const handleNextFrame = () => {
    setUserTurn(false);

    // const isAble = handleProtectionMap[domesticProtectionBuffer]();
    let expenses = subsidizeDomesticValueBuffer;
    if (domesticProtectionBuffer == 3) {
      expenses += domesticProtectionValueBuffer;
    }
    if (expenses > budget) {
      console.log("Insufficient budget");
      return;
    }
    setDomesticProtection(domesticProtectionBuffer);
    setDomesticProtectionValue(domesticProtectionValueBuffer);

    setBudget(budget - expenses);

    const totalDomesticSubsidy = domesticSubsidy + subsidizeDomesticValueBuffer;
    setDomesticSubsidy(totalDomesticSubsidy);

    const newDomesticMultiplier = getMultiplier(totalDomesticSubsidy);
    setDomesticMultiplier(newDomesticMultiplier);

    const newDomesticPrice = PRICE / newDomesticMultiplier;
    setDomesticPrice(newDomesticPrice);

    const newDomesticQuantity = QUANTITY * newDomesticMultiplier;
    setDomesticQuantity(newDomesticQuantity);
  };

  return (
    <>
      <span>budget: {budget}</span>
      <br />
      <span>domesticMultiplier: {domesticMultiplier}</span>
      <br />
      <span>domesticSubsidy: {domesticSubsidy}</span>
      <br />
      <span>domesticPrice: {domesticPrice}</span>
      <br />
      <span>domesticQuantity: {domesticQuantity}</span>
      <br />

      <br />
      <span>foreignMultiplier: {foreignMultiplier}</span>
      <br />
      <span>foreignSubsidy: {foreignSubsidy}</span>
      <br />
      <span>foreignPrice: {foreignPrice}</span>
      <br />
      <span>foreignQuantity: {foreignQuantity}</span>
      <br />

      <br />
      <span>importQuantity: {importQuantity}</span>
      <br />
      <span>exportQuantity: {exportQuantity}</span>
      <br />

      <br />
      <span>
        domesticProtection: {domesticProtection} (
        {protectionMap[domesticProtection]})
      </span>
      <br />
      <span>domesticProtectionValue: {domesticProtectionValue}</span>
      <br />

      <br />
      <span>
        foreignProtection: {foreignProtection} (
        {protectionMap[foreignProtection]})
      </span>
      <br />
      <span>foreignProtectionValue: {foreignProtectionValue}</span>
      <br />
      <br />
      <br />
      <span>
        domesticProtectionBuffer: {domesticProtectionBuffer} (
        {protectionMap[domesticProtectionBuffer]})
      </span>
      <br />
      <span>
        domesticProtectionValueBuffer: {domesticProtectionValueBuffer}
      </span>
      <br />
      <span>subsidizeDomesticValueBuffer: {subsidizeDomesticValueBuffer}</span>
      <br />

      <select
        className="simulation_trade_type"
        onClick={(e) => setDomesticProtectionBuffer(e.target.value)}
        disabled={!userTurn}
      >
        <option value="0">Request free-trade</option>
        <option value="1">Impose Tariff</option>
        <option value="2">Impose Quota</option>
        <option value="3">Impose Subsidy</option>
      </select>

      <input
        type="number"
        placeholder={protectionMap[domesticProtectionBuffer]}
        min={1}
        value={domesticProtectionValueBuffer}
        onChange={(e) => setDomesticProtectionValueBuffer(e.target.value)}
        disabled={!userTurn}
      />

      <input
        type="number"
        placeholder="Normal Subsidy"
        min={0}
        value={subsidizeDomesticValueBuffer}
        onChange={(e) => setSubsidizeDomesticValueBuffer(e.target.value)}
        disabled={!userTurn}
      />

      <input
        type="button"
        value="End Turn"
        onClick={() => {
          handleNextFrame();
          setUserTurn(true);
        }}
        disabled={!userTurn}
      />
    </>
  );
};

export default Simulation;
