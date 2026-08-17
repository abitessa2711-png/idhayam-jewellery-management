const uruttuImg1 = [9.750, 10.060, 9.690, 10.000, 10.300, 12.200]
const uruttuImg2 = [8.890, 11.750, 10.040, 13.870, 8.010, 11.990, 11.790, 10.310, 7.860, 11.670, 7.700]

const wt1 = uruttuImg1.reduce((a,b)=>a+b,0)
const wt2 = uruttuImg2.reduce((a,b)=>a+b,0)
const totalUruttuPcs = uruttuImg1.length + uruttuImg2.length
const totalUruttuWt = wt1 + wt2

console.log("=== URUTTU METTI (IMG 1 + IMG 2) ===")
console.log(`Image 1 (தனிமை உருட்டு): ${uruttuImg1.length} Pcs | Weight: ${wt1.toFixed(3)}g`)
console.log(`Image 2 (உருட்டு மெட்டி):   ${uruttuImg2.length} Pcs | Weight: ${wt2.toFixed(3)}g`)
console.log(`Total Uruttu Metti:        ${totalUruttuPcs} Pcs | Weight: ${totalUruttuWt.toFixed(3)}g (~${(totalUruttuWt/1000).toFixed(3)} kg)`)
