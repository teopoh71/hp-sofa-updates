/* ZL3861 selling prices: approved existing-app conversion, TABLE B selected by Edwin.
 * Source: price-lists/received-2026-07/EXPORT 2020 (ZL 3300 )(1).xls
 * Sheet1: 684=1EL, 685=1NA, 686=1ER/C, 687=3821 TABLE B.
 * Columns D=M/F, I=F/SA, K=N.b/N.p. Preserve full source precision.
 * User-confirmed 2026-10-07: exact FSA base prices; optional electric +CNY2600 per eligible piece.
 */
(function(root, factory) {
  const api=factory();
  if(typeof module==="object" && module.exports) module.exports=api;
  root.HP_ZOLANO_3861_PRICING=api;
})(typeof globalThis!=="undefined"?globalThis:window,function() {
  "use strict";
  const factor=11.06060606060606;
  const multiplier=2.8;
  const source="EXPORT 2020 (ZL 3300 )(1).xls#Sheet1!";
  const rows={
    "1EL": {configuration:"1EL",row:684,MF:208,FSA:291,NUBUCK:400},
    "1NA": {configuration:"1NA",row:685,MF:172,FSA:221,NUBUCK:296.51162790697674},
    "1ER": {configuration:"1ER/C",row:686,MF:268,FSA:351,NUBUCK:469.7674418604651},
    "TABLE": {configuration:"3821 TABLE B",row:687,MF:165,FSA:189,NUBUCK:276.74418604651163},
    "TABLE_STANDARD": {configuration:"3821 TABLE",row:688,MF:119,FSA:143,NUBUCK:184.88372093023256}
  };
  const rates=[1,.88,.85,.83,.8,.75,.73,.7];
  const motorAddon=2600;
  const poweredKinds=new Set(["1EL","1ER"]);
  function unitPrice(kind,material) {
    if(!Object.hasOwn(rows,kind)||!["MF","FSA","NUBUCK"].includes(material)) return null;
    const row=rows[kind], base=row[material];
    const exactFsa={"1EL":9012,"1NA":6844,"1ER":10870,"TABLE":5853};
    const retail=material === "NUBUCK" ? null : material === "FSA" && exactFsa[kind] != null ? exactFsa[kind] : Math.ceil(base*factor*multiplier/100)*100;
    return Object.freeze({kind,configuration:row.configuration,material,base,motorFeeUsd:0,
      retail,currency:"CNY",source:source+row.row,motorIncluded:false,
      motorOption:poweredKinds.has(kind)?"R/SB":null,motorSurchargeSource:poweredKinds.has(kind)?"user-confirmed-2026-10-07":null,
      priceStatus:material === "NUBUCK"
        ? "pending: source column N.b/N.p is ambiguous"
        : "source-backed"});
  }
  function quote(pieces,rate=1,motorCount=0) {
    if(!Array.isArray(pieces)||pieces.length>10||!rates.includes(rate)||!Number.isSafeInteger(motorCount)||motorCount<0||!Number.isSafeInteger(motorCount*motorAddon)) return null;
    if(motorCount>pieces.filter(piece=>poweredKinds.has(piece?.kind)).length)return null;
    const lines=[];
    for(const piece of pieces) {
      if(!piece||!Object.hasOwn(rows,piece.kind)||!["MF","FSA","NUBUCK"].includes(piece.material))return null;
      lines.push(unitPrice(piece.kind,piece.material));
    }
    const baseSubtotal=lines.reduce((sum,line)=>sum+(line.retail==null?0:line.retail),0),motorSubtotal=motorCount*motorAddon;
    const original=baseSubtotal+motorSubtotal;
    const unknownMaterialPending=lines.some(line=>line.retail==null);
    if(!Number.isSafeInteger(baseSubtotal)||!Number.isSafeInteger(original)) return null;
    const total=rate===1?original:Math.min(original,Math.ceil(original*rate/100)*100);
    return {lines,original:unknownMaterialPending?null:original,total:unknownMaterialPending?null:total,
      savings:unknownMaterialPending?null:original-total,rate,
      poweredTotalPending:false,motorCount,motorSubtotal,baseSubtotal:unknownMaterialPending?null:baseSubtotal,unknownMaterialPending};
  }
  return Object.freeze({quote,unitPrice});
});
