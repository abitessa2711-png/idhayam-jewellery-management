const sadaMettiPg1 = [
  5.720, 6.450, 5.790, 5.540, 5.460, 6.140, 5.830, 5.980, 6.060, 5.720,
  5.570, 5.980, 5.960, 6.010, 5.840, 3.570, 3.680, 5.650, 5.810, 7.360,
  6.360, 3.510, 5.350, 6.080, 5.790, 6.070, 5.820, 5.810, 5.610, 6.000,
  5.460, 6.170, 6.140, 5.440, 5.490, 5.750, 6.800, 5.220, 5.860, 6.050,
  6.050, 5.710, 6.010, 5.730, 5.080
]

const sadaMettiPg2 = [
  5.800, 5.700, 6.010, 5.850, 5.560
]

const sadaMettiPg3 = [
  3.400, 3.340, 6.190, 3.810, 5.540, 4.230, 3.440, 3.630, 5.540, 8.630,
  7.460, 6.020, 5.350, 5.940, 4.290, 6.240, 6.320, 6.020, 5.750, 5.430,
  5.850, 4.700, 5.480, 4.640, 5.590, 3.290, 3.500, 6.590, 5.800, 3.420,
  5.560, 3.430, 6.380, 5.390, 3.330, 5.790, 5.750, 4.310
]

console.log("=== SADA METTI DETAILED BREAKDOWN ===")
console.log(`Page 1 (Items 1 - 45): ${sadaMettiPg1.length} Pcs | Weight: ${sadaMettiPg1.reduce((a,b)=>a+b,0).toFixed(3)}g`)
console.log(`Page 2 (Items 1 - 5):  ${sadaMettiPg2.length} Pcs | Weight: ${sadaMettiPg2.reduce((a,b)=>a+b,0).toFixed(3)}g`)
console.log(`Page 3 (Items 1 - 38): ${sadaMettiPg3.length} Pcs | Weight: ${sadaMettiPg3.reduce((a,b)=>a+b,0).toFixed(3)}g`)

const allSada = [...sadaMettiPg1, ...sadaMettiPg2, ...sadaMettiPg3]
const totalWt = allSada.reduce((a,b)=>a+b, 0)

console.log("\n==================================")
console.log(`GRAND TOTAL SADA METTI: ${allSada.length} Pcs | ${totalWt.toFixed(3)}g`)
